import { getDeepValue } from '../getDeepValue';

interface ITest {
  hello: {
    world: string;
  };
  foo: {
    bar: {
      baz: number;
    };
  };
}

const mockObj: ITest = {
  hello: {
    world: 'hello world',
  },
  foo: {
    bar: {
      baz: 123,
    },
  },
};

describe('filterCollection', () => {
  it('should return correct surface values', () => {
    expect(getDeepValue(mockObj, 'hello')).toEqual(mockObj.hello);
    expect(getDeepValue(mockObj, 'foo')).toEqual(mockObj.foo);
    const invalidKey = 'invalid' as never;
    expect(getDeepValue(mockObj, invalidKey)).toEqual(undefined);
  });
});
