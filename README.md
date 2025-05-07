# Playwright Fixture UI Framework

Мини-фреймворк для написания UI-тестов с Playwright и интеграцией Allure. Фреймворк предоставляет структуру и инструменты для создания масштабируемых, информативных и поддерживаемых UI-тестов.

## 🚀 Возможности

- **Page Object и Fragment Object** паттерны для организации кода и повторного использования
- **Автоматическое логирование в Allure** всех действий UI и сетевых запросов
- **Кастомные фикстуры** для Playwright с поддержкой POM
- **CI/CD интеграция** с GitHub Actions и GitHub Pages для отчетов
- **Типизация TypeScript** для предотвращения ошибок и автодополнения в IDE
- **Модульная архитектура** для легкого расширения функциональности

## 📋 Требования

- Node.js 18+
- npm или yarn
- Playwright 1.52.0+

## 🔧 Установка

```bash
# Клонирование репозитория
git clone https://github.com/your-org/playwright-fixture-ui-framework.git
cd playwright-fixtures-framework

# Установка зависимостей
npm install

# Установка браузеров Playwright
npx playwright install
```

## 📁 Структура проекта

```
playwright-fixtures-framework/
├── .github/workflows/       # CI/CD пайплайны для GitHub Actions
├── src/                     # Исходный код фреймворка
│   ├── fixtures/            # Фикстуры Playwright (page, mainPage)
│   │   └── base.fixture.ts  # Основные фикстуры с POM интеграцией
│   ├── allure-wrapper/      # Интеграция с Allure
│   │   ├── decorators/      # Декораторы для автологирования
│   │   │   ├── page.decorators.ts     # Декораторы для Page
│   │   │   ├── network.decorators.ts  # Логирование сетевых запросов
│   │   │   └── locator.decorators.ts  # Декораторы для Locator
│   │   └── index.ts         # Точка входа Allure обертки
│   ├── pages/               # Page Object классы
│   │   ├── base.page.ts     # Базовый класс страницы
│   │   └── main.page.ts     # Главная страница приложения
│   ├── fragments/           # Fragment Object классы (компоненты UI)
│   │   ├── base.fragment.ts # Базовый класс фрагмента
│   │   └── navbar.fragment.ts # Компонент навигации
│   └── utils/               # Вспомогательные функции
├── tests/                   # Тесты с использованием фреймворка
│   └── example.spec.ts      # Примеры тестов
├── allure-results/          # Результаты выполнения тестов для Allure
├── playwright.config.ts     # Конфигурация Playwright + Allure
├── package.json             # Зависимости и скрипты
└── README.md                # Документация
```

## 🏃 Быстрый старт

### Запуск тестов локально

```bash
# Запуск всех тестов
npx playwright test

# Запуск в определенном браузере
npx playwright test --browser=chromium

# Запуск с интерфейсом отладки
npx playwright test --debug

# Запуск конкретного теста
npx playwright test tests/example.spec.ts
```

### Генерация и просмотр отчёта Allure

```bash
# Генерация отчёта
npx allure generate allure-results --clean -o allure-report

# Открытие отчёта в браузере
npx allure open allure-report
```

## 📝 Примеры использования

### 1. Простой тест с доступом к Page

```typescript
// tests/simple.spec.ts
import { test, expect } from "../src/fixtures/base.fixture";

test("базовый тест с доступом к page", async ({ page }) => {
  await page.goto("https://playwright.dev/");
  await expect(page).toHaveTitle(/Playwright/);
});
```

### 2. Использование Page Object и фрагментов

```typescript
// tests/pom-example.spec.ts
import { test, expect } from "../src/fixtures/base.fixture";

test("тест с использованием Page Object", async ({ mainPage }) => {
  // Используем MainPage и NavbarFragment
  await mainPage.goto("https://playwright.dev/");
  await mainPage.navbar.selectLanguage("Python");

  // Проверка интерфейса после действия
  await expect(mainPage.navbar.languageMenuTrigger).toHaveText("Python");
});
```

### 3. Тест с детальным логированием Allure

```typescript
// tests/allure-example.spec.ts
import { test, expect } from "../src/fixtures/base.fixture";
import { allure } from "allure-playwright";

test("тест с подробным логированием в Allure", async ({ mainPage }) => {
  // Добавляем метаданные теста
  allure.tag("smoke");
  allure.severity("critical");
  allure.label("feature", "Navigation");

  // Шаги выполнения автоматически логируются
  await test.step("Открываем главную страницу", async () => {
    await mainPage.goto("https://playwright.dev/");
    // Добавляем скриншот в отчет
    const screenshot = await mainPage.page.screenshot();
    await allure.attachment("screenshot", screenshot, {
      contentType: "image/png",
    });
  });

  // Параметры и проверки
  const title = await mainPage.page.title();
  allure.parameter("Page Title", title);
  expect(title).toContain("Playwright");
});
```

## 🔄 CI/CD интеграция

Фреймворк содержит готовый GitHub Actions workflow для запуска тестов и публикации Allure отчетов:

- Автоматический запуск тестов при push/pull request
- Генерация Allure отчета после прогона
- Публикация отчета на GitHub Pages
- Легкая конфигурация через настройки проекта

### Настройка GitHub Pages для отчетов

1. В репозитории перейти в **Settings** → **Pages**
2. В разделе **Build and deployment** выбрать **Source**: **GitHub Actions**
3. Запустить workflow из `.github/workflows/playwright-allure.yml`

## 🧩 Расширение фреймворка

### Добавление новой страницы

```typescript
// src/pages/login.page.ts
import { BasePage } from "./base.page";
import { Page } from "@playwright/test";

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Локаторы и методы страницы
  readonly usernameInput = this.page.getByLabel("Username");
  readonly passwordInput = this.page.getByLabel("Password");
  readonly loginButton = this.page.getByRole("button", { name: "Login" });

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### Регистрация страницы в фикстурах

```typescript
// src/fixtures/base.fixture.ts
import { test as baseTest } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

export const test = baseTest.extend<{
  loginPage: LoginPage;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});
```

## 📊 Анализ отчетов Allure

Отчеты Allure предоставляют множество полезной информации:

- **Обзор выполнения тестов** — общая статистика и тренды
- **Категории ошибок** — группировка проблем по типам
- **Таймлайн** — хронология выполнения тестов
- **Поведения** — представление в виде пользовательских сценариев
- **Метрики производительности** — время выполнения тестов
