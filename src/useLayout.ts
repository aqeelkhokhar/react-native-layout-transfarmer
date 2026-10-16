import { useMemo } from 'react';
import { PixelRatio, useWindowDimensions } from 'react-native';
import { getLayoutConfig } from './config';
import { createScaler, type Scaler } from './scaler';

/**
 * The scaling functions for the current window. The component re-renders when
 * the window changes (rotation, split screen, foldable, iPad window resize).
 */
export const useLayout = (): Scaler => {
  const { width, height } = useWindowDimensions();
  const config = getLayoutConfig();
  const fontScale = PixelRatio.getFontScale();
  return useMemo(
    () => createScaler({ width, height }, config, fontScale),
    [width, height, config, fontScale]
  );
};
