export { test } from '@playwright/test';
import { expect as baseExpect } from '@playwright/test';

/*
  Тут создаются проверки типов значений, пришедших в api ответе
  Статья, в которой описана реализация: https://playwrightsolutions.com/creating-custom-expects-in-playwright-how-to-write-your-own-assertions/
*/

interface CustomMatchers<R = unknown> {
  toBeNumber(): R;
  toBeString(): R;
  toBeBoolean(): R;
  toBeObject(): R;
  toBeArray(): R;
  toBeNull(): R;
  toBeUndefined(): R;
}

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> extends CustomMatchers<R> {}
  }
}

// TODO: добавить шаги в Allure отчет
export const expect = baseExpect.extend({
  toBeNumber(received) {
    const expectedType = 'number';
    const pass = typeof received === expectedType;
    return {
      message: () => (pass ? 'passed' : `Expected ${expectedType}, but received ${typeof received}\n`),
      pass: pass,
    };
  },

  toBeString(received) {
    const expectedType = 'string';
    const pass = typeof received === expectedType;
    return {
      message: () => (pass ? 'passed' : `Expected ${expectedType}, but received ${typeof received}\n`),
      pass: pass,
    };
  },

  toBeBoolean(received) {
    const expectedType = 'boolean';
    const pass = typeof received === expectedType;
    return {
      message: () => (pass ? 'passed' : `Expected ${expectedType}, but received ${typeof received}\n`),
      pass: pass,
    };
  },

  toBeObject(received) {
    const expectedType = 'object';
    const pass = typeof received === expectedType;
    return {
      message: () => (pass ? 'passed' : `Expected ${expectedType}, but received ${typeof received}\n`),
      pass: pass,
    };
  },

  toBeArray(received) {
    const pass = Array.isArray(received);
    return {
      message: () => (pass ? 'passed' : `Expected array, but received ${typeof received}\n`),
      pass: pass,
    };
  },

  toBeNull(received) {
    const pass = received === null;
    return {
      message: () => (pass ? 'passed' : `Expected null, but received ${received}\n`),
      pass: pass,
    };
  },

  toBeUndefined(received) {
    const expectedType = undefined;
    const pass = typeof received === expectedType;
    return {
      message: () => (pass ? 'passed' : `Expected ${expectedType}, but received ${typeof received}\n`),
      pass: pass,
    };
  },
});
