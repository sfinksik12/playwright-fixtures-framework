import { expect } from '@playwright/test';
// Класс для хранения специфических функций, использующихся в src модуле

export class Helpers {
  async urlEncodeParams(params: Record<string, string>): Promise<string> {
    return Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }

  async numberToArray(num: number): Promise<number[]> {
    let array: number[] = [];
    array.push(num);
    return array;
  }

  async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async checkMultipleSortingFields<T>(arrayOfFields: T[], expectedFieldsValue: Partial<T>): Promise<boolean> {
    return arrayOfFields.every(item => Object.keys(expectedFieldsValue).every(key => (item as any)[key] === (expectedFieldsValue as any)[key]));
  }

  // Эта функция принимает объект и массив для поиска объекта в нем, возвращает true, если объект найден, и false если не найден
  async isObjectInArray(object: any, array: any[]): Promise<boolean> {
    return array.some(obj => obj.clientId === object.clientId && obj.reasonId === object.reasonId && obj.comment === object.comment && obj.initiatorId === object.initiatorId);
  }

  deepCompareOnlyCommonKeys(obj1: Record<string, any>, obj2: Record<string, any>): boolean {
    // Находим общий набор ключей
    const commonKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]).values();

    // Фильтруем ключи, оставляя только те, которые есть в обоих объектах
    const filteredKeys = Array.from(commonKeys).filter(key => obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key));

    // Сопоставление ключей и проверка на равенство значений
    for (let key of filteredKeys) {
      if (typeof obj1[key] !== typeof obj2[key]) {
        console.error(`Типы данных для ключа "${key}" не совпадают.`);
        continue;
      }

      // Рекурсивная проверка для вложенных объектов и массивов
      if ((typeof obj1[key] === 'object' && obj1[key] !== null) || Array.isArray(obj1[key])) {
        try {
          if (!this.deepCompareOnlyCommonKeys(obj1[key], obj2[key])) {
            console.error(`Значения для ключа "${key}" не совпадают.`);
          }
        } catch (error) {
          console.error(`${(error as Error).message} для ключа "${key}".`);
        }
      } else if (String(obj1[key]) !== String(obj2[key])) {
        console.error(
          `Значения для ключа "${key}" не совпадают: ${JSON.stringify({
            value1: obj1[key],
            value2: obj2[key],
          })}.`,
        );
      }
    }

    // Если все проверки пройдены без ошибок, объекты считаются равными
    return true;
  }

  getQueryParams(url: string, paramsToExtract: string[]): Record<string, string | null> {
    let urlObj = new URL(url);
    let queryString = urlObj.search;
    let params = new URLSearchParams(queryString);
    let extractedParams: Record<string, string | null> = {};

    paramsToExtract.forEach(param => {
      extractedParams[param] = params.get(param);
    });
    return extractedParams;
  }

  // Удаляет указанные поля из объекта JSON
  removeFieldsFromJsonObject<T extends Record<string, any>>(jsonObject: T, fieldNames: string[]): T {
    fieldNames.forEach(fieldName => {
      delete jsonObject[fieldName];
    });

    return jsonObject;
  }

  // Добавляет три часа и одну секунду к дате в формате ISO и возвращает новую дату в формате ISO без миллисекунд
  addThreeHoursAndOneSecondToIsoDate(isoDate: string): string {
    let date = new Date(isoDate);
    date.setHours(date.getHours() + 3);
    date.setSeconds(date.getSeconds() + 1);
    let newIsoDate = date.toISOString();
    let formattedDate = newIsoDate.slice(0, 19);
    return formattedDate;
  }

  // обновляет переданные в обьект поля
  updateObjectFields<T extends Record<string, any>>(originalObject: T, updates: Partial<T>): T {
    let updatedObject = { ...originalObject };

    for (let key in updates) {
      if (Array.isArray(updates[key]) && Array.isArray(updatedObject[key])) {
        updatedObject[key] = (updates[key] as any[]).map((item, index) => {
          if (typeof item === 'object' && item !== null) {
            return this.updateObjectFields(updatedObject[key][index] || ({} as any), item);
          }
          return item;
        }) as T[Extract<keyof T, string>];
      } else if (typeof updates[key] === 'object' && updates[key] !== null) {
        updatedObject[key] = this.updateObjectFields(updatedObject[key] || ({} as T[Extract<keyof T, string>]), updates[key] as any);
      } else {
        updatedObject[key] = updates[key] as T[Extract<keyof T, string>];
      }
    }

    return updatedObject;
  }

  checkDecreasedAmount(response: { json: any[] }, decreaseAmount: number): void {
    const entries = [{ period: 'daily' }, { period: 'weekly' }, { period: 'monthly' }, { period: 'yearly' }];

    entries.forEach(entry => {
      const currentEntry = response.json.find(e => e.period === entry.period);
      const expectedAmount = Number(process.env[`${entry.period.toUpperCase()}_LIMIT`]) - decreaseAmount;
      expect(expectedAmount).toBe(currentEntry?.amount);
    });
  }
}

export function format(template: string, values: Record<string, any>): string {
  return Object.entries(values).reduce((acc, [key, value]) => acc.replace(`{${key}}`, String(value)), template);
}

export function formatSelector(selector: any): string {
  if (typeof selector === 'string') {
    return `"${selector}"`;
  } else if (typeof selector === 'object' && selector !== null) {
    return Object.entries(selector)
      .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
      .join(', ');
  }
  return String(selector);
}
