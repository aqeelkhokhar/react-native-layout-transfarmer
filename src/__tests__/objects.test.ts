import {
  applyObjectZoomScale,
  batchTransformObjects,
  calculateObjectTransformedValues,
  transformObject,
  transformRotation,
} from '../index';

describe('objects', () => {
  it('scales position and size per axis', () => {
    expect(calculateObjectTransformedValues(10, 20, 100, 50, 2, 3)).toEqual({
      x: 20,
      y: 60,
      width: 200,
      height: 150,
    });
  });

  it('applies a zoom scale to the size only', () => {
    expect(applyObjectZoomScale(100, 50, 2)).toEqual({
      width: 200,
      height: 100,
    });
  });

  describe('transformObject', () => {
    const base = { x: 10, y: 10, width: 100, height: 50 };

    it('ignores a missing or neutral zoom scale', () => {
      const expected = { x: 20, y: 20, width: 200, height: 100 };
      expect(transformObject(base, 2, 2)).toEqual(expected);
      expect(transformObject({ ...base, zoomScale: 1 }, 2, 2)).toEqual(
        expected
      );
    });

    it('applies zoom to size and keeps the position', () => {
      expect(transformObject({ ...base, zoomScale: 1.5 }, 2, 2)).toEqual({
        x: 20,
        y: 20,
        width: 300,
        height: 150,
      });
    });

    it('treats a zoom scale of 0 as collapsing the object', () => {
      const result = transformObject({ ...base, zoomScale: 0 }, 2, 2);
      expect(result.width).toBe(0);
      expect(result.height).toBe(0);
    });
  });

  it('returns the rotation unchanged', () => {
    expect(transformRotation(45)).toBe(45);
  });

  describe('batchTransformObjects', () => {
    const items = [
      { id: 'a', x: 0, y: 0, width: 10, height: 10, rotation: 90, label: 'x' },
      { id: 'b', x: 5, y: 5, width: 20, height: 40, zoomScale: 2 },
    ];

    it('transforms every object and keeps the other fields', () => {
      const [a, b] = batchTransformObjects(items, 2, 3);
      expect(a).toEqual({
        id: 'a',
        x: 0,
        y: 0,
        width: 20,
        height: 30,
        rotation: 90,
        label: 'x',
      });
      expect(b).toMatchObject({
        id: 'b',
        x: 10,
        y: 15,
        width: 80,
        height: 240,
      });
    });

    it('does not mutate its input', () => {
      const snapshot = JSON.parse(JSON.stringify(items));
      batchTransformObjects(items, 2, 3);
      expect(items).toEqual(snapshot);
    });

    it('returns an empty array for no objects', () => {
      expect(batchTransformObjects([], 2, 2)).toEqual([]);
    });
  });
});
