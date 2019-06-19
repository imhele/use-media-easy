# use-media-easy

[![NPM version](https://img.shields.io/npm/v/use-media-easy.svg?style=flat)](https://npmjs.org/package/use-media-easy)
[![NPM downloads](http://img.shields.io/npm/dm/use-media-easy.svg?style=flat)](https://npmjs.org/package/use-media-easy)
[![Build Status](https://img.shields.io/travis/imhele/use-media-easy.svg?style=flat)](https://travis-ci.org/imhele/use-media-easy)
[![Coverage Status](https://coveralls.io/repos/github/imhele/use-media-easy/badge.svg?branch=master)](https://coveralls.io/github/imhele/use-media-easy?branch=master)
[![License](https://img.shields.io/npm/l/use-media-easy.svg)](https://npmjs.org/package/use-media-easy)

English | [简体中文](https://github.com/imhele/use-media-easy/blob/master/README-zh_CN.md)

## Install

```sh
$ npm install use-media-easy --save
or
$ yarn add use-media-easy
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
import useMedia from 'use-media-easy';

export default () => {
  const [matches, setProps] = useMedia({ query: '(max-width: 600px)' });
  return <div>Width of window is {matches ? 'less' : 'greater'} than 600px.</div>;
};
```

### With `MediaQueryProperties`

```jsx
import useMedia from 'use-media-easy';

export default () => {
  const [matches, setProps] = useMedia({ query: { maxWidth: 600 } });
  return <div>Width of window is {matches ? 'less' : 'greater'} than 600px.</div>;
};
```

### Callback

For example, when the screen width changes, let the side menu expand or collapse once automatically.

```jsx
import { useState } from 'react';
import useMedia from 'use-media-easy';

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
import useMedia from 'use-media-easy';

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
import { getUseMedia } from 'use-media-easy';

export default () => {
  const [matches, setProps] = getUseMedia(0);
  return <div>matches: {matches}</div>
}
```

### Pause listener

You can pause listener to provide additional *desktop version* on mobile devices.

```jsx
import { useState } from 'react';
import useMedia from 'use-media-easy';

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
import useMedia from 'use-media-easy';

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
import useMedia from 'use-media-easy';

export enum GlobalId {
  MyComponent,
}

export default () => {
  const [matches, setProps] = useMedia({ id: GlobalId.MyComponent, query: '(max-width: 600px)' });
  return <div>Width of window is {matches ? 'less' : 'greater'} than 600px</div>;
};
```
