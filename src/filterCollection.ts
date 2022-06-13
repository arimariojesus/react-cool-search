export const filterCollection = <T>(
  query: string,
  collection: T[],
  fields: Array<keyof T>,
): T[] => {
  const getNormalizedValue = (value: any): string =>
    value
      .toString()
      .toLocaleLowerCase()
      .normalize('NFD')
      .replace(/\[\u0300-\u036f]/, '');

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
