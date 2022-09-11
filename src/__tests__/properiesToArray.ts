import { propertiesToArray } from '../properiesToArray';

const objMock = {
  a: {
    a1: 'a1',
  },
  b: {
    b1: 123,
    b2: {
      b21: ['a', 'b', 'c'],
    },
  },
  c: {
    c1: 'b1',
    c2: {
      c21: {
        c211: 'c111',
      },
    },
  },
};

const pathsMock = ['a.a1', 'b.b1', 'b.b2.b21', 'c.c1', 'c.c2.c21.c211'];

describe('propertiesToArray', () => {
  it('should return properties paths correctly', () => {
    const paths = propertiesToArray(objMock);
    expect(paths).toEqual(pathsMock);
  });
});
