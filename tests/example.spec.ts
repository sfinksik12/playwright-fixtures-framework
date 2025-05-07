import { test, expect } from "../src/fixtures/base.fixture";

test("should open Docs page", async ({ page }) => {
  await page.goto("https://playwright.dev/");
});
