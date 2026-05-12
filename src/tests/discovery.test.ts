import { describe, it, expect } from 'vitest';
import { Simulation } from '../simulation/Simulation';

describe('discovery', () => {
  it('should mark tiles around survivors as discovered', () => {
    const sim = new Simulation();
    sim.initMockData();

    // Before ticking, nothing discovered (resetDiscovery sets all false)
    const anyDiscoveredBefore = sim.discovered.some(row => row.some(v => v));
    expect(anyDiscoveredBefore).toBe(false);

    sim.tick();

    const anyDiscoveredAfter = sim.discovered.some(row => row.some(v => v));
    expect(anyDiscoveredAfter).toBe(true);

    // Survivor at (0,0) should discover its current tile
    const { tx, ty } = sim.world.worldToTile(0, 0);
    expect(sim.discovered[ty][tx]).toBe(true);
  });
});

