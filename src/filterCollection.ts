import { hasOnlySpaces } from './hasOnlySpaces';

export const filterCollection = <T>(
  query: string,
  collection: T[],
  fields: Array<keyof T> = Object.keys(collection[0] || []) as Array<keyof T>,
): T[] => {
  if (!query || hasOnlySpaces(query)) {
    return collection;
  }

  const getNormalizedValue = (value: any): string =>
    value
      .toString()
      .toLocaleLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const normalizedQuery = getNormalizedValue(query);

  return collection.filter(item => {
    const someFieldMatches = fields.some(field => {
      const value = item[field];
      if (!!value && (typeof value === 'string' || typeof value === 'number')) {
        return getNormalizedValue(value).includes(normalizedQuery);
      }
      return false;
    });
    return someFieldMatches;
  });
};
