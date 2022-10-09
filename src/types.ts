type ValidValues = string | number | object | Array<any> | undefined | null;

export type DeepKey<
  T extends Record<string, any>,
  K extends string = string,
> = K extends keyof T
  ? T[K] extends ValidValues
    ? K
    : never
  : K extends `${infer TKey}.${infer Rest}`
  ? T[TKey] extends ValidValues
    ? DeepKey<Exclude<T[TKey], undefined>, Rest> extends never
      ? never
      : K
    : never
  : never;

export type DeepReturn<T, K extends string = string> = K extends keyof T
  ? T[K]
  : K extends `${infer TKey}.${infer Rest}`
  ? TKey extends keyof T
    ? DeepReturn<Exclude<T[TKey], undefined>, Rest>
    : undefined
  : undefined;
