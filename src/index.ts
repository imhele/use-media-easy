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

const createMatchMedia = (props: UseMediaProps, ref: MutableRefObject<MediaQueryList>): boolean => {
  const { query = '', targetWindow = window } = props;
  if (typeof targetWindow !== 'object') {
    // tslint:disable-next-line
    console.warn(`[UseMedia] Invalid \`targetWindow\``);
  } else if (typeof targetWindow.matchMedia !== 'function') {
    // tslint:disable-next-line
    console.warn(`[UseMedia] Current \`targetWindow\` doesn't support \`matchMedia\` API.`);
  } else {
    ref.current = targetWindow.matchMedia(format(query));
    return true;
  }
  return false;
};

const usePrevMQListRef = <T>(value: T): T => {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const useMediaStorage: Map<any, [boolean, SetUseMediaProps]> = new Map();

const useMedia = (initialProps: UseMediaProps = {}): [boolean, SetUseMediaProps] => {
  const listenRef = useRef<boolean>(false);
  const setPropsRef = useRef<SetUseMediaProps>(null);
  const useMediaPropsRef = useRef<UseMediaProps>(null);
  const mediaQueryListRef = useRef<MediaQueryList>(null);
  useState(() => {
    useMediaPropsRef.current = { ...initialProps };
    if (createMatchMedia(useMediaPropsRef.current, mediaQueryListRef))
      useMediaPropsRef.current.defaultMatches = mediaQueryListRef.current.matches;
    setPropsRef.current = (nextProps = {}) => {
      if (typeof nextProps === 'function')
        useMediaPropsRef.current = nextProps(useMediaPropsRef.current) || {};
      else useMediaPropsRef.current = nextProps;
      if (createMatchMedia(useMediaPropsRef.current, mediaQueryListRef))
        setMatches(mediaQueryListRef.current.matches);
    };
  });
  const prevMQListRef = usePrevMQListRef(mediaQueryListRef.current);
  const [matches, setMatches] = useState(useMediaPropsRef.current.defaultMatches);
  const eventListener = () => {
    if (!useMediaPropsRef.current) return;
    if (!listenRef.current || useMediaPropsRef.current.paused) return;
    if (useMediaPropsRef.current.onChange) {
      if (useMediaPropsRef.current.onChange(mediaQueryListRef.current.matches)) return;
    }
    setMatches(mediaQueryListRef.current.matches);
  };
  useEffect(() => {
    if (!listenRef.current && mediaQueryListRef.current) {
      if (prevMQListRef) prevMQListRef.removeListener(eventListener);
      listenRef.current = true;
      mediaQueryListRef.current.addListener(eventListener);
    }
    return () => {
      if (mediaQueryListRef.current) {
        listenRef.current = false;
        mediaQueryListRef.current.removeListener(eventListener);
      }
    };
  }, [mediaQueryListRef.current]);
  useMemo(() => {
    useMediaStorage.set(useMediaPropsRef.current.id, [matches, setPropsRef.current]);
  }, [matches]);
  return [matches, setPropsRef.current];
};

export default useMedia;
export const getUseMedia = (id: any) => useMediaStorage.get(id);
