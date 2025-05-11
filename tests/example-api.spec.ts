import { test, expect } from '../src/fixtures/merge.fixtures';

test.describe('Google API Tests', () => {
  test('Должен получить главную страницу Google', async ({ googleService }) => {
    const response = await googleService.get_main_page();

    expect(response.promise.status()).toBe(200);
    expect(response.promise.status()).toBeNumber();
  });
});
