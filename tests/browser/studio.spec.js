import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("negative: choosing no size explains the problem and keeps the bag empty", async ({
  page,
}) => {
  await page.goto("/shop.html");
  await page.getByRole("button", { name: "Add to bag", exact: true }).click();
  await expect(page.locator("#size-error")).toBeVisible();
  await expect(page.locator("#size-error")).not.toBeEmpty();
  await expect(page.locator("#bag-count")).toHaveText("0");
});

test("positive: a shopper can choose sizes, add items, and empty the demo bag", async ({
  page,
}) => {
  await page.goto("/shop.html");
  await expect(page.locator(".shirt-image")).toHaveAttribute(
    "src",
    "assets/elsewhere-story-portrait.png",
  );
  await expect(page.locator(".shirt-image")).toHaveAttribute(
    "alt",
    /model wearing a relaxed white T-shirt/i,
  );
  await expect(page.locator(".shirt-image")).toHaveCSS("object-fit", "contain");
  await expect(page.locator(".shirt-image")).toHaveJSProperty(
    "naturalWidth",
    768,
  );
  await expect(page.locator(".shirt-image")).toHaveJSProperty(
    "naturalHeight",
    960,
  );
  expect(
    await page.locator(".shirt-image").evaluate((image) => {
      const { width, height } = image.getBoundingClientRect();
      return width / height;
    }),
  ).toBeCloseTo(0.8, 2);
  await expect(page.locator(".price")).toContainText("$15");
  await page.locator('input[name="size"][value="M"]').check();
  await page.getByRole("button", { name: "Add to bag", exact: true }).click();
  await expect(page.locator("#bag-count")).toHaveText("1");
  await expect(page.locator("#bag-items")).toContainText("Size: M | $15.00");
  await page.locator('input[name="size"][value="L"]').check();
  await page.getByRole("button", { name: "Add to bag", exact: true }).click();
  await expect(page.locator("#bag-count")).toHaveText("2");
  await page.getByRole("button", { name: "Clear bag", exact: true }).click();
  await expect(page.locator("#bag-count")).toHaveText("0");
  await page.reload();
  await expect(page.locator("#bag-count")).toHaveText("0");
});

test("positive: removing one item keeps the other bag item", async ({
  page,
}) => {
  await page.goto("/shop.html");
  for (const size of ["M", "L"]) {
    await page.locator(`input[name="size"][value="${size}"]`).check();
    await page.getByRole("button", { name: "Add to bag", exact: true }).click();
  }

  await expect(page.locator("#bag-items .bag-item")).toHaveCount(2);
  await page
    .locator("#bag-items .bag-item")
    .first()
    .getByRole("button", { name: "Remove", exact: true })
    .click();

  await expect(page.locator("#bag-count")).toHaveText("1");
  await expect(page.locator("#bag-items .bag-item")).toHaveCount(1);
  await expect(page.locator("#bag-items")).toContainText("Size: L | $15.00");
});

test("Shop offers optional styling prompts using clothes visitors already own", async ({
  page,
}) => {
  await page.goto("/shop.html");
  const prompts = page.locator(".style-prompt");

  await expect(
    page.getByRole("heading", { name: "Make it yours." }),
  ).toBeVisible();
  await expect(prompts).toHaveCount(3);
  await expect(page.locator(".style-prompts")).toContainText(
    "pieces you already own",
  );
  await expect(prompts.nth(0)).toContainText("Try a tuck");
  await expect(prompts.nth(1)).toContainText("Add a layer");
  await expect(prompts.nth(2)).toContainText("Bring your own color");
  await expect(page.locator("#bag-count")).toHaveText("0");
});

test("keyboard: the skip link reaches main and the size controls work without a mouse", async ({
  page,
}) => {
  await page.goto("/shop.html");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: /skip/i });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  // Focus a native radio, then use its real keyboard behavior and the next control.
  await page.locator('input[name="size"][value="S"]').focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator('input[name="size"][value="M"]')).toBeChecked();
  await expect(
    page.getByRole("link", { name: "Elsewhere", exact: true }),
  ).toBeVisible();
  const navLabels = await page
    .locator(".main-nav a")
    .evaluateAll((anchors) =>
      anchors.map((anchor) => anchor.textContent.trim()),
    );
  expect(navLabels).toEqual(["Elsewhere", "Shop", "Our Story"]);
  await expect(page.locator(".shirt-image")).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Add to bag", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#bag-count")).toHaveText("1");
});

test("homepage keeps the welcome separate from shopping and Our Story", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".campaign-copy")).toBeVisible();
  await expect(page.locator(".site-header .wordmark")).toHaveCount(0);
  await expect(page.locator("#product-form")).toHaveCount(0);
  await expect(page.locator("#beliefs-title")).toHaveCount(0);
  await expect(
    page.getByText("Welcome to Elsewhere", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".campaign-portrait img")).toHaveAttribute(
    "src",
    "assets/elsewhere-story-portrait.png",
  );
  await expect(page.locator(".campaign-portrait img")).toHaveCSS(
    "object-fit",
    "contain",
  );
  await page.getByRole("link", { name: "Explore the collection" }).click();
  await expect(page).toHaveURL(/shop\.html$/);
  await expect(page.getByRole("heading", { name: /The white/ })).toBeVisible();
  await page
    .locator(".main-nav")
    .getByRole("link", { name: "Our Story" })
    .click();
  await expect(page).toHaveURL(/studio\.html$/);
  await expect(
    page.getByRole("heading", { name: /Less ordinary/ }),
  ).toBeVisible();
});

test("Our Story is its own complete page and links to the shop", async ({
  page,
}) => {
  await page.goto("/studio.html");
  await expect(page.locator("#beliefs-title")).toBeVisible();
  await expect(
    page.getByText("Welcome to Elsewhere", { exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByText(
      /Sage brings a thoughtful point of view; Creator makes space for experimentation/,
    ),
  ).toHaveCount(0);
  await expect(page.locator(".story-hero-image img")).toHaveAttribute(
    "src",
    "assets/elsewhere-story-portrait.png",
  );
  await expect(page.locator(".story-cta h2")).toHaveText(
    "Make the ordinary your own.",
  );
  await page.getByRole("link", { name: "Shop Elsewhere" }).click();
  await expect(page).toHaveURL(/shop\.html$/);
});

for (const route of ["/", "/shop.html", "/studio.html", "/styleguide.html"]) {
  test(`page integrity and automated accessibility: ${route}`, async ({
    page,
  }) => {
    const failures = [];
    page.on("pageerror", (error) => failures.push(error.message));
    page.on("response", (response) => {
      if (
        response.url().startsWith("http://127.0.0.1:5174") &&
        response.status() >= 400
      ) {
        failures.push(`${response.status()} ${response.url()}`);
      }
    });
    await page.goto(route);
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page).toHaveTitle(/Elsewhere/);
    const navLabels = await page
      .locator(".main-nav a")
      .evaluateAll((anchors) =>
        anchors.map((anchor) => anchor.textContent.trim()),
      );
    expect(navLabels).toEqual(["Elsewhere", "Shop", "Our Story"]);
    const brokenImages = await page
      .locator("img")
      .evaluateAll((images) =>
        images
          .filter((image) => !image.complete || image.naturalWidth === 0)
          .map((image) => image.src),
      );
    expect(brokenImages).toEqual([]);
    const links = await page
      .locator("a[href]")
      .evaluateAll((anchors) =>
        anchors.map((anchor) => anchor.getAttribute("href")),
      );
    for (const href of links) {
      if (href.startsWith("#")) {
        expect(
          await page.locator(`[id="${href.slice(1)}"]`).count(),
          href,
        ).toBeGreaterThan(0);
      } else if (!/^(https?:|mailto:)/.test(href)) {
        const response = await page.request.get(new URL(href, page.url()).href);
        expect(response.ok(), href).toBeTruthy();
      }
    }
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
    expect(failures).toEqual([]);
  });

  test(`narrow screen: readable page without horizontal overflow ${route}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
    await expect(page.getByRole("main")).toBeVisible();
    if (route === "/shop.html") {
      const mobileHeader = await page.evaluate(() => ({
        bagTop: document.querySelector(".bag-link").getBoundingClientRect().top,
        navTop: document.querySelector(".main-nav").getBoundingClientRect().top,
        navLinkTops: [...document.querySelectorAll(".main-nav a")].map(
          (link) => link.getBoundingClientRect().top,
        ),
      }));
      expect(mobileHeader.navTop).toBeGreaterThan(mobileHeader.bagTop);
      expect(
        Math.max(...mobileHeader.navLinkTops) -
          Math.min(...mobileHeader.navLinkTops),
      ).toBeLessThan(2);
    }
  });
}
