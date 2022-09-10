import { hasOnlySpaces } from './hasOnlySpaces';

const normalizeValue = (value: any): string =>
  value
    .toString()
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const filterCollection = <T>(
  query: string,
  collection: T[],
  fields: Array<keyof T> | null = null,
): T[] => {
  if (!query || hasOnlySpaces(query)) {
    return collection;
  }

  const relevantFields = (obj: T) => {
    if (Array.isArray(fields)) {
      return fields;
    }

    if (obj instanceof Object) {
      return Object.keys(obj) as Array<keyof T>;
    }

    return [];
  };

  const normalizedQuery = normalizeValue(query);

  return collection.filter(item => {
    const someFieldMatches = relevantFields(item).some(field => {
      const value = item[field];
      if (!!value && (typeof value === 'string' || typeof value === 'number')) {
        return normalizeValue(value).includes(normalizedQuery);
      }
      return false;
    });
    return someFieldMatches;
  });
};
