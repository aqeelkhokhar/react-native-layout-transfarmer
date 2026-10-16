import { Dimensions, PixelRatio } from 'react-native';
import { getLayoutConfig } from './config';
import { createScaler, type Scaler } from './scaler';

/** The scaler for the current window and configuration. */
export const getLayout = (): Scaler => {
  const { width, height } = Dimensions.get('window');
  return createScaler(
    { width, height },
    getLayoutConfig(),
    PixelRatio.getFontScale()
  );
};

/**
 * Scales a horizontal size from the design width to the current screen.
 * Reads the window when called, so call it during render (or use `useLayout`
 * to re-render on rotation and window resize).
 */
export const scale = (size: number): number => getLayout().scale(size);

/** Scales a vertical size from the design height to the current screen. */
export const verticalScale = (size: number): number =>
  getLayout().verticalScale(size);

/** Scales a size by `factor` (default 0.5) of the difference. Good for most sizes. */
export const moderateScale = (size: number, factor?: number): number =>
  getLayout().moderateScale(size, factor);

export const moderateVerticalScale = (size: number, factor?: number): number =>
  getLayout().moderateVerticalScale(size, factor);

/** Moderate scale for font sizes that honours the `fontScale` option. */
export const scaleFont = (size: number, factor?: number): number =>
  getLayout().scaleFont(size, factor);
