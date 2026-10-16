import { useState, type ReactNode } from 'react';
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { Size } from './types';

export type ScaledViewProps = {
  /** Width the children are laid out at. */
  designWidth: number;
  /** Height the children are laid out at. */
  designHeight: number;
  /**
   * `contain` (default) shows everything, `cover` fills the box and may crop,
   * `width` and `height` match one side.
   */
  fit?: 'contain' | 'cover' | 'width' | 'height';
  /** Style of the outer box that sets the available space (needs a size, for example `flex: 1`). */
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

export const getFitScale = (
  design: Size,
  box: Size,
  fit: NonNullable<ScaledViewProps['fit']>
): number => {
  if (design.width <= 0 || design.height <= 0) return 1;
  const sx = box.width / design.width;
  const sy = box.height / design.height;
  if (fit === 'cover') return Math.max(sx, sy);
  if (fit === 'width') return sx;
  if (fit === 'height') return sy;
  return Math.min(sx, sy);
};

/**
 * Lays its children out at a fixed design size, then scales the whole block to
 * fit the space it is given. Ideal for fixed ratio canvases, posters and
 * templates where every pixel must keep its place.
 */
export function ScaledView({
  designWidth,
  designHeight,
  fit = 'contain',
  style,
  children,
}: ScaledViewProps) {
  const [box, setBox] = useState<Size | null>(null);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setBox((prev) =>
      prev && prev.width === width && prev.height === height
        ? prev
        : { width, height }
    );
  };

  const scale = box
    ? getFitScale({ width: designWidth, height: designHeight }, box, fit)
    : 1;

  return (
    <View testID="scaled-view" style={[styles.box, style]} onLayout={onLayout}>
      <View
        testID="scaled-view-content"
        style={[
          { width: designWidth, height: designHeight },
          box ? styles.ready : styles.pending,
          { transform: [{ scale }] },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  ready: { opacity: 1 },
  pending: { opacity: 0 },
});
