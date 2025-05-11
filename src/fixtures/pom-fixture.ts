import { test as baseTest, expect, Page } from '@playwright/test';
import { MainPage } from '../ui/pages/main.page';

declare global {
  namespace PlaywrightTestArgs {
    interface Fixtures {
      mainPage: MainPage;
    }
  }
}

export const test = baseTest.extend<{
  mainPage: MainPage;
}>({
  mainPage: async ({ page }, use) => {
    const mainPage = new MainPage(page);
    await use(mainPage);
  },
});

export { expect };
