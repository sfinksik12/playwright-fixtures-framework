// tests/example.spec.ts
import { test, expect } from "../src/fixtures/base.fixture";
import { BasePage } from "../src/pages/base.page";

test("пример с логированием в Allure", async ({ page }) => {
  const basePage = new BasePage(page);
  await basePage.goto("https://playwright.dev/");
});
test("should navigate to Docs and switch language", async ({ mainPage }) => {
  await mainPage.goto("https://playwright.dev/");
  await mainPage.navbar.selectLanguage("Python");
  await mainPage.navbar.toggleTheme();
});

test.describe("NavbarFragment", () => {
  test.beforeEach(async ({ mainPage, page }) => {
    await page.goto("https://playwright.dev/");
  });

  test("goToDocs", async ({ mainPage }) => {
    await mainPage.navbar.goToDocs();
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

  test("getTitleText", async ({ mainPage }) => {
    const text = await mainPage.navbar.getTitleText();
    expect(text).toContain("Playwright");
  });

  test("toggleTheme", async ({ mainPage }) => {
    await mainPage.navbar.toggleTheme();
  });

  test("выбор каждого языка и проверка выделения", async ({ mainPage }) => {
    const languages = ["Python", "Java", ".NET"] as const;
    for (const lang of languages) {
      await mainPage.navbar.selectLanguage(lang);
      await expect(mainPage.navbar.languageMenuTrigger).toHaveText(lang);
    }
  });
});
