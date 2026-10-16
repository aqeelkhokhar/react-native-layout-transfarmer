import type { Rect, TransformableObject } from './types';

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
 * only (a `zoomScale` of `0` collapses the object, it is not ignored).
 */
export const transformObject = (
  sourceObject: TransformableObject,
  scaleX: number,
  scaleY: number
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
  return {
    ...transformed,
    ...applyObjectZoomScale(
      transformed.width,
      transformed.height,
      sourceObject.zoomScale
    ),
  };
};

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
  scaleY: number
): T[] =>
  sourceObjects.map((obj) => ({
    ...obj,
    ...transformObject(obj, scaleX, scaleY),
  }));
