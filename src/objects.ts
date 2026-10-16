import type { Point, Rect, TransformableObject } from './types';

export type TransformOptions = {
  /**
   * Which point stays put when `zoomScale` resizes the object.
   * `topLeft` (default) keeps the top left corner, `center` keeps the middle.
   */
  anchor?: 'topLeft' | 'center';
};

/** Scales a rectangle's position and size independently on each axis. */
export const calculateObjectTransformedValues = (
  sourceX: number,
  sourceY: number,
  sourceWidth: number,
  sourceHeight: number,
  scaleX: number,
  scaleY: number
): Rect => ({
  x: sourceX * scaleX,
  y: sourceY * scaleY,
  width: sourceWidth * scaleX,
  height: sourceHeight * scaleY,
});

/** Multiplies a size by a zoom factor. */
export const applyObjectZoomScale = (
  transformedWidth: number,
  transformedHeight: number,
  zoomScale: number
): { width: number; height: number } => ({
  width: transformedWidth * zoomScale,
  height: transformedHeight * zoomScale,
});

/**
 * Transforms an object to a new viewport. Position and size are scaled by
 * `scaleX` and `scaleY`; `zoomScale`, when given, then multiplies the size
 * only (a `zoomScale` of `0` collapses the object, it is not ignored). Set
 * `anchor: 'center'` to zoom around the middle instead of the top left corner.
 */
export const transformObject = (
  sourceObject: TransformableObject,
  scaleX: number,
  scaleY: number,
  options: TransformOptions = {}
): Rect => {
  const transformed = calculateObjectTransformedValues(
    sourceObject.x,
    sourceObject.y,
    sourceObject.width,
    sourceObject.height,
    scaleX,
    scaleY
  );

  if (sourceObject.zoomScale === undefined || sourceObject.zoomScale === 1) {
    return transformed;
  }
  const zoomed = applyObjectZoomScale(
    transformed.width,
    transformed.height,
    sourceObject.zoomScale
  );
  if (options.anchor === 'center') {
    return {
      x: transformed.x + (transformed.width - zoomed.width) / 2,
      y: transformed.y + (transformed.height - zoomed.height) / 2,
      ...zoomed,
    };
  }
  return { ...transformed, ...zoomed };
};

/** Scales a point on each axis. */
export const transformPoint = (
  point: Point,
  scaleX: number,
  scaleY: number
): Point => ({ x: point.x * scaleX, y: point.y * scaleY });

/** Scales many points. The input is not mutated. */
export const transformPoints = (
  points: readonly Point[],
  scaleX: number,
  scaleY: number
): Point[] => points.map((point) => transformPoint(point, scaleX, scaleY));

/** Rotation is viewport independent, so it is returned unchanged. */
export const transformRotation = (rotation: number): number => rotation;

/**
 * Transforms many objects at once. Every other field on each object (`id`,
 * `rotation`, `zoomScale`, your own data) is kept as is and keeps its type.
 * The input array and its objects are not mutated.
 */
export const batchTransformObjects = <T extends TransformableObject>(
  sourceObjects: readonly T[],
  scaleX: number,
  scaleY: number,
  options?: TransformOptions
): T[] =>
  sourceObjects.map((obj) => ({
    ...obj,
    ...transformObject(obj, scaleX, scaleY, options),
  }));
