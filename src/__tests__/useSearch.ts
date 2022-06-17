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
    value: 2,
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
});
