import 'jest';
import format from '../src/format';

describe('Test for `format.ts`', () => {
  it('API exists', () => {
    expect(format).toBeTruthy();
  });

  it('With `string`', () => {
    expect(format('test')).toBe('test');
  });

  it('With `MediaQueryProperties`', () => {
    const mediaQuery = format({ maxWidth: 600, minWidth: 100, screen: false });
    expect(mediaQuery.split('and')).toHaveLength(3);
    expect(mediaQuery.includes('not screen')).toBe(true);
    expect(mediaQuery.includes('(max-width: 600px)')).toBe(true);
    expect(mediaQuery.includes('(min-width: 100px)')).toBe(true);
  });

  it('With `MediaQueryProperties[]`', () => {
    const mediaQuery = format([{ maxWidth: 600 }, { minWidth: 100 }, { screen: true }]);
    expect(mediaQuery.split(',')).toHaveLength(3);
    expect(mediaQuery.includes('and')).toBe(false);
    expect(mediaQuery.includes('screen')).toBe(true);
    expect(mediaQuery.includes('(max-width: 600px)')).toBe(true);
    expect(mediaQuery.includes('(min-width: 100px)')).toBe(true);
  });
});
