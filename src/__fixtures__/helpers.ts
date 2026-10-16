import { Dimensions, PixelRatio } from 'react-native';
import { resetLayoutConfig } from '../index';

/** Sets the window size through the real Dimensions module (emits change events). */
export const setWindow = (width: number, height: number) => {
  Dimensions.set({
    window: { width, height, scale: 2, fontScale: 1 },
    screen: { width, height, scale: 2, fontScale: 1 },
  });
};

export const setFontScale = (value: number) =>
  jest.spyOn(PixelRatio, 'getFontScale').mockReturnValue(value);

export const resetLayout = () => {
  resetLayoutConfig();
  jest.restoreAllMocks();
  setWindow(375, 812);
};
