import { request, expect, APIRequestContext, APIResponse } from '@playwright/test';
import { AllureReport } from './allureReport.js';
import { Helpers } from '../utils/format.utils.js';
import dotenv from 'dotenv';

dotenv.config();

export interface APIOptions {
  url: string;
  path: string;
  method: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  rawData?: any;
}

interface ServiceParams {
  baseUrl?: string;
  host?: string;
}

interface HttpResponse {
  promise: APIResponse;
  json: any;
}

let allureReport = new AllureReport();

export class API {
  request: typeof request;
  option!: APIOptions;
  helpers: Helpers;
  allureReport: AllureReport;

  constructor() {
    this.request = request;
    this.helpers = new Helpers();
    this.allureReport = allureReport;
  }

  async sendRequest(options: Record<string, any>, method: string, url: URL): Promise<APIResponse> {
    const context = await this.request.newContext();
    const response = (await context[method.toLowerCase() as keyof APIRequestContext](url.href, options)) as APIResponse;
    await this.allureReport.attachStatusCode(response.status());
    await this.attachRequestDetailsToReport(options, response);
    await this.attachResponseDetailsToReport(response);
    return response;
  }

  async attachRequestDetailsToReport(options: Record<string, any>, response?: APIResponse): Promise<void> {
    await this.allureReport.attachRequestHeaders(options.headers);
    if (options.data) {
      await this.allureReport.attachRequestData(options.data);
    }
  }

  async attachResponseDetailsToReport(response: APIResponse): Promise<void> {
    await this.allureReport.attachResponseHeaders(await response.headers());
    const responseBody = await this.parseResponse(response);
    await this.allureReport.attachResponseData(responseBody);
  }

  async parseResponse(response: APIResponse): Promise<any> {
    try {
      return await response.json();
    } catch (error) {
      return await response.text();
    }
  }

  async createRequest(serviceParams: ServiceParams = {}, options?: APIOptions): Promise<{ responsePromise: Promise<APIResponse>; json: any }> {
    if (options) {
      this.option = options;
    }

    const url = this.buildUrl();
    const requestOptions = await this.buildRequestOptions(serviceParams, url);
    const methodEmoji = this.getMethodEmoji(this.option.method);

    const responsePromise = this.allureReport.allure.step(`${methodEmoji} ${this.option.method} ${url}`, () => this.sendRequest(requestOptions, this.option.method, url));

    const json = await this.handleResponse(responsePromise);

    return { responsePromise, json };
  }

  buildUrl(): URL {
    const baseUrl = this.option.url;
    const path = this.option.path;

    const finalUrl = new URL(path, baseUrl);

    if (this.option.params) {
      Object.entries(this.option.params).forEach(([key, value]) => {
        finalUrl.searchParams.append(key, String(value));
      });
    }

    return finalUrl;
  }

  async buildRequestOptions(serviceParams: ServiceParams, url: URL): Promise<Record<string, any>> {
    let headers: Record<string, string> = {};

    if (this.option.data instanceof FormData) {
      // Для FormData всегда используем multipart/form-data
      const boundary = '----WebKitFormBoundary' + Math.random().toString(16).slice(2);
      headers = {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        ...this.option.headers,
      };
    } else {
      headers = {
        'Content-Type': this.option.headers?.['Content-Type'] || 'application/json',
        ...this.option.headers,
      };
    }

    const options: Record<string, any> = {
      verify: false,
      headers,
      ...this.option.params,
    };

    if (this.option.data) {
      options['data'] = this.option.data;
    }

    return options;
  }

  async handleResponse(responsePromise: Promise<APIResponse>): Promise<any> {
    const response = await responsePromise;
    try {
      const buffer = await response.body();
      if (buffer && buffer.length > 0) {
        const jsonString = buffer.toString('utf8');
        if (jsonString.trim() !== '') {
          return JSON.parse(jsonString);
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  getMethodEmoji(method: string): string {
    const methodMap: Record<string, string> = {
      GET: '🔍',
      POST: '📝',
      PUT: '📤',
      PATCH: '🔄',
      DELETE: '🗑️',
      HEAD: '👀',
      OPTIONS: '⚙️',
    };
    return methodMap[method.toUpperCase()] || '🌐';
  }
}

export async function httpRequest(comment: string, options: APIOptions, serviceParams: ServiceParams = {}): Promise<HttpResponse> {
  const { responsePromise, json } = await allureReport.allure.step(comment, async () => {
    return await new API().createRequest(serviceParams, options);
  });
  let awaitedPromise = await responsePromise;
  return { promise: awaitedPromise, json };
}
