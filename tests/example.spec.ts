import { test, expect } from "../src/fixtures/base.fixture";
import { BasePage } from "../src/pages/base.page";
import { allure } from "allure-playwright";

test("пример с логированием в Allure @smoke", async ({ page }) => {
  allure.severity("critical");
  allure.tag("smoke");
  allure.label("epic", "Examples");
  allure.label("feature", "Basic Features");
  allure.label("story", "Playwright Website Navigation");
  allure.description("Проверка доступности главной страницы Playwright");
  allure.link("https://playwright.dev/");

  const basePage = new BasePage(page);

  await test.step("Переходим на сайт Playwright", async () => {
    await basePage.goto("https://playwright.dev/");
    const screenshot = await page.screenshot();
    await allure.attachment("screenshot", screenshot, {
      contentType: "image/png",
    });
  });

  await test.step("Проверяем заголовок страницы", async () => {
    const title = await page.title();
    allure.parameter("Page Title", title);
    expect(title).toContain("Playwright");
  });
});

test("should navigate to Docs and switch language @regression", async ({
  mainPage,
}) => {
  allure.label("epic", "Examples");
  allure.label("feature", "Navigation");
  allure.severity("normal");

  await test.step("Переходим на сайт", async () => {
    await mainPage.goto("https://playwright.dev/");
  });

  await test.step("Выбираем язык Python", async () => {
    await mainPage.navbar.selectLanguage("Python");
    allure.parameter("Selected Language", "Python");
  });

  await test.step("Переключаем тему", async () => {
    await mainPage.navbar.toggleTheme();
  });
});

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

  test("getTitleText", async ({ mainPage }) => {
    const text = await mainPage.navbar.getTitleText();
    expect(text).toContain("Playwright");
  });

  test("toggleTheme", async ({ mainPage }) => {
    await mainPage.navbar.toggleTheme();
  });

  test("выбор каждого языка и проверка выделения @regression", async ({
    mainPage,
  }) => {
    allure.label("story", "Language Selection");
    allure.severity("critical");
    allure.tag("regression");

    const languages = ["Python", "Java", ".NET"] as const;

    for (const lang of languages) {
      await test.step(`Выбираем язык ${lang}`, async () => {
        await mainPage.navbar.selectLanguage(lang);
        await expect(mainPage.navbar.languageMenuTrigger).toHaveText(lang);
        allure.parameter("Selected Language", lang);
      });
    }
  });
});
