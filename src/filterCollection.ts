import { hasOnlySpaces } from './hasOnlySpaces';

const getNormalizedValue = (value: any): string =>
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

  const normalizedQuery = getNormalizedValue(query);
  const relevantFields = (obj: T) =>
    fields || (Object.keys(obj) as Array<keyof T>);

  return collection.filter(item => {
    const someFieldMatches = relevantFields(item).some(field => {
      const value = item[field];
      if (!!value && (typeof value === 'string' || typeof value === 'number')) {
        return getNormalizedValue(value).includes(normalizedQuery);
      }
      return false;
    });
    return someFieldMatches;
  });
};
