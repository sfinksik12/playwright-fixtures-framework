# Playwright-fixture-ui-framework

Мини-фреймворк для написания UI-тестов с Playwright и интеграцией Allure.

## Особенности

- Кастомные фикстуры для Playwright (страница, POM)
- Автоматическое логирование шагов и сетевого трафика в Allure
- Page Object и Fragment Object паттерны
- Поддержка merge fixtures для сложных сценариев

## Установка

```bash
git clone https://github.com/your-org/playwright-fixture-ui-framework.git
cd playwright-fixtures-framework
npm install
```

## Структура проекта

```
playwright-fixtures-framework/
├── src/
│   ├── fixtures/            # Фикстуры Playwright (page, mainPage, mergeFixture и т.д.)
│   ├── allure-wrapper/      # Декораторы для логирования шагов и сетевых действий
│   ├── pages/               # Page Object классы (MainPage, BasePage)
│   ├── fragments/           # Fragment Object классы (NavbarFragment, BaseFragment)
│   └── utils/               # Утилиты (форматирование селекторов и т.д.)
├── tests/                   # Тесты примеры (используют `test` из fixtures)
├── playwright.config.ts     # Конфиг Playwright + Allure
├── package.json             # Зависимости и мета
```

## Быстрый старт

### Простой тест

```ts
// tests/example.spec.ts
import { test, expect } from "../src/fixtures/base.fixture";

test("Простой сценарий", async ({ page }) => {
  await page.goto("https://playwright.dev/");
  await expect(page).toHaveTitle(/Playwright/);
});
```

### Page Object + Фрагмент

```ts
import { test, expect } from "../src/fixtures/base.fixture";
import { NavbarFragment } from "../src/fragments/navbar.fragment";

test("Проверка Navbar", async ({ mainPage }) => {
  await mainPage.goto("https://playwright.dev/");
  await mainPage.navbar.goToDocs();
  const title = await mainPage.navbar.getTitleText();
  expect(title).toContain("Playwright");
});
```

### Генерация отчёта Allure

```bash
npx playwright test
npx allure generate --clean
npx allure open
```

## Добавление новых страниц и фрагментов

1. Создайте класс в `src/pages` наследующий `BasePage`.
2. Создайте класс-фрагмент в `src/fragments` наследующий `BaseFragment`.
3. Пропишите локаторы и методы во `initLocators` и публичные методы, обёрнутые в `allure.step`.
4. В фикстуре `base.fixture.ts` расширьте `test.extend` новым полем.
