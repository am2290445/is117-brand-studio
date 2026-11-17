import { defineConfig, devices } from "@playwright/test";

const port = process.env.E2E_PORT ?? "5174";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: { baseURL: `http://127.0.0.1:${port}`, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "node server.mjs",
    url: `http://127.0.0.1:${port}`,
    env: { PORT: port },
    reuseExistingServer: false,
    timeout: 15000,
  },
});
