import { describe, it, expect } from 'vitest';
import { createWorld } from '../game/world';
import { spawnInitialResources } from '../game/spawn';

describe('spawn', () => {
  it('should spawn deterministic resources for a given seed', () => {
    const world = createWorld(1337, 40, 30, 20);
    const a = spawnInitialResources(world, 4);
    const b = spawnInitialResources(world, 4);

    expect(a.map(r => `${r.type}:${r.x},${r.y}:${r.amount}:${r.regrowRate}`)).toEqual(
      b.map(r => `${r.type}:${r.x},${r.y}:${r.amount}:${r.regrowRate}`)
    );
  });
});

