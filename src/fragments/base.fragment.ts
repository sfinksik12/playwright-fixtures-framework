
import { Page } from "@playwright/test";

export abstract class BaseFragment {
  protected locators!: Record<string, any>;

  constructor(protected page: Page) {
    this.initLocators();
  }

  protected abstract initLocators(): void;
}
