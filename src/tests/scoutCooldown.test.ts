import { describe, it, expect } from 'vitest';
import { Simulation } from '../simulation/Simulation';

describe('scoutCooldown', () => {
  it('should set and decrement scoutCooldown, preventing immediate re-scouting', () => {
    const sim = new Simulation();
    sim.initMockData();

    // Force a situation where SCOUT is the only attractive option.
    sim.resources = [];
    sim.structures = [];
    sim.animals = [];
    sim.time.state.phase = 'MORNING';
    sim.time.state.progress = 0.1;

    const survivor = sim.survivors[0];
    survivor.stats.hunger = 100;
    survivor.stats.morale = 100;
    survivor.inventory = {};
    survivor.scoutCooldown = 0;

    sim.tick();
    expect(survivor.currentTask?.type).toBe('SCOUT');
    expect(survivor.scoutCooldown).toBeGreaterThan(0);

    const cooldownAfterStart = survivor.scoutCooldown;
    sim.tick();
    expect(survivor.scoutCooldown).toBeLessThan(cooldownAfterStart);

    // Simulate scouting finishing; cooldown should block choosing SCOUT again immediately.
    survivor.currentTask = { type: 'IDLE' };
    sim.tick();
    expect(survivor.currentTask?.type).toBe('IDLE');
  });
});
