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

  it('should return correct deep values', () => {
    expect(getDeepValue(mockObj, 'hello.world')).toEqual(mockObj.hello.world);
    expect(getDeepValue(mockObj, 'foo.bar')).toEqual(mockObj.foo.bar);
    expect(getDeepValue(mockObj, 'foo.bar.baz')).toEqual(mockObj.foo.bar.baz);
    const invalidKey = 'foo.faa' as never;
    expect(getDeepValue(mockObj, invalidKey)).toEqual(undefined);
  });
});
