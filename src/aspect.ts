import { ratio } from './validate';
import type { Size } from './types';

/** Width divided by height. */
export const calculateAspectRatio = (width: number, height: number): number =>
  ratio('calculateAspectRatio', width, height);

/**
 * Fits the source size inside the destination size while keeping the aspect
 * ratio ("contain"). `isFullWidth` is true when the width fills the destination.
 */
export const calculateDestinationDimensions = (
  sourceWidth: number,
  sourceHeight: number,
  destinationWidth: number,
  destinationHeight: number
): Size & { isFullWidth: boolean } => {
  const sourceAspectRatio = calculateAspectRatio(sourceWidth, sourceHeight);
  const destinationAspectRatio = calculateAspectRatio(
    destinationWidth,
    destinationHeight
  );

  if (sourceAspectRatio > destinationAspectRatio) {
    return {
      width: destinationWidth,
      height:
        destinationWidth *
        ratio('calculateDestinationDimensions', sourceHeight, sourceWidth),
      isFullWidth: true,
    };
  }
  return {
    width:
      destinationHeight *
      ratio('calculateDestinationDimensions', sourceWidth, sourceHeight),
    height: destinationHeight,
    isFullWidth: false,
  };
};

/** Height that keeps the source aspect ratio at the given destination width. */
export const calculateProportionalHeight = (
  sourceWidth: number,
  sourceHeight: number,
  destinationWidth: number
): number =>
  destinationWidth *
  ratio('calculateProportionalHeight', sourceHeight, sourceWidth);

/** Width that keeps the source aspect ratio at the given destination height. */
export const calculateProportionalWidth = (
  sourceWidth: number,
  sourceHeight: number,
  destinationHeight: number
): number =>
  destinationHeight *
  ratio('calculateProportionalWidth', sourceWidth, sourceHeight);

/** @deprecated Use {@link calculateProportionalHeight}. Removed in 2.0. */
export const calculateHeightFromWidth = calculateProportionalHeight;

/** @deprecated Use {@link calculateProportionalWidth}. Removed in 2.0. */
export const calculateWidthFromHeight = calculateProportionalWidth;
