declare const __DEV__: boolean | undefined;

const isDev = (): boolean => typeof __DEV__ !== 'undefined' && !!__DEV__;

/**
 * Returns `numerator / denominator`.
 *
 * An invalid input (a denominator that is not a positive finite number, or a
 * non finite numerator) throws a `RangeError` in development so the mistake is
 * visible. In production it returns `1` (identity scaling) so a bad value can
 * never put `NaN` or `Infinity` into a layout.
 */
export const ratio = (
  fnName: string,
  numerator: number,
  denominator: number
): number => {
  if (
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    denominator <= 0
  ) {
    if (isDev()) {
      throw new RangeError(
        `react-native-layout-transfarmer: ${fnName} received an invalid size (${numerator} / ${denominator}). Sizes must be positive, finite numbers.`
      );
    }
    return 1;
  }
  return numerator / denominator;
};
