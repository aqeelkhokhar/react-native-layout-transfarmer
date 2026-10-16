import { act, renderHook } from '@testing-library/react-native';
import { configureLayout, useLayout } from '../index';
import { resetLayout, setWindow } from '../__fixtures__/helpers';

describe('useLayout', () => {
  beforeEach(resetLayout);

  it('returns the current metrics', () => {
    setWindow(750, 1624);
    const { result } = renderHook(() => useLayout());
    expect(result.current.width).toBe(750);
    expect(result.current.scale(10)).toBe(20);
    expect(result.current.orientation).toBe('portrait');
  });

  it('updates on rotation and window resize', () => {
    configureLayout({ scaleBy: 'window' });
    const { result } = renderHook(() => useLayout());
    expect(result.current.isLandscape).toBe(false);
    act(() => setWindow(812, 375));
    expect(result.current.isLandscape).toBe(true);
    expect(result.current.width).toBe(812);
    expect(result.current.scale(10)).toBeCloseTo(21.65, 1);
  });

  it('is stable while nothing changes', () => {
    const { result, rerender } = renderHook(() => useLayout());
    const first = result.current;
    rerender({});
    expect(result.current).toBe(first);
  });

  it('picks up a new configuration on the next render', () => {
    setWindow(750, 1624);
    const { result, rerender } = renderHook(() => useLayout());
    expect(result.current.scale(10)).toBe(20);
    configureLayout({ maxScale: 1.5 });
    rerender({});
    expect(result.current.scale(10)).toBe(15);
  });
});
