import { test, expect } from "../src/fixtures/base.fixture";
import { BasePage } from "../src/pages/base.page";
import { allure } from "allure-playwright";

test.describe("NavbarFragment @ui", () => {
  test.beforeEach(async ({ mainPage, page }) => {
    allure.label("epic", "UI Components");
    allure.label("feature", "Navigation Bar");
    await page.goto("https://playwright.dev/");
  });

  test("goToDocs @smoke", async ({ mainPage, page }) => {
    allure.label("story", "Documentation Navigation");
    allure.severity("blocker");
    allure.tag("smoke");

    await test.step("Переходим в документацию", async () => {
      await mainPage.navbar.goToDocs();
      const screenshot = await page.screenshot();
      await allure.attachment("screenshot", screenshot, {
        contentType: "image/png",
      });
    });

    await test.step("Проверяем URL", async () => {
      const url = page.url();
      allure.parameter("Current URL", url);
      expect(url).toContain("/docs/intro");
    });
  });

  test("goToApi", async ({ mainPage }) => {
    await mainPage.navbar.goToApi();
  });

  test("goToCommunity", async ({ mainPage }) => {
    await mainPage.navbar.goToCommunity();
  });

  test("openGithub", async ({ mainPage }) => {
    await mainPage.navbar.openGithub();
  });

  test("openDiscord", async ({ mainPage }) => {
    await mainPage.navbar.openDiscord();
  });

  test("search", async ({ mainPage }) => {
    await mainPage.navbar.search();
  });

  test("toggleTheme", async ({ mainPage }) => {
    await mainPage.navbar.toggleTheme();
  });
});
