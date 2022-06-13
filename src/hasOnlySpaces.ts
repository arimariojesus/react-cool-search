export const hasOnlySpaces = (query: string): boolean =>
  query.split('').every(element => element === ' ');
