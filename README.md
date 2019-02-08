# react-media-hook2

[![NPM version](https://img.shields.io/npm/v/react-media-hook2.svg?style=flat)](https://npmjs.org/package/react-media-hook2)
[![NPM downloads](http://img.shields.io/npm/dm/react-media-hook2.svg?style=flat)](https://npmjs.org/package/react-media-hook2)
[![Build Status](https://img.shields.io/travis/imhele/react-media-hook2.svg?style=flat)](https://travis-ci.org/imhele/react-media-hook2)
[![Coverage Status](https://coveralls.io/repos/github/imhele/react-media-hook2/badge.svg?branch=master)](https://coveralls.io/github/imhele/react-media-hook2?branch=master)
[![License](https://img.shields.io/npm/l/react-media-hook2.svg)](https://npmjs.org/package/react-media-hook2)

## Usage

```sh
$ npm install react-media-hook2 --save
or
$ yarn add react-media-hook2
```

```jsx
import ChildComponent from './example';
import useMedia from 'react-media-hook2';

export default () => {
  // `id` is optional if you don't need to get the value of `matches` in the children
  const [matches, setProps] = useMedia({ id: 0, query: { maxWidth: 600 } });
  return (
    <>
      <div>Width of window is {matches ? 'less' : 'greater'} than 600</div>
      <ChildComponent />
    </>
  );
};

// `./example`
import { getUseMedia } from 'react-media-hook2';

export default () => {
  const [matches, setProps] = getUseMedia(0); // `id` in props of useMedia created in parent component
  return <div>matches: {matches}</div>
}
```

In _TypeScript_ , you can use `enum` to ensure that the `id` is globally unique:

```tsx
import useMedia from 'react-media-hook2';

export enum GlobalId {
  MyComponent,
}

export default () => {
  const [matches, setProps] = useMedia({ id: GlobalId.MyComponent, query: '(max-width: 600px)' });
  return <div>Width of window is {matches ? 'less' : 'greater'} than 600</div>;
};
```


## Options

### Overview

```ts
interface UseMediaProps {
  defaultMatches?: boolean;
  id?: any;
  onChange?: (matches: boolean) => void | boolean;
  paused?: boolean;
  query?: string | CSSProperties | CSSProperties[];
  targetWindow?: Window;
}
```
