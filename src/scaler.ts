import type { LayoutConfig } from './config';
import type { Size } from './types';

export type Orientation = 'portrait' | 'landscape';

export type Scaler = {
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  orientation: Orientation;
  isLandscape: boolean;
  isTablet: boolean;
  /** Scales a horizontal size (width, horizontal margin, radius). */
  scale: (size: number) => number;
  /** Scales a vertical size (height, vertical margin). */
  verticalScale: (size: number) => number;
  /** Scales by a fraction of the difference. `factor` 0 keeps the size, 1 is `scale`. */
  moderateScale: (size: number, factor?: number) => number;
  moderateVerticalScale: (size: number, factor?: number) => number;
  /** Moderate scale for text that also applies the `fontScale` mode. */
  scaleFont: (size: number, factor?: number) => number;
};

const clamp = (value: number, config: LayoutConfig): number => {
  let result = value;
  if (config.maxScale !== undefined) result = Math.min(result, config.maxScale);
  if (config.minScale !== undefined) result = Math.max(result, config.minScale);
  return result;
};

/**
 * Builds every scaling function for one window size. Pure, so it can be tested
 * and memoized without touching React Native.
 */
export const createScaler = (
  window: Size,
  config: LayoutConfig,
  osFontScale: number
): Scaler => {
  const { width, height } = window;
  const short = Math.min(width, height);
  const long = Math.max(width, height);
  const useShortSide = config.scaleBy === 'shortSide';

  const scaleX = clamp(
    (useShortSide ? short : width) / config.designWidth,
    config
  );
  const scaleY = clamp(
    (useShortSide ? long : height) / config.designHeight,
    config
  );

  const scale = (size: number): number => size * scaleX;
  const verticalScale = (size: number): number => size * scaleY;
  const moderateScale = (size: number, factor = 0.5): number =>
    size + (scale(size) - size) * factor;
  const moderateVerticalScale = (size: number, factor = 0.5): number =>
    size + (verticalScale(size) - size) * factor;

  const fontScale = osFontScale > 0 ? osFontScale : 1;
  const scaleFont = (size: number, factor = 0.5): number => {
    const scaled = moderateScale(size, factor);
    if (config.fontScale === 'ignore') return scaled / fontScale;
    if (config.fontScale === 'capped') {
      return (scaled / fontScale) * Math.min(fontScale, config.maxFontScale);
    }
    return scaled;
  };

  const isLandscape = width > height;
  return {
    width,
    height,
    scaleX,
    scaleY,
    orientation: isLandscape ? 'landscape' : 'portrait',
    isLandscape,
    isTablet: short >= config.tabletBreakpoint,
    scale,
    verticalScale,
    moderateScale,
    moderateVerticalScale,
    scaleFont,
  };
};
