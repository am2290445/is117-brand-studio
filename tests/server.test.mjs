import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createApp } from "../server.mjs";

let app;
let base;
let testDirectory;
before(async () => {
  testDirectory = await mkdtemp(path.join(tmpdir(), "elsewhere-server-tests-"));
  app = createApp({ databasePath: path.join(testDirectory, "orders.sqlite") });
  app.listen(0, "127.0.0.1");
  await once(app, "listening");
  base = `http://127.0.0.1:${app.address().port}`;
});
after(async () => {
  await new Promise((resolve) => app.close(resolve));
  await rm(testDirectory, { recursive: true, force: true });
});

test("serves the storefront and shared stylesheet with useful MIME types", async () => {
  const page = await fetch(base);
  assert.equal(page.status, 200);
  assert.match(page.headers.get("content-type"), /text\/html/);
  const css = await fetch(`${base}/styles.css`);
  assert.equal(css.status, 200);
  assert.match(css.headers.get("content-type"), /text\/css/);
});

test("returns 404 for missing files and private project files", async () => {
  for (const url of [
    "/does-not-exist",
    "/.env",
    "/README.md",
    "/docs/assessment.md",
    "/%2e%2e%2fpackage.json",
    "/%2e%2e%5cpackage.json",
  ]) {
    assert.equal((await fetch(`${base}${url}`)).status, 404, url);
  }
});

test("rejects malformed paths and POST requests", async () => {
  assert.equal((await fetch(`${base}/%E0%A4%A`)).status, 400);
  const response = await fetch(base, { method: "POST" });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET, HEAD");
});

test("SQLite rejects invalid orders and restores a valid order after restart", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "elsewhere-order-test-"));
  const databasePath = path.join(directory, "orders.sqlite");
  const startServer = async () => {
    const server = createApp({ databasePath });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    return {
      server,
      baseUrl: `http://127.0.0.1:${server.address().port}`,
    };
  };
  let server;
  try {
    ({ server } = await startServer());
    let baseUrl = `http://127.0.0.1:${server.address().port}`;
    const health = await fetch(`${baseUrl}/api/health`);
    assert.deepEqual(await health.json(), { storage: "sqlite" });

    const invalid = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "demo@example.test",
        items: [{ size: "XXL", quantity: 2 }],
      }),
    });
    assert.equal(invalid.status, 400);

    const savedResponse = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "demo@example.test",
        items: [{ size: "M", quantity: 2 }],
        totalCents: 1,
      }),
    });
    assert.equal(savedResponse.status, 201);
    const saved = await savedResponse.json();
    assert.equal(saved.totalCents, 3000);
    assert.doesNotMatch(JSON.stringify(saved), /demo@example\.test/);

    await new Promise((resolve) => server.close(resolve));
    ({ server, baseUrl } = await startServer());
    const history = await fetch(`${baseUrl}/api/orders`);
    const orders = await history.json();
    assert.equal(orders.length, 1);
    assert.equal(orders[0].reference, saved.reference);
    assert.equal(orders[0].totalCents, 3000);
    assert.deepEqual(orders[0].items, [
      { size: "M", quantity: 2, unitPriceCents: 1500 },
    ]);
  } finally {
    if (server?.listening)
      await new Promise((resolve) => server.close(resolve));
    await rm(directory, { recursive: true, force: true });
  }
});

test("HEAD returns headers without downloading a page body", async () => {
  const response = await fetch(base, { method: "HEAD" });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "");
});

test("plain preview serves original HTML without development routes", async () => {
  const original = await readFile(
    new URL("../public/index.html", import.meta.url),
    "utf8",
  );
  assert.equal(await (await fetch(base)).text(), original);
  for (const route of ["/__dev/reload.js", "/__dev/events"]) {
    assert.equal((await fetch(`${base}${route}`)).status, 404);
  }
});

test("development injects its client into responses without changing saved HTML", async () => {
  const filename = new URL("../public/index.html", import.meta.url);
  const original = await readFile(filename, "utf8");
  const development = createApp({ development: true });
  development.listen(0, "127.0.0.1");
  await once(development, "listening");
  const address = `http://127.0.0.1:${development.address().port}`;
  try {
    const response = await fetch(address);
    assert.match(
      await response.text(),
      /<script src="\/__dev\/reload.js" defer><\/script>/,
    );
    const script = await fetch(`${address}/__dev/reload.js`);
    assert.match(script.headers.get("content-type"), /text\/javascript/);
    assert.match(await script.text(), /EventSource/);
    assert.equal(await readFile(filename, "utf8"), original);
    assert.equal((await fetch(`${address}/README.md`)).status, 404);
  } finally {
    await new Promise((resolve) => development.close(resolve));
  }
});

test("a symlink cannot expose a file outside the public directory", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "brand-studio-private-"));
  const publicRoot = path.join(directory, "public");
  const privateRoot = path.join(directory, "private");
  await mkdir(publicRoot);
  await mkdir(privateRoot);
  await writeFile(path.join(privateRoot, "notes.txt"), "private project notes");
  await symlink(privateRoot, path.join(publicRoot, "leak"), "junction");
  const isolated = createApp({ publicRoot });
  isolated.listen(0, "127.0.0.1");
  await once(isolated, "listening");
  try {
    assert.equal(
      (
        await fetch(
          `http://127.0.0.1:${isolated.address().port}/leak/notes.txt`,
        )
      ).status,
      404,
    );
  } finally {
    await new Promise((resolve) => isolated.close(resolve));
    await rm(directory, { recursive: true, force: true });
  }
});
