import {
  calculateFontSize,
  calculateScalingFactors,
  scaleHorizontal,
  scaleUniform,
  scaleValue,
  scaleVertical,
} from '../index';

describe('scaling', () => {
  it('calculates scaling factors', () => {
    const { scaleX, scaleY } = calculateScalingFactors(375, 667, 414, 896);
    expect(scaleX).toBeCloseTo(1.104, 3);
    expect(scaleY).toBeCloseTo(1.3433, 3);
  });

  it('scales a plain value', () => {
    expect(scaleValue(16, 1.5)).toBe(24);
    expect(calculateFontSize(16, 1.5)).toBe(24);
  });

  it('scales horizontally and vertically', () => {
    expect(scaleHorizontal(20, 375, 414)).toBeCloseTo(22.08);
    expect(scaleVertical(20, 667, 896)).toBeCloseTo(26.867, 2);
  });

  it('scales uniformly by the smaller ratio', () => {
    // scaleX 2, scaleY 1.5 -> 1.5
    expect(scaleUniform(10, 100, 200, 200, 300)).toBeCloseTo(15);
    // scaleX 1.5, scaleY 2 -> 1.5
    expect(scaleUniform(10, 200, 100, 300, 200)).toBeCloseTo(15);
  });

  it('rejects invalid source sizes', () => {
    expect(() => calculateScalingFactors(0, 100, 100, 100)).toThrow(RangeError);
    expect(() => scaleHorizontal(10, 0, 100)).toThrow(RangeError);
    expect(() => scaleVertical(10, -5, 100)).toThrow(RangeError);
    expect(() => scaleUniform(10, 100, 0, 100, 100)).toThrow(RangeError);
  });
});
