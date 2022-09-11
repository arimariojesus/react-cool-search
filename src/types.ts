type ValidValues =
  | string
  | number
  | Record<string, any>
  | Array<any>
  | undefined
  | null;

export type DeepKey<
  T extends Record<string, any>,
  K extends string = string,
> = K extends keyof T
  ? T[K] extends ValidValues
    ? K
    : never
  : K extends `${infer TKey}.${infer Rest}`
  ? T[TKey] extends ValidValues
    ? DeepKey<T[TKey], Rest> extends never
      ? never
      : K
    : never
  : never;

export type DeepReturn<T, K extends string = string> = K extends keyof T
  ? T[K]
  : K extends `${infer TKey}.${infer Rest}`
  ? TKey extends keyof T
    ? DeepReturn<T[TKey], Rest>
    : undefined
  : undefined;
