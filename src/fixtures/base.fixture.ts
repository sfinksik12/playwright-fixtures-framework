import { test as baseTest, expect, Page } from "@playwright/test";
import { wrapPageWithAllure } from "../ui/";
import { MainPage } from "../ui/pages/main.page";

declare global {
  namespace PlaywrightTestArgs {
    interface Fixtures {
      page: Page;
      mainPage: MainPage;
    }
  }
}

export const test = baseTest.extend<{
  page: Page;
  mainPage: MainPage;
}>({
  page: async ({ page }, use) => {
    wrapPageWithAllure(page);
    await use(page);
  },

  mainPage: async ({ page }, use) => {
    const mainPage = new MainPage(page);
    await use(mainPage);
  },
});

export { expect };
