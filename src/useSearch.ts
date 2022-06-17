import React, {
  ChangeEvent,
  Dispatch,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import _debounce from './debounce';
import { filterCollection } from './filterCollection';
import { hasOnlySpaces } from './hasOnlySpaces';
import useLatest from './useLatest';

export type Status = 'IDLE' | 'OK' | 'NOT_FOUND';
type Fields<T> = Array<keyof T>;

type SearchState<T> = {
  status: Status;
  data: T[];
};

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

const useSearch = <T>(
  collection: T[],
  {
    debounce = 300,
    initialQuery = '',
    fields = Object.keys(collection[0] || []) as Fields<T>,
  }: Options<T> = {},
): Return<T> => {
  const isMounted = useRef(false);
  const [query, setQuery] = useState(initialQuery);
  const [search, setSearch] = useState<SearchState<T>>({
    status: initialQuery ? 'OK' : 'IDLE',
    data: initialQuery
      ? filterCollection(query, collection, fields)
      : collection,
  });
  const collectionRef = useLatest(collection);
  const fieldsRef = useLatest(fields);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement> | string) => {
      setQuery(typeof event === 'string' ? event : event.target.value);
    },
    [setQuery],
  );

  const debouncedFilterCollection = useCallback(
    _debounce((query: string, collection: T[], fields: Fields<T>) => {
      if (isMounted.current) {
        if (!query || hasOnlySpaces(query)) {
          setSearch({ data: collection, status: 'IDLE' });
          return;
        }

        const filteredCollection = filterCollection(query, collection, fields);
        if (filteredCollection.length) {
          setSearch({ data: filteredCollection, status: 'OK' });
          return;
        }
        setSearch({ data: [], status: 'NOT_FOUND' });
      }
    }, debounce),
    [debounce],
  );

  useEffect(() => {
    if (collectionRef.current && fieldsRef.current) {
      debouncedFilterCollection(
        query,
        collectionRef.current,
        fieldsRef.current,
      );
    }
  }, [query, collectionRef, fieldsRef, debouncedFilterCollection]);

  useEffect(() => {
    isMounted.current = true;
    const collections = collectionRef.current || [];

    return () => {
      isMounted.current = false;
      setSearch({ data: collections, status: 'IDLE' });
    };
  }, [collectionRef]);

  return {
    ...search,
    query,
    handleChange,
    setQuery,
  };
};

export default useSearch;
