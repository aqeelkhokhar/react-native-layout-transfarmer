import { act, renderHook } from '@testing-library/react-native';
import {
  centerRect,
  createViewportTransform,
  fillRect,
  fitRect,
  transformObject,
  transformPoint,
  transformPoints,
  batchTransformObjects,
  useCanvasTransform,
} from '../index';
import { resetLayout, setWindow } from '../__fixtures__/helpers';

describe('rect helpers', () => {
  it('centers a size', () => {
    expect(
      centerRect({ width: 50, height: 50 }, { width: 100, height: 200 })
    ).toEqual({
      x: 25,
      y: 75,
      width: 50,
      height: 50,
    });
  });

  it('fits (contain) a source inside a container', () => {
    expect(
      fitRect({ width: 100, height: 200 }, { width: 300, height: 300 })
    ).toEqual({
      x: 75,
      y: 0,
      width: 150,
      height: 300,
    });
  });

  it('fills (cover) a container with a source', () => {
    expect(
      fillRect({ width: 100, height: 200 }, { width: 300, height: 300 })
    ).toEqual({
      x: 0,
      y: -150,
      width: 300,
      height: 600,
    });
  });

  it('rejects an empty source', () => {
    expect(() =>
      fitRect({ width: 0, height: 1 }, { width: 1, height: 1 })
    ).toThrow(RangeError);
    expect(() =>
      fillRect({ width: 1, height: 0 }, { width: 1, height: 1 })
    ).toThrow(RangeError);
  });
});

describe('points and anchors', () => {
  it('scales points', () => {
    expect(transformPoint({ x: 2, y: 3 }, 2, 3)).toEqual({ x: 4, y: 9 });
    expect(transformPoints([{ x: 1, y: 1 }], 2, 2)).toEqual([{ x: 2, y: 2 }]);
  });

  it('zooms around the center with anchor center', () => {
    const o = { x: 10, y: 10, width: 100, height: 100, zoomScale: 2 };
    expect(transformObject(o, 1, 1)).toEqual({
      x: 10,
      y: 10,
      width: 200,
      height: 200,
    });
    expect(transformObject(o, 1, 1, { anchor: 'center' })).toEqual({
      x: -40,
      y: -40,
      width: 200,
      height: 200,
    });
  });

  it('forwards the anchor option in a batch', () => {
    const [a] = batchTransformObjects(
      [{ x: 0, y: 0, width: 10, height: 10, zoomScale: 2 }],
      1,
      1,
      { anchor: 'center' }
    );
    expect(a).toMatchObject({ x: -5, y: -5, width: 20, height: 20 });
  });
});

describe('createViewportTransform', () => {
  const source = { width: 1080, height: 1920 };

  it('stretches each axis by default', () => {
    const t = createViewportTransform(source, { width: 540, height: 480 });
    expect(t.scaleX).toBe(0.5);
    expect(t.scaleY).toBe(0.25);
    expect(t.offsetX).toBe(0);
    expect(t.point({ x: 100, y: 100 })).toEqual({ x: 50, y: 25 });
    expect(t.size({ width: 200, height: 400 })).toEqual({
      width: 100,
      height: 100,
    });
  });

  it('keeps the aspect ratio and letterboxes with contain', () => {
    const t = createViewportTransform(
      source,
      { width: 540, height: 960 * 2 },
      { fit: 'contain' }
    );
    expect(t.scaleX).toBe(0.5);
    expect(t.scaleY).toBe(0.5);
    expect(t.offsetX).toBe(0);
    expect(t.offsetY).toBe(480);
    expect(t.rect({ x: 0, y: 0, width: 1080, height: 1920 })).toEqual({
      x: 0,
      y: 480,
      width: 540,
      height: 960,
    });
  });

  it('crops with cover', () => {
    const t = createViewportTransform(
      source,
      { width: 540, height: 540 },
      { fit: 'cover' }
    );
    expect(t.scaleX).toBe(0.5);
    expect(t.offsetY).toBe(-210);
  });

  it('transforms objects and keeps their other fields', () => {
    const t = createViewportTransform(
      source,
      { width: 540, height: 960 },
      { fit: 'contain' }
    );
    const out = t.object({
      id: 's1',
      x: 100,
      y: 200,
      width: 200,
      height: 200,
      rotation: 30,
    });
    expect(out).toEqual({
      id: 's1',
      x: 50,
      y: 100,
      width: 100,
      height: 100,
      rotation: 30,
    });
    expect(t.objects([{ x: 0, y: 0, width: 2, height: 2 }])).toEqual([
      { x: 0, y: 0, width: 1, height: 1 },
    ]);
  });

  it('applies zoom with the anchor option and the offset', () => {
    const t = createViewportTransform(
      { width: 100, height: 100 },
      { width: 200, height: 300 },
      { fit: 'contain', anchor: 'center' }
    );
    const out = t.object({ x: 0, y: 0, width: 10, height: 10, zoomScale: 2 });
    // scale 2, offsetY 50, zoomed 40, center (10, 60) -> x -10, y 40
    expect(out).toEqual({ x: -10, y: 40, width: 40, height: 40, zoomScale: 2 });
  });

  it('round trips through the inverse', () => {
    const t = createViewportTransform(
      source,
      { width: 411, height: 731 },
      { fit: 'contain' }
    );
    const original = { id: 'a', x: 123, y: 456, width: 78, height: 90 };
    const back = t.inverse.object(t.object(original));
    expect(back.x).toBeCloseTo(original.x);
    expect(back.y).toBeCloseTo(original.y);
    expect(back.width).toBeCloseTo(original.width);
    expect(back.height).toBeCloseTo(original.height);
    expect(back.id).toBe('a');
    const p = t.inverse.point(t.point({ x: 10, y: 20 }));
    expect(p.x).toBeCloseTo(10);
    expect(p.y).toBeCloseTo(20);
    const s = t.inverse.size(t.size({ width: 5, height: 6 }));
    expect(s.width).toBeCloseTo(5);
    expect(t.inverse.rect(t.rect(original)).x).toBeCloseTo(original.x);
  });

  it('rejects an empty viewport', () => {
    expect(() =>
      createViewportTransform(
        { width: 0, height: 10 },
        { width: 10, height: 10 }
      )
    ).toThrow(RangeError);
  });
});

describe('useCanvasTransform', () => {
  beforeEach(resetLayout);
  const source = { width: 100, height: 100 };

  it('defaults the destination to the window and follows changes', () => {
    setWindow(200, 200);
    const { result } = renderHook(() => useCanvasTransform(source));
    expect(result.current.scaleX).toBe(2);
    act(() => setWindow(400, 300));
    expect(result.current.scaleX).toBe(4);
    expect(result.current.scaleY).toBe(3);
  });

  it('uses an explicit destination and options and is memoized', () => {
    const { result, rerender } = renderHook(() =>
      useCanvasTransform(
        source,
        { width: 300, height: 100 },
        { fit: 'contain' }
      )
    );
    expect(result.current.scaleX).toBe(1);
    expect(result.current.offsetX).toBe(100);
    const first = result.current;
    rerender({});
    expect(result.current).toBe(first);
  });
});

describe('size parity', () => {
  const board = { width: 375, height: 600 };
  const emoji = [
    { x: 155, y: 268, width: 64, height: 64 },
    { x: 20, y: 20, width: 48, height: 48 },
    { x: 307, y: 532, width: 48, height: 48 },
    { x: 240, y: 420, width: 80, height: 80, zoomScale: 1.25 },
  ];
  const boxes = [
    { width: 290, height: 464 },
    { width: 688, height: 1100 },
    { width: 749, height: 1198 },
    { width: 388, height: 620 },
  ];

  it('puts every object at the same percentage of the board on any screen', () => {
    const normalized = boxes.map((box) => {
      const t = createViewportTransform(board, box, {
        fit: 'contain',
        anchor: 'center',
      });
      const w = board.width * t.scaleX;
      const h = board.height * t.scaleY;
      return t
        .objects(emoji)
        .map((e) => [
          +(((e.x - t.offsetX + e.width / 2) / w) * 100).toFixed(6),
          +(((e.y - t.offsetY + e.height / 2) / h) * 100).toFixed(6),
          +((e.width / w) * 100).toFixed(6),
        ]);
    });
    for (const result of normalized.slice(1)) {
      expect(result).toEqual(normalized[0]);
    }
    // the target emoji centre is the middle of the board, as seen on device
    expect(normalized[0]![0]![0]).toBeCloseTo(49.867, 2);
    expect(normalized[0]![0]![1]).toBeCloseTo(50, 2);
  });
});
