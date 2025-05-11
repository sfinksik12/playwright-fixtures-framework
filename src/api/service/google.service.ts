import { API, httpRequest, APIOptions } from '../http_methods.js';
import { APIResponse } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

interface ServiceData {
  baseUrl: string;
  headers?: Record<string, string>;
}

interface HttpResponse {
  promise: APIResponse;
  json: any;
}

export class GoogleService extends API {
  private serviceData: ServiceData;

  constructor() {
    super();
    this.serviceData = {
      baseUrl: 'https://www.google.ru',
    };
  }

  async get_main_page(): Promise<HttpResponse> {
    const stepName = 'Получение главной страницы Google';
    const options: APIOptions = {
      url: this.serviceData.baseUrl,
      path: '/',
      method: 'GET',
      headers: this.serviceData.headers,
    };

    return await httpRequest(stepName, options, this.serviceData);
  }
}
