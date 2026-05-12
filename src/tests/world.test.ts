import { describe, it, expect } from 'vitest';
import { createWorld } from '../game/world';

describe('world', () => {
  it('should be deterministic for a given seed', () => {
    const w1 = createWorld(123, 10, 10, 20);
    const w2 = createWorld(123, 10, 10, 20);

    expect(w1.biomeAtTile(0, 0)).toBe(w2.biomeAtTile(0, 0));
    expect(w1.biomeAtTile(5, 7)).toBe(w2.biomeAtTile(5, 7));
    expect(w1.biomeAtWorld(0, 0)).toBe(w2.biomeAtWorld(0, 0));
  });
});

