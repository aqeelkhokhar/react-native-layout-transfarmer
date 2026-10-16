export type Size = { width: number; height: number };

export type Point = { x: number; y: number };

export type Rect = Point & Size;

export type TransformableObject = Rect & {
  /** Multiplies the transformed width and height. Position is not affected. */
  zoomScale?: number;
};
