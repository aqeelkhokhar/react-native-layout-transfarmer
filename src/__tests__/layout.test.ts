import {
  configureLayout,
  getLayoutConfig,
  moderateScale,
  moderateVerticalScale,
  scale,
  scaleFont,
  verticalScale,
} from '../index';
import { createScaler } from '../scaler';
import { resetLayout, setFontScale, setWindow } from '../__fixtures__/helpers';

describe('layout', () => {
  beforeEach(resetLayout);

  it('is the identity at the design size', () => {
    expect(scale(10)).toBe(10);
    expect(verticalScale(10)).toBe(10);
    expect(moderateScale(10)).toBe(10);
  });

  it('scales by the window width and height', () => {
    setWindow(750, 1624);
    expect(scale(10)).toBe(20);
    expect(verticalScale(10)).toBe(20);
    expect(moderateScale(10)).toBe(15);
    expect(moderateScale(10, 0)).toBe(10);
    expect(moderateScale(10, 1)).toBe(20);
    expect(moderateVerticalScale(10)).toBe(15);
  });

  it('gives the same result in landscape with the default shortSide mode', () => {
    setWindow(812, 375);
    expect(scale(10)).toBe(10);
    expect(verticalScale(10)).toBe(10);
  });

  it('follows the real window in window mode', () => {
    configureLayout({ scaleBy: 'window' });
    setWindow(812, 375);
    expect(scale(10)).toBeCloseTo(21.65, 1);
    expect(verticalScale(10)).toBeCloseTo(4.62, 1);
  });

  it('caps and floors the scale', () => {
    configureLayout({ maxScale: 1.5, minScale: 0.9 });
    setWindow(1500, 3000);
    expect(scale(10)).toBe(15);
    setWindow(200, 400);
    expect(scale(10)).toBe(9);
  });

  describe('configureLayout', () => {
    it('merges, returns and resets the config', () => {
      const next = configureLayout({ designWidth: 400 });
      expect(next.designWidth).toBe(400);
      expect(next.designHeight).toBe(812);
      expect(getLayoutConfig()).toBe(next);
      setWindow(800, 1624);
      expect(scale(10)).toBe(20);
    });

    it('rejects an invalid design size', () => {
      expect(() => configureLayout({ designWidth: 0 })).toThrow(RangeError);
      expect(() => configureLayout({ designHeight: -1 })).toThrow(RangeError);
      expect(getLayoutConfig().designWidth).toBe(375);
    });
  });

  describe('scaleFont', () => {
    beforeEach(() => setWindow(750, 1624));

    it('respects the OS font scale by default', () => {
      setFontScale(2);
      expect(scaleFont(10)).toBe(15);
    });

    it('can ignore the OS font scale', () => {
      configureLayout({ fontScale: 'ignore' });
      setFontScale(2);
      expect(scaleFont(10)).toBe(7.5);
    });

    it('can cap the OS font scale', () => {
      configureLayout({ fontScale: 'capped', maxFontScale: 1.3 });
      setFontScale(2);
      expect(scaleFont(10)).toBeCloseTo((15 / 2) * 1.3);
      setFontScale(1);
      expect(scaleFont(10)).toBe(15);
    });

    it('survives a nonsense font scale', () => {
      configureLayout({ fontScale: 'ignore' });
      setFontScale(0);
      expect(scaleFont(10)).toBe(15);
    });
  });
});

describe('createScaler', () => {
  const config = { ...getLayoutConfig() };

  it('reports orientation and tablet', () => {
    const phone = createScaler({ width: 390, height: 844 }, config, 1);
    expect(phone).toMatchObject({
      orientation: 'portrait',
      isLandscape: false,
      isTablet: false,
    });
    const tablet = createScaler({ width: 1194, height: 834 }, config, 1);
    expect(tablet).toMatchObject({
      orientation: 'landscape',
      isLandscape: true,
      isTablet: true,
    });
  });

  it('honours a custom tablet breakpoint', () => {
    const custom = { ...config, tabletBreakpoint: 400 };
    expect(createScaler({ width: 410, height: 800 }, custom, 1).isTablet).toBe(
      true
    );
  });
});
