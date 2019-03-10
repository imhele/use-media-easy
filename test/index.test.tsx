import 'jest';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import useMedia, { getUseMedia, SetUseMediaProps, UseMediaProps } from '../src';

/**
 * Mock
 */
let container: HTMLDivElement;
const ListenerQueue: Set<(event: MediaQueryListEvent) => void> = new Set();
interface WirtableMediaQueryList {
  matches: boolean;
  addListener: (listener: (event: MediaQueryListEvent) => void) => void;
  removeListener: (listener: (event: MediaQueryListEvent) => void) => void;
}
const mockMatchMedia: WirtableMediaQueryList = {
  matches: false,
  addListener: listener => ListenerQueue.add(listener),
  removeListener: listener => ListenerQueue.delete(listener),
};
Object.defineProperty(window, 'matchMedia', {
  value: (query: string): MediaQueryList => mockMatchMedia as MediaQueryList,
});

/**
 * Test components
 */
interface TestComponentProps extends UseMediaProps {
  getSetProps?: (setprops: SetUseMediaProps) => void;
}
const TestComponent = ({ getSetProps, ...props }: TestComponentProps) => {
  const [matches, setProps] = useMedia(Object.keys(props).length ? props : void 0);
  if (getSetProps) getSetProps(setProps);
  return <span>{`${matches}`}</span>;
};
const WrappedTestComponent = () => {
  const [unmount, setUnmount] = React.useState(false);
  return (
    <div>
      {unmount || <TestComponent id="WrappedTestComponent" />}
      <button onClick={() => setUnmount(!unmount)} />
    </div>
  );
};

beforeEach(() => {
  mockMatchMedia.matches = false;
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
});

describe('Test for `index.ts`', () => {
  it('API exists', () => {
    expect(useMedia).toBeTruthy();
    expect(getUseMedia).toBeTruthy();
  });

  it('With default options', () => {
    let setProps: SetUseMediaProps;
    act(() => {
      ReactDOM.render(<TestComponent getSetProps={fn => (setProps = fn)} />, container);
    });
    expect(ListenerQueue.size).toBe(1);
    expect(container.querySelector('span')!.textContent).toBe('false');
    expect(() => {
      act(() => {
        setProps(void 0 as any);
        setProps(prev => prev);
        setProps(() => void 0 as any);
      });
    }).not.toThrow();
  });

  it('With `query` and `targetWindow`', () => {
    mockMatchMedia.matches = true;
    act(() => {
      ReactDOM.render(
        <TestComponent query="(max-width: 1000px)" targetWindow={window} />,
        container,
      );
    });
    expect(container.querySelector('span')!.textContent).toBe('true');
  });

  it('With invalid `targetWindow`', () => {
    let setProps: SetUseMediaProps;
    act(() => {
      ReactDOM.render(
        <TestComponent
          defaultMatches={false}
          getSetProps={fn => (setProps = fn)}
          targetWindow={0 as any}
        />,
        container,
      );
    });
    expect(setProps!).toBeInstanceOf(Function);
    expect(container.querySelector('span')!.textContent).toBe('false');
    act(() => setProps({ targetWindow: {} as Window }));
    expect(container.querySelector('span')!.textContent).toBe('false');
  });

  it('With `id`', () => {
    mockMatchMedia.matches = true;
    act(() => {
      ReactDOM.render(<TestComponent id={0} />, container);
    });
    expect(getUseMedia(0)![0]).toBe(true);
  });

  it('Test matches change and `paused`', () => {
    let setProps: SetUseMediaProps;
    act(() => {
      ReactDOM.render(<TestComponent getSetProps={fn => (setProps = fn)} id={1} />, container);
      mockMatchMedia.matches = true;
      ListenerQueue.forEach(listener => listener(void 0 as any));
    });
    expect(getUseMedia(1)).not.toBe(void 0);
    expect(getUseMedia(1)![0]).toBe(true);
    act(() => {
      setProps(prev => ({ ...prev, paused: true }));
      mockMatchMedia.matches = false;
      ListenerQueue.forEach(listener => listener(void 0 as any));
    });
    expect(getUseMedia(1)![0]).toBe(true);
  });

  it('With `onChange`', () => {
    let setProps: SetUseMediaProps;
    act(() => {
      ReactDOM.render(
        <TestComponent getSetProps={fn => (setProps = fn)} onChange={() => void 0} id={2} />,
        container,
      );
      mockMatchMedia.matches = true;
      ListenerQueue.forEach(listener => listener(void 0 as any));
    });
    expect(getUseMedia(2)![0]).toBe(true);
    act(() => {
      setProps(prev => ({ ...prev, onChange: () => true }));
      mockMatchMedia.matches = false;
      ListenerQueue.forEach(listener => listener(void 0 as any));
    });
    expect(getUseMedia(2)![0]).toBe(true);
  });

  it('Remove listener after unmount', () => {
    act(() => {
      ReactDOM.render(<WrappedTestComponent />, container);
    });
    act(() => {
      container.querySelector('button')!.click();
    });
    expect(container.querySelector('span')).toBe(null);
    act(() => {
      mockMatchMedia.matches = true;
      ListenerQueue.forEach(listener => listener(void 0 as any));
    });
    expect(getUseMedia('WrappedTestComponent')![0]).toBe(false);
  });

  it('Remove listener after `targetWindow` changed', () => {
    let setProps: SetUseMediaProps;
    act(() => {
      ReactDOM.render(
        <TestComponent
          defaultMatches={false}
          getSetProps={fn => (setProps = fn)}
          targetWindow={0 as any}
        />,
        container,
      );
    });
    expect(setProps!).toBeInstanceOf(Function);
    expect(container.querySelector('span')!.textContent).toBe('false');
    mockMatchMedia.matches = true;
    act(() => setProps({}));
    expect(container.querySelector('span')!.textContent).toBe('true');
    mockMatchMedia.matches = false;
    act(() => setProps({}));
    expect(container.querySelector('span')!.textContent).toBe('false');
  });
});
