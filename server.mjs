import { createServer } from "node:http";
import { readFile, realpath } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { tmpdir } from "node:os";
import { createDevelopmentReload } from "./dev-reload.mjs";
import { createOrderStore } from "./order-store.mjs";

const publicDirectory = path.resolve(
  fileURLToPath(new URL("./public/", import.meta.url)),
);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".json": "application/json; charset=utf-8",
};

// Local server only. GitHub Pages serves the unchanged public/ files.
export function createApp({
  development = false,
  publicRoot = publicDirectory,
  databasePath = process.env.IS117_DEMO_DB ??
    path.join(tmpdir(), "elsewhere-demo-orders.sqlite"),
} = {}) {
  const reload = development ? createDevelopmentReload(publicRoot) : undefined;
  const orderStore = createOrderStore(databasePath);
  const sendJson = (response, status, payload) => {
    response.writeHead(status, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(JSON.stringify(payload));
  };
  const app = createServer(async (request, response) => {
    if (!["GET", "HEAD"].includes(request.method)) {
      if (!request.url?.startsWith("/api/")) {
        response.writeHead(405, { Allow: "GET, HEAD" });
        response.end(
          "This demo only accepts simulated orders through its local API.",
        );
        return;
      }
    }
    try {
      const url = new URL(request.url, "http://localhost");
      const pathname = decodeURIComponent(url.pathname);

      if (pathname.startsWith("/api/")) {
        if (request.method === "GET" && pathname === "/api/health") {
          sendJson(response, 200, { storage: "sqlite" });
          return;
        }

        if (request.method === "GET" && pathname === "/api/orders") {
          sendJson(response, 200, orderStore.getOrders());
          return;
        }

        if (request.method === "POST" && pathname === "/api/orders") {
          const origin = request.headers.origin;
          const address = app.address();
          const port =
            typeof address === "object" && address ? address.port : 0;
          if (
            origin &&
            ![`http://127.0.0.1:${port}`, `http://localhost:${port}`].includes(
              origin,
            )
          ) {
            sendJson(response, 403, { error: "Use the local Elsewhere demo." });
            return;
          }

          let rawBody = "";
          for await (const chunk of request) {
            rawBody += chunk;
            if (rawBody.length > 8192) {
              sendJson(response, 413, {
                error: "Order details are too large.",
              });
              return;
            }
          }

          let body;
          try {
            body = JSON.parse(rawBody);
          } catch {
            sendJson(response, 400, { error: "Enter valid order details." });
            return;
          }

          if (
            !body ||
            typeof body.email !== "string" ||
            body.email.length > 120 ||
            !/^\S+@\S+\.\S+$/.test(body.email)
          ) {
            sendJson(response, 400, { error: "Enter a valid demo email." });
            return;
          }

          if (
            !Array.isArray(body.items) ||
            body.items.length < 1 ||
            body.items.length > 4
          ) {
            sendJson(response, 400, { error: "Add at least one T-shirt." });
            return;
          }

          const allowedSizes = new Set(["S", "M", "L", "XL"]);
          const validItems = body.items.every(
            (item) =>
              item &&
              allowedSizes.has(item.size) &&
              Number.isInteger(item.quantity) &&
              item.quantity >= 1 &&
              item.quantity <= 5,
          );
          const totalQuantity = body.items.reduce(
            (sum, item) =>
              sum + (Number.isInteger(item?.quantity) ? item.quantity : 0),
            0,
          );
          if (!validItems || totalQuantity > 20) {
            sendJson(response, 400, {
              error: "Choose sizes S, M, L, or XL and quantities from 1 to 5.",
            });
            return;
          }

          const order = orderStore.createOrder(
            body.items.map(({ size, quantity }) => ({ size, quantity })),
          );
          sendJson(response, 201, order);
          return;
        }

        sendJson(response, 404, { error: "Demo API route not found." });
        return;
      }

      if (reload?.handle(pathname, request, response)) return;
      const segments = pathname.split("/");
      if (
        segments.some((segment) => segment.startsWith(".")) ||
        pathname.includes("\\") ||
        pathname.includes("\0")
      ) {
        response.writeHead(404);
        response.end("File not found");
        return;
      }
      const filename = path.resolve(
        publicRoot,
        `.${pathname.endsWith("/") ? `${pathname}index.html` : pathname}`,
      );
      const resolvedRoot = await realpath(publicRoot);
      const resolvedFile = await realpath(filename);
      if (!resolvedFile.startsWith(`${resolvedRoot}${path.sep}`)) {
        response.writeHead(404);
        response.end("File not found");
        return;
      }
      const content = await readFile(resolvedFile);
      const servedContent =
        reload && path.extname(filename) === ".html"
          ? reload.inject(content)
          : content;
      response.writeHead(200, {
        "Content-Type":
          types[path.extname(filename)] ?? "application/octet-stream",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      response.end(request.method === "HEAD" ? undefined : servedContent);
    } catch (error) {
      const pathname = new URL(request.url, "http://localhost").pathname;
      if (pathname.startsWith("/api/")) {
        console.error("Local order API error:", error.message);
        sendJson(response, 500, {
          error: "The demo order could not be saved. Check the local server.",
        });
        return;
      }
      response.writeHead(error instanceof URIError ? 400 : 404);
      response.end(
        error instanceof URIError ? "Invalid file path" : "File not found",
      );
    }
  });
  app.on("close", () => {
    reload?.close();
    orderStore.close();
  });
  return app;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const port = Number(process.env.IS117_DEMO_PORT ?? process.env.PORT ?? 5173);
  const host = process.env.HOST ?? "127.0.0.1";
  const development = process.argv.includes("--dev");
  const app = createApp({ development });
  app.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${port} is already in use. Stop the other preview or choose another PORT.`,
      );
    } else {
      console.error(error.message);
    }
    process.exitCode = 1;
  });
  app.listen(port, host, () => {
    console.log(`Elsewhere local demo: http://${host}:${port}`);
    console.log(
      `Local SQLite database: ${process.env.IS117_DEMO_DB ?? path.join(tmpdir(), "elsewhere-demo-orders.sqlite")}`,
    );
    console.log(
      development
        ? "Development mode: saved public/ files refresh automatically. Orders are simulated and stored locally."
        : "Plain preview mode: refresh pages yourself after saving files. Orders are simulated and stored locally.",
    );
    console.log(
      "Press Ctrl+C to stop. Local changes do not publish to GitHub Pages.",
    );
  });
}
