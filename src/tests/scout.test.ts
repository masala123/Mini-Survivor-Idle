import { describe, it, expect } from 'vitest';
import { Simulation } from '../simulation/Simulation';

describe('scout', () => {
  it('should move survivors when scouting (no urgent needs)', () => {
    const sim = new Simulation();
    sim.initMockData();

    // Remove resources to avoid gather tasks.
    sim.resources = [];
    sim.animals = [];
    sim.structures = [];
    sim.time.state.phase = 'MORNING';
    sim.time.state.progress = 0.1;

    for (const s of sim.survivors) {
      s.stats.hunger = 100;
      s.stats.morale = 100;
      s.inventory = {};
      s.currentTask = null;
    }

    const before = { x: sim.survivors[0].x, y: sim.survivors[0].y };
    sim.tick();
    sim.tick();

    const after = { x: sim.survivors[0].x, y: sim.survivors[0].y };
    expect(after.x !== before.x || after.y !== before.y).toBe(true);
  });
});

