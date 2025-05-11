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
import { test, expect } from '../src/fixtures/base.fixture';

test('базовый тест с доступом к page', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});
```

### 2. 🏛️ Использование Page Object и Fragment Object

Демонстрация работы с `MainPage` и его частью `NavbarFragment` для создания хорошо структурированных и поддерживаемых тестов.

```typescript
import { test, expect } from '../src/fixtures/base.fixture';

test('тест с использованием Page Object и Fragment', async ({ mainPage }) => {
  // mainPage - это экземпляр MainPage, предоставляемый фикстурой
  // Используем MainPage и его фрагмент NavbarFragment
  await mainPage.goto(); // Переход на URL, указанный в mainPage.url
  await mainPage.navbar.selectLanguage('Python'); // Пример вызова метода фрагмента

  // Проверка интерфейса после действия
  await expect(mainPage.navbar.languageMenuTrigger).toHaveText('Python');
});
```

## 🧩 Расширение фреймворка

Фреймворк спроектирован так, чтобы его было легко расширять.

### ➕ Добавление новой страницы (Page Object)

1.  **Создайте файл для новой страницы**, например `src/pages/login.page.ts`:

    ```typescript
    // src/pages/login.page.ts
    import { Page, Locator } from '@playwright/test';
    import { BasePage } from './base.page';

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
    import { test as baseTest, Page, expect } from '@playwright/test';
    import { wrapPageWithAllure } from '../allure-wrapper';
    import { MainPage } from '../pages/main.page';
    import { LoginPage } from '../pages/login.page'; // 👈 1. Импортируем новую страницу

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
import { Page, Locator } from '@playwright/test';
import { BaseFragment } from './base.fragment';
import { allure } from 'allure-playwright';

export class UserMenuFragment extends BaseFragment {
  protected initLocators(): void {
    this.locators = {
      profileLink: this.page.getByRole('link', { name: 'My Profile' }),
      logoutButton: this.page.getByRole('button', { name: 'Logout' }),
    };
  }

  async navigateToProfile(): Promise<void> {
    await allure.step('Переход на страницу профиля через меню пользователя', async () => {
      await this.profileLink.click();
    });
  }

  async logout(): Promise<void> {
    await allure.step('Выход из системы через меню пользователя', async () => {
      await this.logoutButton.click();
    });
  }
}
```

**2. Использование фрагмента в Page Object:**

```typescript
// src/pages/home.page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { UserMenuFragment } from '../fragments/user-menu.fragment'; // 👈 Импортируем фрагмент

export class HomePage extends BasePage {
  readonly url: string = '/home';
  readonly userMenu: UserMenuFragment; // 👈 Объявляем свойство для фрагмента

  constructor(page: Page) {
    super(page);
    this.userMenu = new UserMenuFragment(this.page); // 👈 Инициализируем фрагмент
  }
}
```

Теперь в ваших тестах вы сможете вызывать `await homePage.userMenu.navigateToProfile();` или `await homePage.openProfileFromMenu();`.
Это делает код страниц чище и позволяет легко переиспользовать общие компоненты интерфейса.

## 🌐 API-тестирование

Фреймворк предоставляет мощный и удобный инструментарий для тестирования API с подробным логированием в Allure.
Его архитектура позволяет создавать высокочитаемые, поддерживаемые и информативные API-тесты.

### ⚡ Архитектура API-фреймворка

```
src/api/
├── service/              # Сервисы для работы с конкретными API
│   └── google.service.ts # Пример сервиса
├── allureReport.ts       # Интеграция с Allure для API-запросов
└── http_methods.ts       # Базовый класс API и методы для запросов
```

- **`API` класс** — базовый класс для всех сервисов, содержит методы для работы с HTTP-запросами
- **`AllureReport` класс** — отвечает за логирование запросов и ответов в Allure
- **Сервисные классы** — классы для работы с конкретными API (например, GoogleService)
- **Фикстуры** — делают сервисы доступными в тестах через удобный и типизированный интерфейс

### 🛠️ Создание нового API-сервиса

Пример создания сервиса для работы с API пользователей:

```typescript
// src/api/service/user.service.ts
import { API, httpRequest, APIOptions } from '../http_methods.js';
import { APIResponse } from '@playwright/test';

interface UserServiceResponse {
  promise: APIResponse;
  json: any;
}

export class UserService extends API {
  private serviceData = {
    // Базовый URL сервиса
    baseUrl: 'https://api.example.com',
    // Стандартные заголовки для всех запросов
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
      Accept: 'application/json',
    },
  };

  /**
   * Получение списка пользователей с пагинацией
   */
  async getUsers(page: number = 1, limit: number = 10): Promise<UserServiceResponse> {
    const stepName = 'Получение списка пользователей';

    const options: APIOptions = {
      url: this.serviceData.baseUrl,
      path: '/users',
      method: 'GET',
      headers: this.serviceData.headers,
      // Query-параметры запроса
      params: {
        page,
        limit,
      },
    };

    return await httpRequest(stepName, options, this.serviceData);
  }

  /**
   * Создание нового пользователя (POST-запрос с телом)
   */
  async createUser(userData: any): Promise<UserServiceResponse> {
    const stepName = 'Создание нового пользователя';

    const options: APIOptions = {
      url: this.serviceData.baseUrl,
      path: '/users',
      method: 'POST',
      headers: this.serviceData.headers,
      // Тело запроса (будет автоматически сериализовано в JSON)
      data: userData,
    };

    return await httpRequest(stepName, options, this.serviceData);
  }

  /**
   * Частичное обновление данных пользователя (PATCH-запрос)
   */
  async patchUser(id: string, partialData: any): Promise<UserServiceResponse> {
    const stepName = `Частичное обновление пользователя с ID ${id}`;

    const options: APIOptions = {
      url: this.serviceData.baseUrl,
      path: `/users/${id}`,
      method: 'PATCH',
      headers: this.serviceData.headers,
      data: partialData,
    };

    return await httpRequest(stepName, options, this.serviceData);
  }

  /**
   * Удаление пользователя (DELETE-запрос)
   */
  async deleteUser(id: string): Promise<UserServiceResponse> {
    const stepName = `Удаление пользователя с ID ${id}`;

    const options: APIOptions = {
      url: this.serviceData.baseUrl,
      path: `/users/${id}`,
      method: 'DELETE',
      headers: this.serviceData.headers,
    };

    return await httpRequest(stepName, options, this.serviceData);
  }

  /**
   * Загрузка файла (POST с FormData)
   */
  async uploadUserAvatar(userId: string, filePath: string): Promise<UserServiceResponse> {
    const stepName = `Загрузка аватара для пользователя ${userId}`;

    // Создаем FormData для загрузки файла
    const formData = new FormData();
    formData.append('avatar', Bun.file(filePath)); // Используем Bun.file или другой метод для создания файла
    formData.append('userId', userId);

    const options: APIOptions = {
      url: this.serviceData.baseUrl,
      path: `/users/${userId}/avatar`,
      method: 'POST',
      headers: {
        // Content-Type не нужно указывать, он будет установлен автоматически с boundary
        ...this.serviceData.headers,
      },
      data: formData,
    };

    return await httpRequest(stepName, options, this.serviceData);
  }
}
```

### 📋 Регистрация сервиса в фикстурах

После создания сервиса, его нужно зарегистрировать, чтобы он был доступен в тестах:

```typescript
// src/fixtures/services.fixture.ts
import { test as baseTest } from '@playwright/test';
import { UserService } from '../api/service/user.service';
// Импортируйте другие сервисы по необходимости

declare global {
  namespace PlaywrightTestArgs {
    interface Fixtures {
      userService: UserService;
      // Объявите типы для других сервисов
    }
  }
}

export const test = baseTest.extend<{
  userService: UserService;
  // Другие сервисы
}>({
  userService: async ({}, use) => {
    await use(new UserService());
  },
  // Фикстуры для других сервисов
});

export { expect } from '@playwright/test';
```

### 🧪 Примеры API-тестов

Пример тестов, использующих созданный сервис:

```typescript
// tests/api/user-api.spec.ts
import { test, expect } from '../../src/fixtures/merge.fixtures';

test.describe('API тесты: Управление пользователями', () => {
  let userId: string;

  test('Должен получить список пользователей', async ({ userService }) => {
    // Получаем список пользователей с пагинацией
    const response = await userService.getUsers(1, 5);

    // Проверяем статус и структуру ответа
    expect(response.promise.status()).toBe(200);
    expect(response.json.users).toBeArray();
    expect(response.json.meta.totalCount).toBeNumber();
    expect(response.json.meta.page).toBe(1);
    expect(response.json.meta.limit).toBe(5);
  });

  test('Должен создать нового пользователя', async ({ userService }) => {
    // Создаем тестовые данные
    const userData = {
      name: 'Иван Тестов',
      email: `user-${Date.now()}@example.com`,
      role: 'user',
    };

    // Отправляем POST-запрос
    const response = await userService.createUser(userData);

    // Проверяем успешный статус и данные в ответе
    expect(response.promise.status()).toBe(201);
    expect(response.json.id).toBeString();
    expect(response.json.name).toBe(userData.name);
    expect(response.json.email).toBe(userData.email);

    // Сохраняем ID для следующих тестов
    userId = response.json.id;
  });

  test('Должен получить данные созданного пользователя', async ({ userService }) => {
    const response = await userService.getUserById(userId);

    expect(response.promise.status()).toBe(200);
    expect(response.json.id).toBe(userId);
    expect(response.json.name).toBeString();
    expect(response.json.email).toBeString();
  });

  test('Должен обновить данные пользователя', async ({ userService }) => {
    const updatedData = {
      name: 'Иван Обновленный',
      role: 'admin',
    };

    const response = await userService.updateUser(userId, updatedData);

    expect(response.promise.status()).toBe(200);
    expect(response.json.name).toBe(updatedData.name);
    expect(response.json.role).toBe(updatedData.role);
  });

  test('Должен частично обновить данные пользователя', async ({ userService }) => {
    const partialUpdate = {
      name: 'Иван Патч',
    };

    const response = await userService.patchUser(userId, partialUpdate);

    expect(response.promise.status()).toBe(200);
    expect(response.json.name).toBe(partialUpdate.name);
    expect(response.json.role).toBe('admin');
  });

  test('Должен загрузить аватар пользователя', async ({ userService }) => {
    // Предполагаем, что тестовый файл есть в проекте
    const avatarPath = './test-data/avatar.jpg';
    const response = await userService.uploadUserAvatar(userId, avatarPath);

    expect(response.promise.status()).toBe(200);
    expect(response.json.avatarUrl).toBeString();
    expect(response.json.avatarUrl).toContain(userId);
  });
});
```

### 🔄 Комбинирование API и UI тестов

Фреймворк позволяет комбинировать API и UI тесты, используя объединенные фикстуры:

```typescript
// tests/combined/user-workflow.spec.ts
import { test, expect } from '../../src/fixtures/merge.fixtures';

test.describe('Комплексное тестирование: Пользовательские сценарии', () => {
  test('Создание пользователя через API и проверка в UI', async ({ userService, mainPage }) => {
    // 1. Создаем пользователя через API
    const userData = {
      name: 'Комплексный Тест',
      email: `complex-${Date.now()}@example.com`,
      password: 'SecurePass123',
    };

    const apiResponse = await userService.createUser(userData);
    expect(apiResponse.promise.status()).toBe(201);
    const userId = apiResponse.json.id;

    // 2. Переходим на UI
    await mainPage.goto();

    // 3. Логинимся под созданным пользователем
    await mainPage.navbar.login(userData.email, userData.password);

    // 4. Проверяем, что профиль пользователя отображается корректно
    await expect(mainPage.navbar.userProfile).toBeVisible();
    const profileName = await mainPage.navbar.getUserProfileName();
    expect(profileName).toBe(userData.name);

    // 5. Очистка: удаляем пользователя через API
    await userService.deleteUser(userId);
  });
});
```
