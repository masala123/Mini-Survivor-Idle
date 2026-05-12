import { describe, it, expect } from 'vitest';
import { FarmingSystem } from '../systems/FarmingSystem';
import { createStructure } from '../entities/Structure';
import { SurvivorBrain } from '../ai/SurvivorBrain';
import { createSurvivor } from '../entities/Survivor';
import { ProgressionSystem } from '../systems/ProgressionSystem';
import { WeatherState } from '../systems/WeatherSystem';

describe('Farming (MVP 3)', () => {
  it('should grow vegetables over time (weather-modified)', () => {
    const farming = new FarmingSystem();
    const plot = createStructure('farm_1', 'farm_plot', 0, 0, true);
    const structures = [plot];

    const clear: WeatherState = { type: 'CLEAR', intensity: 0, duration: 9999 };
    for (let i = 0; i < 99; i++) farming.tick(structures, clear);
    expect(plot.inventory?.['vegetable'] || 0).toBe(0);

    farming.tick(structures, clear);
    expect(plot.inventory?.['vegetable'] || 0).toBe(1);

    const rain: WeatherState = { type: 'RAIN', intensity: 1, duration: 9999 };
    for (let i = 0; i < 58; i++) farming.tick(structures, rain);
    expect(plot.inventory?.['vegetable'] || 0).toBe(2);
  });

  it('should let a hungry survivor harvest farm food', () => {
    const brain = new SurvivorBrain();
    const survivor = createSurvivor('s1', 0, 0);
    survivor.stats.hunger = 10;

    const plot = createStructure('farm_1', 'farm_plot', 0, 0, true);
    plot.inventory!['vegetable'] = 1;
    const structures = [plot];

    brain.decideTask(
      survivor,
      [],
      structures,
      [],
      { day: 1, phase: 'MORNING', progress: 0 },
      new ProgressionSystem(),
      [survivor]
    );

    expect(survivor.currentTask?.type).toBe('HARVEST_FARM');
    
    // Teleport to plot
    survivor.x = plot.x;
    survivor.y = plot.y;

    brain.executeTask(survivor, [], structures, []);
    expect(survivor.inventory['vegetable']).toBe(1);
    expect(plot.inventory?.['vegetable'] || 0).toBe(0);
  });
});
