declare module 'use-search' {
  import React, { ChangeEvent, Dispatch } from 'react';

  export type Status = 'IDLE' | 'OK' | 'NOT_FOUND';

  type Fields<T> = Array<keyof T>;

  export interface Options<T> {
    debounce?: number;
    initialQuery?: string;
    fields?: Fields<T>;
  }

  export interface Return<T> {
    data: T[];
    status: Status;
    query: string;
    handleChange: (event: ChangeEvent<HTMLInputElement> | string) => void;
    setQuery: Dispatch<React.SetStateAction<string>>;
  }

  const useSearch: <T>(collection: T[], options?: Options<T>) => Return<T>;

  export default useSearch;
}
