export default interface MediaQueryProperties {
  all?: boolean;
  aspectRatio?: string;
  color?: number | string;
  colorIndex?: number | string;
  grid?: 0 | 1;
  height?: number | string;
  maxWidth?: number | string;
  minWidth?: number | string;
  monochrome?: number | string;
  orientation?: 'portrait' | 'landscape';
  print?: boolean;
  resolution?: string;
  scan?: 'portrait' | 'landscape';
  screen?: boolean;
  speech?: boolean;
  width?: number | string;
  /**
   * Media Queries Level 4
   */
  anyHover?: 'none' | 'hover';
  anyPointer?: 'none' | 'coarse' | 'fine';
  colorGamut?: 'srgb' | 'p3' | 'rec2020';
  hover?: 'none' | 'hover';
  overflowBlock?: 'none' | 'scroll' | 'optional-paged' | 'paged';
  overflowInline?: 'none' | 'scroll';
  pointer?: 'none' | 'coarse' | 'fine';
  update?: 'none' | 'slow' | 'fast';
  /**
   * Media Queries Level 5
   */
  invertedColors?: 'inverted' | 'none';
  lightLevel?: 'dim' | 'normal' | 'washed';
  prefersColorScheme?: 'no-preference' | 'light' | 'dark';
  prefersReducedMotion?: 'no-preference' | 'reduce';
  scripting?: 'none' | 'initial-only' | 'enabled';
  /**
   * Web App Manifest spec.
   * http://w3c.github.io/manifest/#the-display-mode-media-feature
   */
  displayMode?: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
}
