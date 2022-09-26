const isObject = (val: unknown): boolean =>
  val instanceof Object && !Array.isArray(val);

export const propertiesToArray = (obj: object): string[] => {
  const addDelimiter = (a: string, b: string) => (a ? `${a}.${b}` : b);

  const paths = (obj: Record<string, any> = {}, head = ''): string[] => {
    if (!obj) return [];
    return Object.entries(obj).reduce<string[]>((product, [key, value]) => {
      const fullPath = addDelimiter(head, key);
      return isObject(value)
        ? product.concat(paths(value, fullPath))
        : product.concat(fullPath);
    }, []);
  };

  return paths(obj);
};
