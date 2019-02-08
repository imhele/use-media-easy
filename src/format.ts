import { CSSProperties } from 'react';

const Camel2CSS = (camel: string): string =>
  camel.replace(/[A-Z]/g, str => `-${str.toLowerCase()}`).toLowerCase();

const CSSProperties2MediaQuery = (css: CSSProperties): string => {
  return Object.entries(css)
    .map(([key, value]) => {
      key = Camel2CSS(key);
      switch (typeof value) {
        case 'boolean':
          return value ? `(${key})` : `(not ${key})`;
        case 'number':
          if (key.endsWith('height') || key.endsWith('width')) value = `${value}px`;
        default:
          return `(${key}: ${value})`;
      }
    })
    .join(' and ');
};

export default (query: string | CSSProperties | CSSProperties[]): string => {
  if (typeof query === 'string') return query;
  if (!Array.isArray(query)) return CSSProperties2MediaQuery(query);
  return query.map(CSSProperties2MediaQuery).join(', ');
};
