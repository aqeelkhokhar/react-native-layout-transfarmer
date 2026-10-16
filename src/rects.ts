import type { Rect, Size } from './types';
import { ratio } from './validate';

/** Largest rectangle with the source aspect ratio that fits inside the container, centered. */
export const fitRect = (source: Size, container: Size): Rect => {
  const scale = Math.min(
    ratio('fitRect', container.width, source.width),
    ratio('fitRect', container.height, source.height)
  );
  return centerRect(
    { width: source.width * scale, height: source.height * scale },
    container
  );
};

/**
 * Smallest rectangle with the source aspect ratio that covers the container,
 * centered. The offsets are negative where the rectangle overflows.
 */
export const fillRect = (source: Size, container: Size): Rect => {
  const scale = Math.max(
    ratio('fillRect', container.width, source.width),
    ratio('fillRect', container.height, source.height)
  );
  return centerRect(
    { width: source.width * scale, height: source.height * scale },
    container
  );
};

/** Places a size in the middle of a container. */
export const centerRect = (size: Size, container: Size): Rect => ({
  x: (container.width - size.width) / 2,
  y: (container.height - size.height) / 2,
  width: size.width,
  height: size.height,
});
