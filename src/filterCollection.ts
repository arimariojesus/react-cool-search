import { getDeepValue } from './getDeepValue';
import { hasOnlySpaces } from './hasOnlySpaces';
import { propertiesToArray } from './properiesToArray';
import { DeepKey } from './types';

const getRelevantFields = <T, K extends object>(fields: T, obj: K) => {
  return Array.isArray(fields) ? fields : propertiesToArray(obj);
};

const normalizeValue = (value: any): string =>
  value
    .toString()
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const filterCollection = <
  T extends Record<string, any>,
  K extends string = string,
>(
  query: string,
  collection: T[],
  fields: DeepKey<T, K>[] | null = null,
): T[] => {
  if (Array.isArray(fields) && !fields.length) {
    return [];
  }

  if (hasOnlySpaces(query)) {
    return collection;
  }

  const normalizedQuery = normalizeValue(query);

  return collection.filter(item => {
    const relevantFields = getRelevantFields(fields, item) as DeepKey<T, K>[];
    const someFieldMatches = relevantFields.some(field => {
      const value = getDeepValue(item, field);
      if (!!value && (typeof value === 'string' || typeof value === 'number')) {
        return normalizeValue(value).includes(normalizedQuery);
      }
      return false;
    });
    return someFieldMatches;
  });
};
