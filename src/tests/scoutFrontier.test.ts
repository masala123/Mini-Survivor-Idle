import { describe, it, expect } from 'vitest';
import { SurvivorBrain } from '../ai/SurvivorBrain';
import { createSurvivor } from '../entities/Survivor';
import { createWorld } from '../game/world';
import { ProgressionSystem } from '../systems/ProgressionSystem';

describe('scoutFrontier', () => {
  it('should pick a frontier (unknown adjacent to known) tile', () => {
    const world = createWorld(1, 6, 6, 10);
    const discovered = Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => false));

    // Mark a small known island at center.
    discovered[2][2] = true;
    discovered[2][3] = true;
    discovered[3][2] = true;
    discovered[3][3] = true;

    const survivor = createSurvivor('s1', 0, 0);
    survivor.stats.hunger = 100;
    survivor.stats.morale = 100;
    survivor.inventory = {};

    const brain = new SurvivorBrain();
    brain.decideTask(
      survivor,
      [],
      [],
      [],
      { day: 1, phase: 'MORNING', progress: 0 },
      new ProgressionSystem(),
      [survivor],
      world,
      discovered
    );

    expect(survivor.currentTask?.type).toBe('SCOUT');
    expect(typeof survivor.currentTask?.targetX).toBe('number');
    expect(typeof survivor.currentTask?.targetY).toBe('number');

    const { tx, ty } = world.worldToTile(survivor.currentTask!.targetX!, survivor.currentTask!.targetY!);
    expect(discovered[ty][tx]).toBe(false);

    const isFrontier =
      discovered[ty]?.[tx - 1] === true ||
      discovered[ty]?.[tx + 1] === true ||
      discovered[ty - 1]?.[tx] === true ||
      discovered[ty + 1]?.[tx] === true;
    expect(isFrontier).toBe(true);
  });
});

