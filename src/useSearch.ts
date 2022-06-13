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

type Status = 'IDLE' | 'OK' | 'NOT_FOUND';
type Fields<T> = Array<keyof T>;

interface SearchState<T> {
  status: Status;
  data: T[];
}

export interface Options<T> {
  debounce?: number;
  initialQuery?: string;
  fields?: Fields<T>;
}

interface Return<T> {
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
    fields = Object.keys(collection) as Fields<T>,
  }: Options<T> = {},
): Return<T> => {
  const isMounted = useRef(false);
  const [search, setSearch] = useState<SearchState<T>>({
    status: 'IDLE',
    data: collection,
  });
  const [query, setQuery] = useState(initialQuery);

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

  useEffect(
    () => debouncedFilterCollection(query, collection, fields),
    [query, collection, fields, debouncedFilterCollection],
  );

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
      setSearch({ data: collection, status: 'IDLE' });
    };
  }, [collection]);

  return {
    ...search,
    query,
    handleChange,
    setQuery,
  };
};

export default useSearch;
