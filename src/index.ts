import format from './format';
import MediaQueryProperties from './media';
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface UseMediaProps {
  defaultMatches?: boolean;
  id?: any;
  onChange?: (matches: boolean) => void | boolean;
  paused?: boolean;
  query?: string | MediaQueryProperties | MediaQueryProperties[];
  targetWindow?: Window;
}

export type SetUseMediaProps = Dispatch<SetStateAction<UseMediaProps>>;

const createMatchMediaPolyfill = (matches: boolean, media: string): Partial<MediaQueryList> => ({
  matches,
  media,
  addListener() {},
  removeListener() {},
});

const createMatchMedia = (
  props: UseMediaProps,
  ref: MutableRefObject<MediaQueryList>,
  prevRef: MutableRefObject<MediaQueryList>,
): void => {
  const { defaultMatches = false, query = '', targetWindow = window } = props;
  const warn =
    // tslint:disable-next-line no-console
    ['production', 'test'].includes(process && process.env.NODE_ENV!) && console && console.warn;
  prevRef.current = ref.current;
  if (typeof targetWindow !== 'object') {
    // tslint:disable-next-line no-unused-expression
    warn && warn(`[UseMedia] Invalid \`targetWindow\``);
  } else if (typeof targetWindow.matchMedia !== 'function') {
    // tslint:disable-next-line no-unused-expression
    warn && warn(`[UseMedia] Current \`targetWindow\` doesn't support \`matchMedia\` API.`);
  } else {
    return (ref.current = targetWindow.matchMedia(format(query))) && void 0;
  }
  ref.current = createMatchMediaPolyfill(defaultMatches, format(query)) as MediaQueryList;
};

const useMediaStorage: Map<any, [boolean, SetUseMediaProps]> = new Map();

const useMedia = (initialProps: UseMediaProps = {}): [boolean, SetUseMediaProps] => {
  const listenRef = useRef<boolean>(false);
  const setPropsRef = useRef<SetUseMediaProps>();
  const mediaQueryListRef = useRef<MediaQueryList>(void 0 as any);
  const prevMediaQueryListRef = useRef<MediaQueryList>(mediaQueryListRef.current);
  const useMediaPropsRef = useRef<UseMediaProps>({ ...initialProps });
  useState(() => {
    createMatchMedia(useMediaPropsRef.current, mediaQueryListRef, prevMediaQueryListRef);
    useMediaPropsRef.current.defaultMatches = mediaQueryListRef.current!.matches;
    setPropsRef.current = (nextProps = {}) => {
      if (typeof nextProps === 'function')
        useMediaPropsRef.current = nextProps(useMediaPropsRef.current) || {};
      else useMediaPropsRef.current = nextProps;
      createMatchMedia(useMediaPropsRef.current, mediaQueryListRef, prevMediaQueryListRef);
      setMatches(mediaQueryListRef.current.matches);
    };
  });
  const [matches, setMatches] = useState(useMediaPropsRef.current.defaultMatches!);
  const eventListener = () => {
    if (!listenRef.current || useMediaPropsRef.current.paused) return;
    if (useMediaPropsRef.current.onChange) {
      if (useMediaPropsRef.current.onChange(mediaQueryListRef.current.matches)) return;
    }
    setMatches(mediaQueryListRef.current.matches);
  };
  useEffect(() => {
    if (prevMediaQueryListRef.current) {
      prevMediaQueryListRef.current.removeListener(eventListener);
    }
    listenRef.current = true;
    mediaQueryListRef.current.addListener(eventListener);
    return () => {
      listenRef.current = false;
      mediaQueryListRef.current.removeListener(eventListener);
    };
  }, [mediaQueryListRef.current]);
  useMemo(() => {
    useMediaStorage.set(useMediaPropsRef.current.id, [matches, setPropsRef.current!]);
  }, [matches]);
  return [matches, setPropsRef.current!];
};

export default useMedia;
export const getUseMedia = (id: any) => useMediaStorage.get(id);
