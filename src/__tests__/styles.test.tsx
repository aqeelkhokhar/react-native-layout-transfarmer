import { renderHook } from '@testing-library/react-native';
import { act } from 'react';
import {
  configureLayout,
  createScaledStyles,
  scaleStyle,
  useScaledStyles,
} from '../index';
import { resetLayout, setWindow } from '../__fixtures__/helpers';

describe('scaleStyle', () => {
  beforeEach(() => {
    resetLayout();
    setWindow(750, 1624); // scale 2
  });

  it('scales each key family with the right axis', () => {
    const result = scaleStyle({
      width: 100,
      height: 50,
      marginLeft: 4,
      marginTop: 6,
      padding: 8,
      borderRadius: 10,
      gap: 2,
      fontSize: 10,
      lineHeight: 20,
      letterSpacing: 1,
    });
    expect(result).toEqual({
      width: 200,
      height: 100,
      marginLeft: 8,
      marginTop: 12,
      padding: 16,
      borderRadius: 20,
      gap: 4,
      fontSize: 15,
      lineHeight: 30,
      letterSpacing: 1.5,
    });
  });

  it('leaves unrelated and non numeric values alone', () => {
    const style = {
      flex: 1,
      opacity: 0.5,
      zIndex: 3,
      borderWidth: 1,
      width: '50%',
      backgroundColor: '#fff',
      position: 'absolute',
    };
    expect(scaleStyle(style)).toEqual(style);
  });

  it('scales shadow offsets and translate transforms', () => {
    expect(
      scaleStyle({
        shadowOffset: { width: 2, height: 3 },
        transform: [
          { translateX: 5 },
          { translateY: 5 },
          { rotate: '10deg' },
          { scale: 2 },
        ],
      })
    ).toEqual({
      shadowOffset: { width: 4, height: 6 },
      transform: [
        { translateX: 10 },
        { translateY: 10 },
        { rotate: '10deg' },
        { scale: 2 },
      ],
    });
  });

  it('ignores a non numeric transform amount', () => {
    const style = { transform: [{ translateX: '10%' }, {}] };
    expect(scaleStyle(style)).toEqual(style);
  });

  it('does not mutate its input', () => {
    const style = { width: 10 };
    scaleStyle(style);
    expect(style.width).toBe(10);
  });
});

describe('createScaledStyles', () => {
  beforeEach(resetLayout);

  it('returns scaled styles for the current screen', () => {
    setWindow(750, 1624);
    const styles = createScaledStyles({
      card: { width: 100, padding: 5 },
      title: { fontSize: 20 },
    });
    expect(styles.card).toEqual({ width: 200, padding: 10 });
    expect(styles.title).toEqual({ fontSize: 30 });
  });
});

describe('useScaledStyles', () => {
  beforeEach(resetLayout);
  const design = { card: { width: 100, height: 100 } };

  it('re-scales when the window changes', () => {
    configureLayout({ scaleBy: 'window' });
    const { result } = renderHook(() => useScaledStyles(design));
    expect(result.current.card).toEqual({ width: 100, height: 100 });
    act(() => setWindow(750, 1624));
    expect(result.current.card).toEqual({ width: 200, height: 200 });
  });

  it('is memoized for a stable input', () => {
    const { result, rerender } = renderHook(() => useScaledStyles(design));
    const first = result.current;
    rerender({});
    expect(result.current).toBe(first);
  });

  it('accepts a factory that receives the layout', () => {
    setWindow(1194, 834);
    const factory = (layout: { isTablet: boolean }) => ({
      card: { width: layout.isTablet ? 300 : 100 },
    });
    const { result } = renderHook(() => useScaledStyles(factory));
    // shortSide 834 / 375 = 2.224
    expect(result.current.card.width).toBeCloseTo(300 * (834 / 375), 3);
  });
});
