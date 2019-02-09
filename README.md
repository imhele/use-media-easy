# react-media-hook2

[![NPM version](https://img.shields.io/npm/v/react-media-hook2.svg?style=flat)](https://npmjs.org/package/react-media-hook2)
[![NPM downloads](http://img.shields.io/npm/dm/react-media-hook2.svg?style=flat)](https://npmjs.org/package/react-media-hook2)
[![Build Status](https://img.shields.io/travis/imhele/react-media-hook2.svg?style=flat)](https://travis-ci.org/imhele/react-media-hook2)
[![Coverage Status](https://coveralls.io/repos/github/imhele/react-media-hook2/badge.svg?branch=master)](https://coveralls.io/github/imhele/react-media-hook2?branch=master)
[![License](https://img.shields.io/npm/l/react-media-hook2.svg)](https://npmjs.org/package/react-media-hook2)

English | [简体中文](https://github.com/imhele/react-media-hook2/blob/master/README-zh_CN.md)

## Install

```sh
$ npm install react-media-hook2 --save
or
$ yarn add react-media-hook2
```

## Options

```ts
interface UseMediaProps {
  defaultMatches?: boolean;
  id?: any;
  onChange?: (matches: boolean) => void | boolean;
  paused?: boolean;
  query?: string | MediaQueryProperties | MediaQueryProperties[];
  targetWindow?: Window;
}
```

## Example

### Basic usage

```jsx
import useMedia from 'react-media-hook2';

export default () => {
  const [matches, setProps] = useMedia({ query: '(max-width: 600px)' });
  return <div>Width of window is {matches ? 'less' : 'greater'} than 600px.</div>;
};
```

### With `MediaQueryProperties`

```jsx
import useMedia from 'react-media-hook2';

export default () => {
  const [matches, setProps] = useMedia({ query: { maxWidth: 600 } });
  return <div>Width of window is {matches ? 'less' : 'greater'} than 600px.</div>;
};
```

### Callback

For example, when the screen width changes, let the side menu expand or collapse once automatically.

```jsx
import { useState } from 'react';
import useMedia from 'react-media-hook2';

export default () => {
  const [collapsed, setCollapsed] = useState(false);
  const [matches, setProps] = useMedia({ query: { maxWidth: 600 }, onChange: setCollapsed });
  return <MenuComponen collapsed={collapsed} onCollapsed={setCollapsed} />;
};
```

Tips: if `onChange` return `true`, **`useMedia` will not change the `matches` this time**.

### `getUseMedia`

Sometimes we need to use the same media query in many components to achieve responsiveness, so `getUseMedia` is provided for you to get the hook created in other components.

```jsx
import ChildComponent from './example';
import useMedia from 'react-media-hook2';

export default () => {
  const [matches, setProps] = useMedia({ id: 0, query: { maxWidth: 600 } });
  return (
    <div>
      <div>Width of window is {matches ? 'less' : 'greater'} than 600px.</div>
      <ChildComponent />
    </div>
  );
};

// `./example`
import { getUseMedia } from 'react-media-hook2';

export default () => {
  const [matches, setProps] = getUseMedia(0);
  return <div>matches: {matches}</div>
}
```

### Pause listener

You can pause listener to provide additional *desktop version* on mobile devices.

```jsx
import { useState } from 'react';
import useMedia from 'react-media-hook2';

export default () => {
  const [matches, setProps] = useMedia({ query: '(max-width: 600px)' });
  return (
    <div>
      <div>Width of window is {matches ? 'less' : 'greater'} than 600px.</div>
      <button onClick={() => setProps(prevProps => ({ ...prevProps, paused: true }))}>
        Pause listener
      </button>
    </div>
  );
};
```

### Reset props

```jsx
import { useState } from 'react';
import useMedia from 'react-media-hook2';

export default () => {
  const [matches, setProps] = useMedia({ query: '(max-width: 600px)' });
  const setRandomValue = () =>
    setProps(prevProps => ({ ...prevProps, query: { maxWidth: Math.Random() * 1000 } }));
  return (
    <div>
      <div>Width of window is {matches ? 'less' : 'greater'} than 600px.</div>
      <button onClick={setRandomValue}>Set a random value</button>
    </div>
  );
};
```

### In _TypeScript_

You can use `enum` to ensure that the `id` is globally unique:

```tsx
import React from 'react';
import useMedia from 'react-media-hook2';

export enum GlobalId {
  MyComponent,
}

export default () => {
  const [matches, setProps] = useMedia({ id: GlobalId.MyComponent, query: '(max-width: 600px)' });
  return <div>Width of window is {matches ? 'less' : 'greater'} than 600px</div>;
};
```
