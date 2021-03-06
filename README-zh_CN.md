# use-media-easy

[![NPM version](https://img.shields.io/npm/v/use-media-easy.svg?style=flat)](https://npmjs.org/package/use-media-easy)
[![NPM downloads](http://img.shields.io/npm/dm/use-media-easy.svg?style=flat)](https://npmjs.org/package/use-media-easy)
[![Build Status](https://img.shields.io/travis/imhele/use-media-easy.svg?style=flat)](https://travis-ci.org/imhele/use-media-easy)
[![Coverage Status](https://coveralls.io/repos/github/imhele/use-media-easy/badge.svg?branch=master)](https://coveralls.io/github/imhele/use-media-easy?branch=master)
[![License](https://img.shields.io/npm/l/use-media-easy.svg)](https://npmjs.org/package/use-media-easy)

[English](https://github.com/imhele/use-media-easy/blob/master/README.md) | 简体中文

## 安装

```sh
$ npm install use-media-easy --save
或者
$ yarn add use-media-easy
```

## 属性

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

## 示例

### 基本用法

```jsx
import useMedia from 'use-media-easy';

export default () => {
  const [matches, setProps] = useMedia({ query: '(max-width: 600px)' });
  return <div>屏幕宽度{matches ? '小于' : '大于'} 600 像素。</div>;
};
```

### 使用 `MediaQueryProperties`

```jsx
import useMedia from 'use-media-easy';

export default () => {
  const [matches, setProps] = useMedia({ query: { maxWidth: 600 } });
  return <div>屏幕宽度{matches ? '小于' : '大于'} 600 像素。</div>;
};
```

### 回调

例如，在屏幕宽度变化之后，让侧边菜单自动展开或收起一次。

```jsx
import { useState } from 'react';
import useMedia from 'use-media-easy';

export default () => {
  const [collapsed, setCollapsed] = useState(false);
  const [matches, setProps] = useMedia({ query: { maxWidth: 600 }, onChange: setCollapsed });
  return <MenuComponen collapsed={collapsed} onCollapsed={setCollapsed} />;
};
```

注意: 如果 `onChange` 返回的值为 `true`, **`useMedia` 本次将不会改变 `matches` 的值**。

### `getUseMedia`

有时我们需要在很多组件中使用相同的 Media Query 条件来实现响应式，所以这里为你准备了 `getUseMedia` 方便你通过 `id` 在其他组件获取到已创建过的 Hook 。

```jsx
import ChildComponent from './example';
import useMedia from 'use-media-easy';

export default () => {
  const [matches, setProps] = useMedia({ id: 0, query: { maxWidth: 600 } });
  return (
    <div>
      <div>屏幕宽度{matches ? '小于' : '大于'} 600 像素。</div>
      <ChildComponent />
    </div>
  );
};

// `./example`
import { getUseMedia } from 'use-media-easy';

export default () => {
  const [matches, setProps] = getUseMedia(0);
  return <div>是否匹配：{matches}</div>
}
```

### 暂停

你可以通过暂停事件监听，以便在移动设备上提供额外的*桌面版*。

```jsx
import { useState } from 'react';
import useMedia from 'use-media-easy';

export default () => {
  const [matches, setProps] = useMedia({ query: '(max-width: 600px)' });
  return (
    <div>
      <div>屏幕宽度{matches ? '小于' : '大于'} 600 像素。</div>
      <button onClick={() => setProps(prevProps => ({ ...prevProps, paused: true }))}>
        暂停事件监听
      </button>
    </div>
  );
};
```

### 重置参数

```jsx
import { useState } from 'react';
import useMedia from 'use-media-easy';

export default () => {
  const [matches, setProps] = useMedia({ query: '(max-width: 600px)' });
  const setRandomValue = () =>
    setProps(prevProps => ({ ...prevProps, query: { maxWidth: Math.Random() * 1000 } }));
  return (
    <div>
      <div>屏幕宽度{matches ? '小于' : '大于'} 600 像素。</div>
      <button onClick={setRandomValue}>设置一个随机值</button>
    </div>
  );
};
```

### 在 _TypeScript_ 中使用

你可以使用 `enum` 来确保 `id` 是全局唯一的：

```tsx
import React from 'react';
import useMedia from 'use-media-easy';

export enum GlobalId {
  MyComponent,
}

export default () => {
  const [matches, setProps] = useMedia({ id: GlobalId.MyComponent, query: '(max-width: 600px)' });
  return <div>屏幕宽度{matches ? '小于' : '大于'} 600 像素。</div>;
};
```
