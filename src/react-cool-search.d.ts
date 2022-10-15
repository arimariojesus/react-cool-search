declare module 'react-cool-search' {
  import React, { ChangeEvent, Dispatch } from 'react';

  export type Status = 'IDLE' | 'OK' | 'NOT_FOUND';

  type ValidValues = string | number | object | Array<any> | undefined | null;

  type DeepKey<
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

  export interface Options<T extends object, K extends string> {
    debounce?: number;
    initialQuery?: string;
    fields?: DeepKey<T, K>[] | null;
  }

  export interface Return<T> {
    data: T[];
    status: Status;
    query: string;
    handleChange: (event: ChangeEvent<HTMLInputElement> | string) => void;
    setQuery: Dispatch<React.SetStateAction<string>>;
  }

  const useSearch: <T extends object, K extends string>(
    collection: T[],
    options?: Options<T, K>,
  ) => Return<T>;

  export default useSearch;
}
