import { ratio } from './validate';

export type FontScaleMode = 'respect' | 'ignore' | 'capped';

export type LayoutConfig = {
  /** Width of the design mockup in points. Default 375 (iPhone X to 13 mini). */
  designWidth: number;
  /** Height of the design mockup in points. Default 812. */
  designHeight: number;
  /**
   * `shortSide` (default) scales by the shorter screen side for widths and the
   * longer side for heights, so the result is the same in portrait and
   * landscape. `window` scales by the current window width and height.
   */
  scaleBy: 'shortSide' | 'window';
  /** Upper limit for any scale factor, for example 1.5 to calm down tablets. */
  maxScale?: number;
  /** Lower limit for any scale factor. */
  minScale?: number;
  /**
   * How `scaleFont` treats the OS font size setting.
   * `respect` leaves it to `Text` (default), `ignore` cancels it and `capped`
   * allows it up to `maxFontScale`.
   */
  fontScale: FontScaleMode;
  /** Largest OS font scale that `fontScale: 'capped'` allows. Default 1.3. */
  maxFontScale: number;
  /** Shorter side in points from which a device counts as a tablet. Default 600. */
  tabletBreakpoint: number;
};

const DEFAULTS: LayoutConfig = {
  designWidth: 375,
  designHeight: 812,
  scaleBy: 'shortSide',
  fontScale: 'respect',
  maxFontScale: 1.3,
  tabletBreakpoint: 600,
};

let current: LayoutConfig = { ...DEFAULTS };

/**
 * Sets the design size and scaling options once, usually at app start.
 * Only the keys you pass change. Components that use `useLayout` pick the new
 * values up on their next render.
 */
export const configureLayout = (
  config: Partial<LayoutConfig>
): LayoutConfig => {
  const next = { ...current, ...config };
  // Validate eagerly so a typo fails at startup instead of on first render.
  ratio('configureLayout', next.designWidth, next.designWidth);
  ratio('configureLayout', next.designHeight, next.designHeight);
  current = next;
  return current;
};

/** The active configuration. */
export const getLayoutConfig = (): LayoutConfig => current;

/** Restores the defaults. Mostly useful in tests. */
export const resetLayoutConfig = (): LayoutConfig => {
  current = { ...DEFAULTS };
  return current;
};
