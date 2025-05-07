import { allure } from "allure-playwright";

export function createStepDecorator(descriptionFn: (...args: any[]) => string) {
  return function (originalMethod: Function) {
    return async function (...args: any[]) {
      const description = descriptionFn.apply(this, args);
      return await allure.step(description, async () => {
        return await originalMethod.apply(this, args);
      });
    };
  };
}
