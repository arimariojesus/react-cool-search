import { renderHook } from '@testing-library/react-hooks';

import * as _debounce from '../debounce';
import useSearch, { Options } from '../useSearch';

jest.useFakeTimers('modern');
jest.mock('../debounce');

const mockDebounce = _debounce as jest.Mocked<typeof _debounce>;
mockDebounce.default.mockImplementation(fn => fn);

interface ITest {
  foo: string;
  bar: string;
  value?: number;
}

const collection: ITest[] = [
  {
    foo: 'foo 1',
    bar: 'bar 1',
  },
  {
    foo: 'foo 2',
    bar: 'bar 2',
    value: 1,
  },
];

type UseSearchOptions = Options<ITest>;
const renderHelper = (options: UseSearchOptions = {}) => {
  return renderHook(() => useSearch(collection, options)).result;
};

describe('useSearch', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    mockDebounce.default.mockClear();
  });

  it('should set debounce correctly', () => {
    const defaultDebounce = 300;
    renderHelper();
    expect(mockDebounce.default).toHaveBeenCalledWith(
      expect.any(Function),
      defaultDebounce,
    );

    const debounce = 500;
    renderHelper({ debounce });
    expect(mockDebounce.default).toHaveBeenCalledWith(
      expect.any(Function),
      debounce,
    );
  });

  it('should returns entire collection if query is not passed', () => {
    const {
      current: { data: filteredCollection },
    } = renderHelper();
    expect(filteredCollection).toEqual(collection);
  });

  it('should returns filtered collection if initial query is passed', () => {
    const {
      current: { data: filteredCollection },
    } = renderHelper({ initialQuery: 'foo 1' });
    expect(filteredCollection).toEqual([collection[0]]);
  });

  it('should returns empty collection if an initial query is passed and empty fields', () => {
    const {
      current: { data: filteredCollection },
    } = renderHelper({ initialQuery: 'foo', fields: [] });
    expect(filteredCollection).toEqual([]);
  });

  it('should returns filtered collection correctly if fields is passed', () => {
    const {
      current: { data: filteredCollection },
    } = renderHelper({ initialQuery: '1', fields: ['value'] });
    expect(filteredCollection).toEqual([collection[1]]);
  });
});
