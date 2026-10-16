import { ratio } from './validate';

/** Scale factors that map a source size onto a destination size. */
export const calculateScalingFactors = (
  sourceWidth: number,
  sourceHeight: number,
  destinationWidth: number,
  destinationHeight: number
): { scaleX: number; scaleY: number } => ({
  scaleX: ratio('calculateScalingFactors', destinationWidth, sourceWidth),
  scaleY: ratio('calculateScalingFactors', destinationHeight, sourceHeight),
});

/** Multiplies a value by a scale factor. */
export const scaleValue = (value: number, scale: number): number =>
  value * scale;

/** Scales a value by the destination to source width ratio. */
export const scaleHorizontal = (
  value: number,
  sourceWidth: number,
  destinationWidth: number
): number => value * ratio('scaleHorizontal', destinationWidth, sourceWidth);

/** Scales a value by the destination to source height ratio. */
export const scaleVertical = (
  value: number,
  sourceHeight: number,
  destinationHeight: number
): number => value * ratio('scaleVertical', destinationHeight, sourceHeight);

/** Scales a value by the smaller of the two ratios, so it never overflows. */
export const scaleUniform = (
  value: number,
  sourceWidth: number,
  sourceHeight: number,
  destinationWidth: number,
  destinationHeight: number
): number => {
  const scaleX = ratio('scaleUniform', destinationWidth, sourceWidth);
  const scaleY = ratio('scaleUniform', destinationHeight, sourceHeight);
  return value * Math.min(scaleX, scaleY);
};

/** @deprecated Use {@link scaleValue}. Removed in 2.0. */
export const calculateFontSize = (
  sourceFontSize: number,
  scaleX: number
): number => scaleValue(sourceFontSize, scaleX);
