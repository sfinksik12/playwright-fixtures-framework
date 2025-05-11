import { Page } from '@playwright/test';
import { allure } from 'allure-playwright';

function tryParseJson(input: string | null): any {
  if (!input) return null;
  try {
    return JSON.parse(input);
  } catch {
    return input;
  }
}

function statusToEmoji(status: number): string {
  switch (true) {
    case status === 200:
      return '✅';
    case status === 201:
      return '🆕';
    case status >= 200 && status < 300:
      return '🟩';

    case status === 301 || status === 302:
      return '🔄';
    case status >= 300 && status < 400:
      return '🟡';

    case status === 400:
      return '🚫';
    case status === 401:
      return '🔐';
    case status === 403:
      return '🚫🚫🚫';
    case status === 404:
      return '🧭';
    case status >= 400 && status < 500:
      return '❌';

    case status === 500:
      return '💥';
    case status >= 500 && status < 600:
      return '🔥';

    default:
      return '⚠️';
  }
}

export function wrapNetworkActions(page: Page): void {
  const originalWaitForResponse = page.waitForResponse.bind(page);
  page.waitForResponse = async function (urlOrPredicate, options?) {
    const urlDescription = typeof urlOrPredicate === 'string' ? urlOrPredicate : '<предикат>';

    return await allure.step(`🔍 Ожидание ответа: ${urlDescription}`, async () => {
      const response = await originalWaitForResponse(urlOrPredicate, options);
      const request = response.request();

      const method = request.method();
      const url = request.url();
      const status = response.status();
      const statusText = response.statusText();
      const emoji = statusToEmoji(status);

      const stepName = `📡 ${method} ${url} → ${emoji} ${status} ${statusText}`;
      await allure.step(stepName, async () => {
        allure.attachment('📝 Заголовки запроса', JSON.stringify(request.headers(), null, 2), 'application/json');

        const postData = await request.postData();
        if (postData) {
          const parsedPostData = tryParseJson(postData);
          allure.attachment('📄 Тело запроса', JSON.stringify(parsedPostData, null, 2), 'application/json');
        }

        allure.attachment('📥 Заголовки ответа', JSON.stringify(response.headers(), null, 2), 'application/json');

        const responseBody = await response.text();
        const parsedResponseBody = tryParseJson(responseBody);
        allure.attachment('📦 Тело ответа', JSON.stringify(parsedResponseBody, null, 2), 'application/json');
      });

      return response;
    });
  };

  const originalRoute = page.route.bind(page);
  page.route = async function (url, handler) {
    const expectedUrl = typeof url === 'string' ? url : '<предикат>';
    return await originalRoute(url, async (route, request) => {
      const actualUrl = request.url();
      const isMatched = typeof url === 'string' ? actualUrl === url : true;

      if (!isMatched) {
        return await handler(route, request);
      }

      const method = request.method();
      const stepName = `🛠 Мок запроса: ${actualUrl}`;

      return await allure.step(stepName, async () => {
        allure.attachment('📝 Заголовки запроса', JSON.stringify(request.headers(), null, 2), 'application/json');

        const postData = await request.postData();
        if (postData) {
          const parsedPostData = tryParseJson(postData);
          allure.attachment('📄 Тело запроса', JSON.stringify(parsedPostData, null, 2), 'application/json');
        }

        const originalFulfill = route.constructor.prototype.fulfill;

        route.fulfill = async function (response) {
          const status = response.status || 200;
          const statusText = response.statusText || 'OK';
          const emoji = statusToEmoji(status);

          const fullStatusStep = `📡 ${method} ${actualUrl} → ${emoji} ${status} ${statusText}`;
          return await allure.step(fullStatusStep, async () => {
            allure.attachment('📥 Заголовки ответа', JSON.stringify(response.headers || {}), 'application/json');

            const body = typeof response.body === 'string' ? response.body : response.body?.toString() || '';

            const parsedResponseBody = tryParseJson(body);

            allure.attachment('📦 Тело ответа', JSON.stringify(parsedResponseBody, null, 2), 'application/json');

            return await originalFulfill.call(this, response);
          });
        };

        return await handler(route, request);
      });
    });
  };
}
