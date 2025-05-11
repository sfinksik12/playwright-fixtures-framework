import { Page } from "playwright";
import { BasePage } from "./base.page";
import { NavbarFragment } from "../fragments/navbar.fragment";

export class MainPage extends BasePage {
  readonly url = "/";

  private _navbar: NavbarFragment | undefined;

  constructor(page: Page) {
    super(page);
  }

  get navbar(): NavbarFragment {
    if (!this._navbar) {
      this._navbar = new NavbarFragment(this.page);
    }
    return this._navbar;
  }
}
