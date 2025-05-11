import { test as baseTest, expect, Page } from '@playwright/test';
import { wrapPageWithAllure } from '../ui/';

declare global {
  namespace PlaywrightTestArgs {
    interface Fixtures {}
  }
}

export const test = baseTest.extend<{
  page: Page;
}>({
  page: async ({ page }, use) => {
    wrapPageWithAllure(page);
    await use(page);
  },
});

export { expect };
