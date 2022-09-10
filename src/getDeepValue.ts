import { DeepKey, DeepReturn } from './types';

export const getDeepValue = <
  T extends Record<string, any>,
  K extends string = string,
>(
  obj: T,
  path: DeepKey<T, K>,
): DeepReturn<T, K> => {
  const paths = path.split('.');
  return paths.reduce<DeepReturn<T, K>>((acc, curr) => {
    return acc[curr];
  }, obj as DeepReturn<T, K>);
};
