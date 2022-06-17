import debounce from '../debounce';

describe('debounce', () => {
  const fn = jest.fn();
  const debouncedFn = debounce(fn, 100);

  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should trigger function on correct time', () => {
    debouncedFn();
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalled();
  });

  it('should trigger function just once', () => {
    for (let i = 0; i < 10; i += 1) {
      debouncedFn();
    }

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
