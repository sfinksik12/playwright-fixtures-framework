import { Locator } from "@playwright/test";
import { ACTION_TEMPLATES } from "./action-templates";
import { createStepDecorator } from "./step.decorator";
import { format, formatSelector } from "../../utils/format.utils";


export function wrapLocatorActions(locator: Locator, rawSelector: any): void {
  const selectorDesc = formatSelector(rawSelector);

  for (const [action, template] of Object.entries(ACTION_TEMPLATES)) {
    const method = (locator as any)[action];
    if (typeof method === "function") {
      const decorator = createStepDecorator((...args) =>
        format(template, { selector: selectorDesc, ...argsToObject(args) })
      );
      (locator as any)[action] = decorator(method);
    }
  }
}

function argsToObject(args: any[]): Record<string, any> {
  return args.reduce((acc, val, i) => ({ ...acc, [i]: val }), {});
}
