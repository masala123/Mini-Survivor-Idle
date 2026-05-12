import { describe, it, expect } from 'vitest';
import { MoraleSystem } from '../systems/MoraleSystem';
import { createSurvivor } from '../entities/Survivor';
import { SurvivorBrain } from '../ai/SurvivorBrain';
import { createAnimal } from '../entities/Animal';
import { ProgressionSystem } from '../systems/ProgressionSystem';

describe('Personality (MVP 3)', () => {
  it('should give higher social morale recovery to more sociable survivors', () => {
    const morale = new MoraleSystem();
    const highSoc = createSurvivor('s1', 0, 0, { sociability: 1, neuroticism: 0, bravery: 0.5 });
    const lowSoc = createSurvivor('s2', 0, 0, { sociability: 0, neuroticism: 0, bravery: 0.5 });

    highSoc.stats.morale = 50;
    lowSoc.stats.morale = 50;

    // Nearby -> social boost applies. No night/campfire/weather stress.
    morale.tick([highSoc, lowSoc], false, false);

    expect(highSoc.stats.morale).toBeGreaterThan(lowSoc.stats.morale);
  });

  it('should engage danger at a longer distance when bravery is higher', () => {
    const brain = new SurvivorBrain();
    const brave = createSurvivor('brave', 0, 0, { bravery: 1, sociability: 0.5, neuroticism: 0.5 });
    const coward = createSurvivor('coward', 0, 0, { bravery: 0, sociability: 0.5, neuroticism: 0.5 });

    brave.stats.hunger = 100;
    coward.stats.hunger = 100;

    const animal = createAnimal('a1', 'shadow_raptor', 'HOSTILE', 110, 0);
    const progression = new ProgressionSystem();

    brain.decideTask(
      brave,
      [],
      [],
      [animal],
      { day: 1, phase: 'MORNING', progress: 0 },
      progression,
      [brave]
    );

    brain.decideTask(
      coward,
      [],
      [],
      [animal],
      { day: 1, phase: 'MORNING', progress: 0 },
      progression,
      [coward]
    );

    expect(brave.currentTask?.type).toBe('FLEE');
    expect(coward.currentTask?.type).toBe('IDLE');
  });
});
