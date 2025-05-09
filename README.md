# 🎭 Playwright Fixture UI Framework 🚀

Добро пожаловать! Это мини-фреймворк, созданный для упрощения написания UI-тестов с использованием **Playwright** и **Allure Reporter**. Он предоставляет надежную структуру и полезные инструменты для разработки масштабируемых, информативных и легко поддерживаемых UI-автотестов.

## ✨ Ключевые возможности

- 🧩 **Page Object & Fragment Object**: Элегантная организация кода и максимальное повторное использование UI-элементов.
- 📊 **Автоматическое логирование в Allure**: Детальные отчеты о каждом UI-действии и сетевом запросе "из коробки".
- 🔧 **Кастомные фикстуры Playwright**: Удобная работа с POM, автоматическая подготовка окружения для тестов.
- ⚙️ **CI/CD интеграция**: Готовые пайплайны для GitHub Actions, автоматическая публикация отчетов на GitHub Pages.

## 📋 Требования

- 🟢 Node.js: `18+`
- 📦 npm (`8+`) или yarn (`1.22+`)
- 🎭 Playwright: `1.52.0+` (_рекомендуется последняя версия_)

## 🛠️ Установка и настройка

1.  **Клонируйте репозиторий:**
    ```bash
    git clone https://github.com/your-org/playwright-fixture-ui-framework.git
    cd playwright-fixtures-framework
    ```
2.  **Установите зависимости:**
    ```bash
    npm install
    ```
3.  **Установите браузеры для Playwright:**
    ```bash
    npx playwright install
    ```

## 📁 Структура проекта

```
playwright-fixtures-framework/
├── 📁 src/                     # Исходный код фреймворка 🛠️
│   ├── 🔩 fixtures/
│   │   └── base.fixture.ts    # Основные фикстуры с POM интеграцией
│   ├── ✨ allure-wrapper/      # Интеграция с Allure
│   │   ├── 📐 decorators/      # Декораторы для автологирования
│   │   │   ├── page.decorators.ts
│   │   │   ├── network.decorators.ts
│   │   │   └── locator.decorators.ts
│   │   └── index.ts         # Точка входа Allure обертки
│   ├── 📄 pages/               # Page Object классы
│   │   ├── base.page.ts
│   ├── 🧩 fragments/           # Fragment Object классы (компоненты UI)
│   │   ├── base.fragment.ts #
│   └── 🛠️ utils/               # Вспомогательные функции

```

## 🚀 Быстрый старт

### 💨 Запуск тестов локально

```bash
npx playwright test
```

### 📊 Генерация и просмотр отчёта Allure

1.  **После выполнения тестов, сгенерируйте отчёт:**
    ```bash
    # Команда создаст отчет в папке allure-report
    # --clean удалит содержимое папки allure-report перед генерацией
    npx allure generate allure-results --clean -o allure-report
    ```
2.  **Откройте сгенерированный отчёт в браузере:**
    ```bash
    npx allure open allure-report
    ```

## 📝 Примеры использования

Ниже приведены примеры, демонстрирующие основные возможности фреймворка.

### 1. Базовый тест с прямым доступом к `page`

Этот пример показывает, как использовать стандартную фикстуру `page` (которая уже обернута для Allure и готова к использованию).

```typescript
import { test, expect } from "../src/fixtures/base.fixture";

test("базовый тест с доступом к page", async ({ page }) => {
  await page.goto("https://playwright.dev/");
  await expect(page).toHaveTitle(/Playwright/);
});
```

### 2. 🏛️ Использование Page Object и Fragment Object

Демонстрация работы с `MainPage` и его частью `NavbarFragment` для создания хорошо структурированных и поддерживаемых тестов.

```typescript
import { test, expect } from "../src/fixtures/base.fixture";

test("тест с использованием Page Object и Fragment", async ({ mainPage }) => {
  // mainPage - это экземпляр MainPage, предоставляемый фикстурой
  // Используем MainPage и его фрагмент NavbarFragment
  await mainPage.goto(); // Переход на URL, указанный в mainPage.url
  await mainPage.navbar.selectLanguage("Python"); // Пример вызова метода фрагмента

  // Проверка интерфейса после действия
  await expect(mainPage.navbar.languageMenuTrigger).toHaveText("Python");
});
```

## 🧩 Расширение фреймворка

Фреймворк спроектирован так, чтобы его было легко расширять.

### ➕ Добавление новой страницы (Page Object)

1.  **Создайте файл для новой страницы**, например `src/pages/login.page.ts`:

    ```typescript
    // src/pages/login.page.ts
    import { Page, Locator } from "@playwright/test";
    import { BasePage } from "./base.page";

    export class LoginPage extends BasePage {
      constructor(page: Page) {
        super(page);
      }
    }
    ```

2.  **Зарегистрируйте новую страницу в фикстурах** (`src/fixtures/base.fixture.ts`):
    Добавьте ее в определение глобальных типов и в `baseTest.extend()`:

    ```typescript
    // src/fixtures/base.fixture.ts
    import { test as baseTest, Page, expect } from "@playwright/test";
    import { wrapPageWithAllure } from "../allure-wrapper";
    import { MainPage } from "../pages/main.page";
    import { LoginPage } from "../pages/login.page"; // 👈 1. Импортируем новую страницу

    declare global {
      namespace PlaywrightTestArgs {
        interface Fixtures {
          page: Page;
          mainPage: MainPage;
          loginPage: LoginPage; // 👈 2. Объявляем тип для новой фикстуры
        }
      }
    }

    export const test = baseTest.extend<{
      page: Page;
      mainPage: MainPage;
      loginPage: LoginPage; // 👈 3. Добавляем тип в параметры generic функции extend
    }>({
      page: async ({ page }, use) => {
        wrapPageWithAllure(page);
        await use(page);
      },
      mainPage: async ({ page }, use) => {
        const mainPage = new MainPage(page);
        await use(mainPage);
      },
      // 👇 4. Определяем саму фикстуру для LoginPage
      loginPage: async ({ page }, use) => {
        const loginPageInstance = new LoginPage(page);
        await use(loginPageInstance);
      },
    });

    export { expect };
    ```

    Теперь фикстура `loginPage` будет доступна в ваших тестах так же, как `page` и `mainPage`!

### ✨ Добавление нового фрагмента (Fragment Object)

Аналогично страницам, вы можете создавать и переиспользовать фрагменты UI (например, шапка, подвал, сложные меню).
**Пример кода для фрагмента:**

Допустим, мы хотим создать фрагмент для меню пользователя (`UserMenuFragment`).

**1. Создание класса фрагмента:**

```typescript
// src/fragments/user-menu.fragment.ts
import { Page, Locator } from "@playwright/test";
import { BaseFragment } from "./base.fragment";
import { allure } from "allure-playwright";

export class UserMenuFragment extends BaseFragment {
  protected initLocators(): void {
    this.locators = {
      profileLink: this.page.getByRole("link", { name: "My Profile" }),
      logoutButton: this.page.getByRole("button", { name: "Logout" }),
    };
  }

  async navigateToProfile(): Promise<void> {
    await allure.step(
      "Переход на страницу профиля через меню пользователя",
      async () => {
        await this.profileLink.click();
      }
    );
  }

  async logout(): Promise<void> {
    await allure.step("Выход из системы через меню пользователя", async () => {
      await this.logoutButton.click();
    });
  }
}
```

**2. Использование фрагмента в Page Object:**

```typescript
// src/pages/home.page.ts
import { Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { UserMenuFragment } from "../fragments/user-menu.fragment"; // 👈 Импортируем фрагмент

export class HomePage extends BasePage {
  readonly url: string = "/home";
  readonly userMenu: UserMenuFragment; // 👈 Объявляем свойство для фрагмента

  constructor(page: Page) {
    super(page);
    this.userMenu = new UserMenuFragment(this.page); // 👈 Инициализируем фрагмент
  }
}
```

Теперь в ваших тестах вы сможете вызывать `await homePage.userMenu.navigateToProfile();` или `await homePage.openProfileFromMenu();`.
Это делает код страниц чище и позволяет легко переиспользовать общие компоненты интерфейса.
