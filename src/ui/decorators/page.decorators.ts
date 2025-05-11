import { Page } from '@playwright/test';
import { createStepDecorator } from './step.decorator';
import { wrapLocatorActions } from './locator.decorators';
import { locatorCreators } from './constants';

export function wrapPageWithAllureSteps(page: Page): void {
  const originalGoto = page.goto.bind(page);
  page.goto = createStepDecorator((...args) => {
    let urlDescription = '<без URL>';

    if (typeof args[0] === 'string') {
      urlDescription = args[0];
    } else if (args[0] && typeof args[0] === 'object') {
      urlDescription = '<URL не указан, использованы опции>';
    }

    return `Переход по URL: ${urlDescription}`;
  })(async (...args: any) => {
    return await originalGoto(...args);
  });

  for (const method of locatorCreators) {
    if (page[method]) {
      const originalMethod = (page as any)[method].bind(page);
      (page as any)[method] = function wrapped(...args: any[]) {
        const selector = args[0];

        const locator = originalMethod(...args);
        wrapLocatorActions(locator, selector);
        return locator;
      };
    }
  }
}
