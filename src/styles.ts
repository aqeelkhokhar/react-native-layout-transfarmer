import { useMemo } from 'react';
import {
  StyleSheet,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { getLayout } from './layout';
import type { Scaler } from './scaler';
import { useLayout } from './useLayout';

type StyleObject = Record<string, unknown>;

const HORIZONTAL = new Set([
  'width',
  'minWidth',
  'maxWidth',
  'left',
  'right',
  'start',
  'end',
  'marginLeft',
  'marginRight',
  'marginHorizontal',
  'marginStart',
  'marginEnd',
  'paddingLeft',
  'paddingRight',
  'paddingHorizontal',
  'paddingStart',
  'paddingEnd',
  'columnGap',
]);

const VERTICAL = new Set([
  'height',
  'minHeight',
  'maxHeight',
  'top',
  'bottom',
  'marginTop',
  'marginBottom',
  'marginVertical',
  'paddingTop',
  'paddingBottom',
  'paddingVertical',
  'rowGap',
]);

/** Same on both axes, so they follow the horizontal scale. */
const UNIFORM = new Set([
  'margin',
  'padding',
  'gap',
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'borderTopStartRadius',
  'borderTopEndRadius',
  'borderBottomStartRadius',
  'borderBottomEndRadius',
  'shadowRadius',
]);

const FONT = new Set(['fontSize', 'lineHeight', 'letterSpacing']);

const scaleStyleWith = <T extends StyleObject>(style: T, s: Scaler): T => {
  const result: StyleObject = {};
  for (const [key, value] of Object.entries(style)) {
    if (typeof value === 'number') {
      if (HORIZONTAL.has(key) || UNIFORM.has(key)) result[key] = s.scale(value);
      else if (VERTICAL.has(key)) result[key] = s.verticalScale(value);
      else if (FONT.has(key)) result[key] = s.scaleFont(value);
      else result[key] = value;
    } else if (key === 'shadowOffset' && value && typeof value === 'object') {
      const { width, height } = value as { width: number; height: number };
      result[key] = { width: s.scale(width), height: s.verticalScale(height) };
    } else if (key === 'transform' && Array.isArray(value)) {
      result[key] = value.map((entry: StyleObject) => {
        const [name] = Object.keys(entry);
        const amount = name ? entry[name] : undefined;
        if (typeof amount !== 'number') return entry;
        if (name === 'translateX') return { translateX: s.scale(amount) };
        if (name === 'translateY')
          return { translateY: s.verticalScale(amount) };
        return entry;
      });
    } else {
      result[key] = value;
    }
  }
  return result as T;
};

/**
 * Scales a flat style object written at design size. Sizes that follow the
 * width are scaled with `scale`, heights with `verticalScale`, text with
 * `scaleFont`. `flex`, `opacity`, `zIndex`, `borderWidth`, percent strings and
 * every other key are left alone.
 */
export const scaleStyle = <T extends StyleObject>(
  style: T,
  scaler: Scaler = getLayout()
): T => scaleStyleWith(style, scaler);

type DesignStyles = Record<string, ViewStyle | TextStyle | ImageStyle>;

const scaleSheet = <T extends DesignStyles>(
  designStyles: T,
  scaler: Scaler
): T => {
  const out: Record<string, StyleObject> = {};
  for (const [name, style] of Object.entries(designStyles)) {
    out[name] = scaleStyleWith(style as StyleObject, scaler);
  }
  return StyleSheet.create(out as T);
};

/**
 * Like `StyleSheet.create`, but the styles are written at design size and
 * scaled once for the current screen. Use `useScaledStyles` to keep them in
 * step with rotation and window changes.
 */
export const createScaledStyles = <T extends DesignStyles>(
  designStyles: T
): T => scaleSheet(designStyles, getLayout());

/**
 * Memoized scaled styles that update when the window changes. Pass a plain
 * object (declared outside the component) or a function that receives the
 * scaler, for example to read `isTablet`. Wrap a factory in `useCallback` or
 * declare it outside the component to keep the memoization.
 */
export const useScaledStyles = <T extends DesignStyles>(
  designStyles: T | ((layout: Scaler) => T)
): T => {
  const layout = useLayout();
  return useMemo(
    () =>
      scaleSheet(
        typeof designStyles === 'function'
          ? (designStyles as (layout: Scaler) => T)(layout)
          : designStyles,
        layout
      ),
    [layout, designStyles]
  );
};
