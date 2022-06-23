import { fireEvent, render } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';

import * as _debounce from '../debounce';
import useSearch, {
  Options,
  invalidCollectionErr,
  invalidFieldsErr,
} from '../useSearch';

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
    // jest.clearAllTimers();
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

  it('should return empty array if an empty collection is passed', () => {
    const {
      current: { data: filteredCollection },
    } = renderHook(() => useSearch([])).result;
    expect(filteredCollection).toEqual([]);
  });

  it('should throw error if an invalid collection is passed', () => {
    console.error = jest.fn();

    const invalidValue = null as unknown as Array<any>;
    renderHook(() => useSearch(invalidValue));
    expect(console.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(invalidCollectionErr);
  });

  it('should throw error if invalid fields is passed', () => {
    console.error = jest.fn();

    const invalidValue = null as unknown as Array<keyof ITest>;
    renderHelper({ fields: invalidValue });
    expect(console.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(invalidFieldsErr);
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

  it('should return "query" correctly', () => {
    let result = renderHelper();
    expect(result.current.query).toBe('');

    const defaultQuery = 'Hello';
    result = renderHelper({ initialQuery: defaultQuery });
    expect(result.current.query).toBe(defaultQuery);

    const newQuery = 'new_query';
    act(() => {
      result.current.setQuery(newQuery);
    });

    expect(result.current.query).toBe(newQuery);
  });

  it('should sets "query" based on handleChange', () => {
    const query = 'any_query';
    const result = renderHelper();
    act(() => {
      result.current.handleChange(query);
    });
    expect(result.current.query).toBe(query);

    const Input = () => (
      <input aria-label="cost-input" onChange={result.current.handleChange} />
    );

    const { getByLabelText } = render(<Input />);
    const input = getByLabelText('cost-input');

    const value = 'any_value';
    act(() => {
      fireEvent.change(input, { target: { value } });
    });
    expect(result.current.query).toBe(value);
  });

  it('should return "status" correctly', () => {
    let result = renderHelper();
    expect(result.current.status).toBe('IDLE');

    result = renderHelper({ initialQuery: 'foo' });
    expect(result.current.status).toBe('OK');

    act(() => {
      result.current.setQuery('bar');
    });
    expect(result.current.status).toBe('OK');

    act(() => {
      result.current.setQuery('any_query');
    });
    expect(result.current.status).toBe('NOT_FOUND');

    act(() => {
      result.current.setQuery('');
    });
    expect(result.current.status).toBe('IDLE');

    act(() => {
      result.current.setQuery('   ');
    });
    expect(result.current.status).toBe('IDLE');
  });
});
