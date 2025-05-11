import { mergeTests, mergeExpects, Expect } from '@playwright/test';
import { test as mainPage } from './pom-fixture.js';
import { test as googleService } from './servises.fixture.js';
import { test as baseFixture } from './base.fixture.js';
import { expect as typesExpects } from './expect.js';

// фикстура test остается базовой
// фикстура expect расширяется, к ней дополнены проверки типов данных
export const test = mergeTests(mainPage, googleService, baseFixture);
export const expect: Expect = mergeExpects(typesExpects);
