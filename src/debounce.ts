export default <F extends (...args: any[]) => void>(
  fn: F,
  delay: number,
): ((this: ThisParameterType<F>, ...args: Parameters<F>) => void) => {
  let timer: ReturnType<typeof setTimeout> | undefined;

  // eslint-disable-next-line func-names
  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }

    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};
