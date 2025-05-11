import { wrapPageWithAllureSteps } from "./decorators/page.decorators";
import { wrapNetworkActions } from "./decorators/network.decorators";

export function wrapPageWithAllure(page: any) {
  wrapPageWithAllureSteps(page);
  wrapNetworkActions(page);
}
