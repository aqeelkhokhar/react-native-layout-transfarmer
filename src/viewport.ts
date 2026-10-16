import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { transformObject, type TransformOptions } from './objects';
import type { Point, Rect, Size, TransformableObject } from './types';
import { ratio } from './validate';

export type ViewportFit = 'stretch' | 'contain' | 'cover';

export type ViewportTransformOptions = TransformOptions & {
  /**
   * How the source viewport maps onto the destination.
   * `stretch` (default) scales each axis on its own, `contain` keeps the aspect
   * ratio and centers (letterbox), `cover` keeps it and fills (crop).
   */
  fit?: ViewportFit;
};

export type ViewportTransform = {
  scaleX: number;
  scaleY: number;
  offsetX: number;
  offsetY: number;
  point: (point: Point) => Point;
  size: (size: Size) => Size;
  rect: (rect: Rect) => Rect;
  /** Transforms an object and keeps its other fields (`id`, `rotation`, your data). */
  object: <T extends TransformableObject>(object: T) => T;
  objects: <T extends TransformableObject>(objects: readonly T[]) => T[];
  /** The way back, so an editor can save in design units. `zoomScale` is not re-applied. */
  inverse: {
    point: (point: Point) => Point;
    size: (size: Size) => Size;
    rect: (rect: Rect) => Rect;
    object: <T extends Rect>(object: T) => T;
  };
};

/**
 * A two way mapping between a source viewport (the size your data was authored
 * or saved at) and a destination viewport (the size you render at).
 */
export const createViewportTransform = (
  source: Size,
  destination: Size,
  options: ViewportTransformOptions = {}
): ViewportTransform => {
  const sx = ratio('createViewportTransform', destination.width, source.width);
  const sy = ratio(
    'createViewportTransform',
    destination.height,
    source.height
  );
  const fit = options.fit ?? 'stretch';

  let scaleX = sx;
  let scaleY = sy;
  if (fit !== 'stretch') {
    scaleX = scaleY = fit === 'contain' ? Math.min(sx, sy) : Math.max(sx, sy);
  }
  const offsetX = (destination.width - source.width * scaleX) / 2;
  const offsetY = (destination.height - source.height * scaleY) / 2;
  const hasOffset = fit !== 'stretch';
  const ox = hasOffset ? offsetX : 0;
  const oy = hasOffset ? offsetY : 0;

  const point = (p: Point): Point => ({
    x: p.x * scaleX + ox,
    y: p.y * scaleY + oy,
  });
  const size = (s: Size): Size => ({
    width: s.width * scaleX,
    height: s.height * scaleY,
  });
  const rect = (r: Rect): Rect => ({ ...point(r), ...size(r) });
  const object = <T extends TransformableObject>(o: T): T => {
    const t = transformObject(o, scaleX, scaleY, options);
    return { ...o, ...t, x: t.x + ox, y: t.y + oy };
  };

  const invPoint = (p: Point): Point => ({
    x: (p.x - ox) / scaleX,
    y: (p.y - oy) / scaleY,
  });
  const invSize = (s: Size): Size => ({
    width: s.width / scaleX,
    height: s.height / scaleY,
  });
  const invRect = (r: Rect): Rect => ({ ...invPoint(r), ...invSize(r) });

  return {
    scaleX,
    scaleY,
    offsetX: ox,
    offsetY: oy,
    point,
    size,
    rect,
    object,
    objects: (list) => list.map((o) => object(o)),
    inverse: {
      point: invPoint,
      size: invSize,
      rect: invRect,
      object: <T extends Rect>(o: T): T => ({ ...o, ...invRect(o) }),
    },
  };
};

/**
 * `createViewportTransform` as a hook. The destination defaults to the window
 * size and follows rotation and window changes. The result is memoized, so it
 * is safe in dependency arrays.
 */
export const useCanvasTransform = (
  source: Size,
  destination?: Size,
  options?: ViewportTransformOptions
): ViewportTransform => {
  const window = useWindowDimensions();
  const dw = destination?.width ?? window.width;
  const dh = destination?.height ?? window.height;
  const fit = options?.fit;
  const anchor = options?.anchor;
  return useMemo(
    () =>
      createViewportTransform(
        { width: source.width, height: source.height },
        { width: dw, height: dh },
        { fit, anchor }
      ),
    [source.width, source.height, dw, dh, fit, anchor]
  );
};
