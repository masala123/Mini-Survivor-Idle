import { describe, it, expect } from 'vitest';
import { snapToGrid } from '../game/coords';

describe('coords', () => {
  it('snapToGrid should round to nearest grid multiple', () => {
    expect(snapToGrid(0, 10)).toBe(0);
    expect(snapToGrid(4, 10)).toBe(0);
    expect(snapToGrid(5, 10)).toBe(10);
    expect(snapToGrid(14, 10)).toBe(10);
    expect(snapToGrid(15, 10)).toBe(20);
    expect(snapToGrid(-4, 10)).toBe(0);
    expect(snapToGrid(-6, 10)).toBe(-10);
  });
});

