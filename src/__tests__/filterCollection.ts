import { filterCollection } from '../filterCollection';

interface ITest {
  foo: string;
  bar: string;
  value?: number;
}

interface IDeepTest {
  deep: {
    prop: {
      deepProp: string;
    };
    otherProp?: string;
  };
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
  {
    foo: 'açúcar ancião',
    bar: 'MASCAVO',
    value: 123,
  },
];

const deepCollection: IDeepTest[] = [
  {
    deep: {
      prop: {
        deepProp: 'deep value',
      },
    },
  },
  {
    deep: {
      prop: {
        deepProp: 'deepest value',
      },
      otherProp: 'deep value',
    },
  },
];

describe('filterCollection', () => {
  it('should return entire collection if empty query is passed', () => {
    const filteredCollection = filterCollection('', collection);
    expect(filteredCollection).toEqual(collection);
  });

  it('should return entire collection if a query with only spaces is passed', () => {
    const filteredCollection = filterCollection('   ', collection);
    expect(filteredCollection).toEqual(collection);
  });

  it('should return an empty array if an empty collection is passed', () => {
    const filteredCollection = filterCollection('', []);
    expect(filteredCollection).toEqual([]);
  });

  it('should search on the correct fields', () => {
    const query = '1';

    let filteredCollection = filterCollection(query, collection, ['value']);
    expect(filteredCollection).toEqual([collection[1], collection[2]]);

    filteredCollection = filterCollection(query, collection, ['foo']);
    expect(filteredCollection).toEqual([collection[0]]);

    filteredCollection = filterCollection(query, collection, [
      'foo',
      'bar',
      'value',
    ]);
    expect(filteredCollection).toEqual(collection);
  });

  it('should ignore accents, uppercase or lowercase', () => {
    let filteredCollection = filterCollection('ANCIAO', collection, ['foo']);
    expect(filteredCollection).toEqual([collection[2]]);

    filteredCollection = filterCollection('mascavo', collection, ['bar']);
    expect(filteredCollection).toEqual([collection[2]]);
  });

  it('should search on the correct deep fields', () => {
    let filteredCollection = filterCollection('deep value', deepCollection, [
      'deep.prop.deepProp',
    ]);
    expect(filteredCollection).toEqual([deepCollection[0]]);

    filteredCollection = filterCollection('deepest value', deepCollection, [
      'deep.prop.deepProp',
    ]);
    expect(filteredCollection).toEqual([deepCollection[1]]);

    filteredCollection = filterCollection('deep value', deepCollection, [
      'deep.prop.deepProp',
      'deep.otherProp',
    ]);
    expect(filteredCollection).toEqual(deepCollection);
  });
});
