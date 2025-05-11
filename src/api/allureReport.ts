import { allure } from 'allure-playwright';

export class AllureReport {
  allure: typeof allure;

  constructor() {
    this.allure = allure;
  }

  async attachData(title: string, data: any): Promise<void> {
    const formattedData = this.formatDataAsJson(data);
    await this.allure.attachment(`${title}`, formattedData, 'application/json');
  }

  async attachStatusCode(code: number): Promise<void> {
    const statusEmoji = this.getStatusEmoji(code);
    await this.allure.logStep(`${statusEmoji} ${code}`);
  }

  async attachRequestData(data: any): Promise<void> {
    await this.attachData('📡 Request Data', data);
  }

  async attachRequestHeaders(headers: Record<string, string>): Promise<void> {
    await this.attachData('⬆️ Request Headers', headers);
  }

  async attachResponseData(data: any): Promise<void> {
    await this.attachData('📥 Response Data', data);
  }

  async attachResponseHeaders(headers: Record<string, string>): Promise<void> {
    await this.attachData('⬇️ Response Headers', headers);
  }

  async attachValidationErrorData(data: any): Promise<void> {
    await this.attachData('⚠️ Validation Error', data);
  }

  getStatusEmoji(code: number): string {
    if (code >= 200 && code < 300) return '✓'; // Success
    if (code >= 300 && code < 400) return '↪️'; // Redirect
    if (code >= 400 && code < 500) return '⚡'; // Client Error
    if (code >= 500) return '⛔'; // Server Error
    return '❔'; // Unknown
  }

  formatDataAsJson(data: any): string {
    const isJsonObject = typeof data === 'object' && data !== null;
    return isJsonObject ? JSON.stringify(data, null, 2) : data || '';
  }
}
