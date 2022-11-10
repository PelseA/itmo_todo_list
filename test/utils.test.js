import { describe, test, expect } from 'vitest';
import { isStringNotNumberAndNotEmpty } from '../src/model/utils/stringUtils.js';

describe('Utils test', () => {
  test('stringUtils -> isStringNotNumberAndNotEmpty', () => {
    expect(isStringNotNumberAndNotEmpty(123)).toBe(false);
    expect(isStringNotNumberAndNotEmpty('')).toBe(false);
    expect(isStringNotNumberAndNotEmpty('Hello')).toBe(true);
    expect(() => isStringNotNumberAndNotEmpty(null)).toThrowError();
    expect(() => isStringNotNumberAndNotEmpty(undefined)).toThrowError();
    // expect(isStringNotNumberAndNotEmpty('Hello')).toBe(true);
  });
});