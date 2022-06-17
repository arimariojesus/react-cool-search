import { renderHook } from '@testing-library/react-hooks';

import useLatest from '../useLatest';

describe('useLatest', () => {
  it('should return value correctly', () => {
    const value = 'test';
    const { result } = renderHook(() => useLatest(value));
    expect(result.current.current).toBe(value);
  });
});
