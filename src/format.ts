import MediaQueryProperties from './media';

const Camel2CSS = (camel: string): string =>
  camel.replace(/[A-Z]/g, str => `-${str.toLowerCase()}`).toLowerCase();

const CSSProperties2MediaQuery = (css: MediaQueryProperties): string => {
  return Object.keys(css)
    .map(key => {
      let value = css[key as keyof typeof css];
      key = Camel2CSS(key);
      switch (typeof value) {
        case 'boolean':
          return value ? `(${key})` : `(not ${key})`;
        case 'number':
          if (/(?:height|width)$/.test(key)) value = `${value}px`;
        default:
          return `(${key}: ${value})`;
      }
    })
    .join(' and ');
};

export default (query: string | MediaQueryProperties | MediaQueryProperties[]): string => {
  if (typeof query === 'string') return query;
  if (!Array.isArray(query)) return CSSProperties2MediaQuery(query);
  return query.map(CSSProperties2MediaQuery).join(', ');
};
