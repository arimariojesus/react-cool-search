import { getDeepValue } from './getDeepValue';
import { hasOnlySpaces } from './hasOnlySpaces';
import { DeepKey } from './types';

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
  if (hasOnlySpaces(query) || fields === null) {
    return collection;
  }

  const normalizedQuery = normalizeValue(query);

  return collection.filter(item => {
    const someFieldMatches = fields.some(field => {
      const value = getDeepValue(item, field);
      if (!!value && (typeof value === 'string' || typeof value === 'number')) {
        return normalizeValue(value).includes(normalizedQuery);
      }
      return false;
    });
    return someFieldMatches;
  });
};
