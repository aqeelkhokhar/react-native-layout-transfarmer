import {
  calculateAspectRatio,
  calculateDestinationDimensions,
  calculateHeightFromWidth,
  calculateProportionalHeight,
  calculateProportionalWidth,
  calculateWidthFromHeight,
} from '../index';

describe('aspect', () => {
  it('calculates the aspect ratio', () => {
    expect(calculateAspectRatio(1600, 900)).toBeCloseTo(16 / 9);
  });

  it('keeps the ratio when computing a proportional height and width', () => {
    expect(calculateProportionalHeight(300, 200, 350)).toBeCloseTo(233.3333, 3);
    expect(calculateProportionalWidth(300, 200, 250)).toBeCloseTo(375);
  });

  it('keeps the deprecated aliases working', () => {
    expect(calculateHeightFromWidth(300, 200, 350)).toBe(
      calculateProportionalHeight(300, 200, 350)
    );
    expect(calculateWidthFromHeight(300, 200, 250)).toBe(
      calculateProportionalWidth(300, 200, 250)
    );
  });

  describe('calculateDestinationDimensions', () => {
    it('fits a wider source to the destination width', () => {
      const result = calculateDestinationDimensions(1600, 900, 400, 400);
      expect(result.isFullWidth).toBe(true);
      expect(result.width).toBe(400);
      expect(result.height).toBeCloseTo(225);
    });

    it('fits a taller source to the destination height', () => {
      const result = calculateDestinationDimensions(900, 1600, 400, 400);
      expect(result.isFullWidth).toBe(false);
      expect(result.height).toBe(400);
      expect(result.width).toBeCloseTo(225);
    });

    it('fills exactly when the ratios are equal', () => {
      const result = calculateDestinationDimensions(100, 200, 50, 100);
      expect(result.width).toBeCloseTo(50);
      expect(result.height).toBe(100);
    });
  });

  describe('invalid sizes', () => {
    it('throws a clear error in development', () => {
      expect(() => calculateAspectRatio(100, 0)).toThrow(RangeError);
      expect(() => calculateProportionalHeight(-1, 10, 10)).toThrow(
        /calculateProportionalHeight/
      );
      expect(() => calculateAspectRatio(NaN, 10)).toThrow(RangeError);
    });

    it('falls back to identity scaling in production', () => {
      const g = globalThis as { __DEV__?: boolean };
      const previous = g.__DEV__;
      g.__DEV__ = false;
      try {
        expect(calculateAspectRatio(100, 0)).toBe(1);
        expect(calculateProportionalHeight(0, 200, 350)).toBe(350);
      } finally {
        g.__DEV__ = previous;
      }
    });
  });
});
