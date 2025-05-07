import * as os from "os";
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ["list"],
    [
      "allure-playwright",
      {
        outputFolder: "allure-results",
        attachments: {
          "failed-only": true,
        },
        detail: false,
        suiteTitle: true,
        environmentInfo: {
          os_platform: os.platform(),
          os_version: os.version(),
          node_version: process.version,
        },
      },
    ],
  ],
  testDir: "./",

  use: {
    trace: "on-first-retry",
    actionTimeout: 30000,
    navigationTimeout: 30000,
    headless: true,
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: "ui-tests",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
