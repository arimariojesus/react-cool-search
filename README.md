# <em><b>REACT-COOL-SEARCH</b></em>

This is a React [hook](https://reactjs.org/docs/hooks-custom.html#using-a-custom-hook) that provides a simples way to implement search/filter functionality on a list of objects based on their properties in React Components.

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/arimariojesus/react-cool-search/Release)](https://github.com/arimariojesus/react-cool-search/actions?query=workflow%3ARelease)
[![Coverage Status](https://img.shields.io/coveralls/github/arimariojesus/react-cool-search/main)](https://coveralls.io/github/arimariojesus/react-cool-search?branch=main)
[![npm version](https://img.shields.io/npm/v/react-cool-search)](https://www.npmjs.com/package/react-cool-search)
[![npm downloads](https://img.shields.io/npm/dm/react-cool-search)](https://www.npmtrends.com/react-cool-search)
[![npm all downloads](https://img.shields.io/npm/dt/react-cool-search)](https://www.npmtrends.com/react-cool-search)
[![MIT License](https://img.shields.io/github/license/arimariojesus/react-cool-search)](https://github.com/arimariojesus/react-cool-search/blob/main/LICENSE)
[![GitHub Repo stars](https://img.shields.io/github/stars/arimariojesus/react-cool-search?style=social)](https://github.com/arimariojesus/react-cool-search)

## Installation

This package is distributed via [npm](https://www.npmjs.com/package/react-cool-search).

```sh
$ yarn add react-cool-search
# or
$ npm install --save react-cool-search
```

## Usage

Common use case.

```tsx
import useSearch from 'react-cool-search';

interface User {
  id: number;
  name: string;
  lastName: string;
}

const users: User[] = [
  { id: 1, name: 'Lorem', lastName: 'Ipsum' },
  { id: 2, name: 'Foo', lastName: 'Bar' },
  { id: 3, name: 'Feijão', lastName: 'Arroz' },
  { id: 4, name: 'John', lastName: 'Doe' },
];

const Users = () => {
  const { data, query, handleChange } = useSearch(users);

  return (
    <div>
      <input
        type="text"
        placeholder="Search users"
        value={query}
        onChange={handleChange}
      />
      <ul>
        {data.map(user => (
          <li key={user.id + user.name}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

Definig fields to search.

```tsx
import useSearch from 'react-cool-search';

interface User {
  id: number;
  name: string;
  lastName: string;
}

const users: User[] = [
  { id: 1, name: 'Lorem', lastName: 'Ipsum' },
  { id: 2, name: 'Foo', lastName: 'Bar' },
  { id: 3, name: 'Feijão', lastName: 'Arroz' },
  { id: 4, name: 'John', lastName: 'Doe' },
];

const Users = () => {
  const { data, query, handleChange } = useSearch(users, { fields: ['name'] });

  return (
    <div>
      <input
        type="text"
        placeholder="Search users only by name"
        value={query}
        onChange={handleChange}
      />
      <ul>
        {data.map(user => (
          <li key={user.id + user.name}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

## API

#### `useSearch<T>`

```ts
const obj = useSearch<T>(collection: T[], options?: Options);
```

`react-cool-search` provides a hook as default export; it takes two parameters:

| Key          | Type   | Default | Description                                    |
| ------------ | ------ | ------- | ---------------------------------------------- |
| `collection` | Array  |         | An array of elements of type `T`.              |
| `options`    | object |         | Configuration object. See [Options](#options). |

#### `Options`

The `options` object contains the following properies:

| Key            | Type           | Default                      | Description                                                                              |
| -------------- | -------------- | ---------------------------- | ---------------------------------------------------------------------------------------- |
| `initialQuery` | string         | `""`                         | The query used for the initial collection returned from useSearch                        |
| `debounce`     | number         | `300`                        | Number of milliseconds to delay before triggering the function to filter the collection. |
| `fields`       | Array<keyof T> | `Object.keys(collection[0])` | Properties that must be searched for each object in the collection.                      |

#### `Return object`

The hook returns an object with the following properies:

| Key            | Type     | Default                                                    | Description                                                                                                        |
| -------------- | -------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `data`         | Array    | `initialQuery ? filterCollection(collection) : collection` | A filtered version of `collection` passed to `useSearch`.                                                          |
| `status`       | string   | `initialQuery ? 'OK' : 'IDLE'`                             | Search status. It might be `IDLE` or `OK` or `NOT_FOUND`                                                           |
| `query`        | string   | `initialQuery`                                             | The current query                                                                                                  |
| `handleChange` | function | `(event) => {}`                                            | An event handler for an HTML input element. This is to be passes to the search input element as its onChange prop. |
| `setQuery`     | function | `(query) => {}`                                            | A function to programmatically set the query value.                                                                |

## License

MIT © [Arimário Jesus](https://github.com/arimariojesus)
