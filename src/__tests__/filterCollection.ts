import { filterCollection } from '../filterCollection';

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
  {
    foo: 'açúcar ancião',
    bar: 'MASCAVO',
    value: 123,
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

  it('should ignore accents, uppercase or lowercase', () => {
    let filteredCollection = filterCollection('ANCIAO', collection, ['foo']);
    expect(filteredCollection).toEqual([collection[2]]);

    filteredCollection = filterCollection('mascavo', collection, ['bar']);
    expect(filteredCollection).toEqual([collection[2]]);
  });
});
