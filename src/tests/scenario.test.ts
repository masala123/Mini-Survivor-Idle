import { describe, it, expect } from 'vitest';
import { Simulation } from '../simulation/Simulation';
import { createStructure } from '../entities/Structure';
import { createScenarioScoreRecord, isScenarioOptionUnlocked, scenarioOptions } from '../systems/ScenarioSystem';

describe('Scenario System', () => {
  it('gates chained scenario options by campaign recipe unlocks', () => {
    const camp = scenarioOptions.find(option => option.id === 'FIRST_CAMP')!;
    const heatwave = scenarioOptions.find(option => option.id === 'SURVIVE_HEATWAVE')!;
    const power = scenarioOptions.find(option => option.id === 'POWER_RELAY')!;
    const tame = scenarioOptions.find(option => option.id === 'TAMING_TRIAL')!;

    expect(isScenarioOptionUnlocked(camp, [])).toBe(true);
    expect(isScenarioOptionUnlocked(heatwave, [])).toBe(false);
    expect(isScenarioOptionUnlocked(heatwave, ['craft_axe'])).toBe(true);
    expect(isScenarioOptionUnlocked(power, ['craft_axe'])).toBe(false);
    expect(isScenarioOptionUnlocked(power, ['craft_crystal_spear'])).toBe(true);
    expect(isScenarioOptionUnlocked(tame, ['craft_crystal_spear'])).toBe(false);
    expect(isScenarioOptionUnlocked(tame, ['craft_bone_club'])).toBe(true);
  });

  it('seeds first camp materials when initializing a new run', () => {
    const sim = new Simulation();
    sim.initMockData('FIRST_CAMP');

    expect(sim.scenario.state.id).toBe('FIRST_CAMP');
    expect(sim.survivors[0].inventory['wood']).toBe(3);
  });

  it('tracks first camp objectives without ending the main simulation', () => {
    const sim = new Simulation();
    sim.initMockData();
    const survivor = sim.survivors[0];
    survivor.stats.morale = 50;

    sim.structures.push(createStructure('camp_1', 'campfire', 0, 0, true));
    sim.time.state.day = 2;

    sim.tick();

    expect(sim.scenario.state.id).toBe('FIRST_CAMP');
    expect(sim.scenario.state.status).toBe('COMPLETE');
    expect(sim.scenario.state.outcomeMessage).toContain('camp supplies');
    expect(sim.scenario.state.score?.rating).not.toBe('F');
    expect(sim.scenario.state.score).toMatchObject({
      completionBonus: 300,
      objectivePoints: 500,
      survivorPoints: 200,
    });
    expect(sim.scenario.state.score?.total).toBe(
      sim.scenario.state.score!.completionBonus +
      sim.scenario.state.score!.objectivePoints +
      sim.scenario.state.score!.survivorPoints +
      sim.scenario.state.score!.speedBonus
    );
    expect(sim.scenario.state.score?.objectivesComplete).toBe(3);
    expect(sim.scenario.state.score?.unlockedRecipes).toContain('craft_axe');
    expect(sim.progression.isRecipeUnlocked('craft_axe')).toBe(true);
    const record = createScenarioScoreRecord(sim.scenario.state);
    expect(record?.scenarioId).toBe('FIRST_CAMP');
    expect(record?.total).toBe(sim.scenario.state.score?.total);
    expect(record?.status).toBe('COMPLETE');
    expect(survivor.inventory['berry']).toBe(2);
    expect(survivor.stats.morale).toBeGreaterThan(50);
    expect(sim.isVictory).toBe(false);
  });

  it('can start a heatwave scenario from player commands', () => {
    const sim = new Simulation();
    sim.initMockData();

    sim.interaction.pushCommand({ type: 'START_SCENARIO', scenarioId: 'SURVIVE_HEATWAVE' });
    sim.tick();

    expect(sim.scenario.state.id).toBe('SURVIVE_HEATWAVE');
    expect(sim.scenario.state.status).toBe('ACTIVE');
    expect(sim.weather.state.type).toBe('CLEAR');
    expect(sim.time.state.day).toBe(2);
    expect(sim.structures.some(structure => structure.type === 'campfire' && structure.isComplete)).toBe(true);
  });

  it('seeds power relay materials for new scenario runs', () => {
    const sim = new Simulation();
    sim.initMockData('POWER_RELAY', ['craft_axe', 'craft_crystal_spear']);
    const survivor = sim.survivors[0];

    expect(sim.scenario.state.id).toBe('POWER_RELAY');
    expect(sim.progression.isRecipeUnlocked('craft_axe')).toBe(true);
    expect(sim.progression.isRecipeUnlocked('craft_crystal_spear')).toBe(true);
    expect(survivor.inventory['ancient_tech']).toBe(2);
    expect(survivor.inventory['refined_fossil']).toBe(3);
    expect(survivor.inventory['stone']).toBe(4);
    expect(sim.weather.state.type).toBe('CLEAR');
  });

  it('seeds taming trial food and a neutral dinosaur', () => {
    const sim = new Simulation();
    sim.initMockData('TAMING_TRIAL', ['craft_bone_club']);
    const survivor = sim.survivors[0];

    expect(sim.scenario.state.id).toBe('TAMING_TRIAL');
    expect(sim.time.state.phase).toBe('AFTERNOON');
    expect(survivor.inventory['vegetable']).toBe(1);
    expect(survivor.inventory['fern']).toBe(1);
    expect(sim.animals).toContainEqual(expect.objectContaining({
      id: 'scenario_triceratops',
      faction: 'NEUTRAL',
      type: 'Triceratops',
    }));
  });

  it('can restart an existing simulation into a scenario setup', () => {
    const sim = new Simulation();
    sim.initMockData();
    sim.survivors[0].inventory['ancient_tech'] = 0;

    sim.startScenario('POWER_RELAY');

    expect(sim.scenario.state.id).toBe('POWER_RELAY');
    expect(sim.survivors[0].inventory['ancient_tech']).toBe(2);
  });

  it('applies daytime heatwave damage to unsheltered survivors', () => {
    const sim = new Simulation();
    sim.initMockData();
    const survivor = sim.survivors[0];
    const initialHealth = survivor.stats.health;

    sim.scenario.start('SURVIVE_HEATWAVE');
    sim.time.state.phase = 'AFTERNOON';
    sim.tickCount = 19;
    sim.tick();

    expect(survivor.stats.health).toBeLessThan(initialHealth);
    expect(sim.weather.state.type).toBe('CLEAR');
  });

  it('grants heatwave rewards once when completed', () => {
    const sim = new Simulation();
    sim.initMockData();
    const survivor = sim.survivors[0];

    sim.scenario.start('SURVIVE_HEATWAVE');
    sim.time.state.day = 3;

    sim.tick();
    sim.tick();

    expect(sim.scenario.state.status).toBe('COMPLETE');
    expect(sim.scenario.state.outcomeMessage).toContain('ancient tech');
    expect(sim.scenario.state.score?.unlockedRecipes).toContain('craft_crystal_spear');
    expect(sim.progression.isRecipeUnlocked('craft_crystal_spear')).toBe(true);
    expect(survivor.inventory['ancient_tech']).toBe(1);
    expect(survivor.inventory['refined_fossil']).toBe(2);
  });

  it('tracks and rewards the power relay scenario', () => {
    const sim = new Simulation();
    sim.initMockData();
    const survivor = sim.survivors[0];

    sim.scenario.start('POWER_RELAY');
    sim.structures.push(createStructure('solar_1', 'solar_panel', 0, 0, true));
    sim.structures.push(createStructure('battery_1', 'battery_bank', 20, 0, true));
    sim.weather.state.type = 'CLEAR';
    sim.time.state.phase = 'MORNING';
    sim.power.state.batteryLevel = 100;

    sim.tick();
    sim.tick();

    expect(sim.scenario.state.status).toBe('COMPLETE');
    expect(sim.scenario.state.outcomeMessage).toContain('relay stabilized');
    expect(sim.scenario.state.score?.objectivesComplete).toBe(4);
    expect(sim.scenario.state.score?.survivorsAlive).toBe(2);
    expect(sim.scenario.state.score?.unlockedRecipes).toContain('craft_bone_club');
    expect(sim.progression.isRecipeUnlocked('craft_bone_club')).toBe(true);
    expect(survivor.inventory['ancient_tech']).toBe(2);
    expect(survivor.inventory['refined_fossil']).toBe(1);
  });

  it('tracks and rewards the taming trial scenario', () => {
    const sim = new Simulation();
    sim.initMockData('TAMING_TRIAL', ['craft_bone_club']);
    const survivor = sim.survivors[0];
    const animal = sim.animals.find(a => a.id === 'scenario_triceratops')!;
    survivor.stats.morale = 50;

    sim.interaction.pushCommand({ type: 'TAME_ANIMAL', survivorId: survivor.id, targetId: animal.id });
    sim.tick();
    sim.interaction.pushCommand({ type: 'MOUNT_ANIMAL', survivorId: survivor.id, targetId: animal.id });
    sim.tick();

    expect(sim.scenario.state.status).toBe('COMPLETE');
    expect(sim.scenario.state.outcomeMessage).toContain('herd bond');
    expect(sim.scenario.state.score?.objectivesComplete).toBe(3);
    expect(sim.scenario.state.score?.survivorsAlive).toBe(2);
    expect(sim.scenario.state.score?.unlockedRecipes).toEqual([]);
    expect(animal.faction).toBe('TAMED');
    expect(survivor.mountedAnimalId).toBe(animal.id);
    expect(survivor.inventory['vegetable']).toBe(1);
    expect(survivor.stats.morale).toBeGreaterThan(50);
  });

  it('fails active scenarios when their deadline expires', () => {
    const sim = new Simulation();
    sim.initMockData('TAMING_TRIAL', ['craft_bone_club']);
    const survivor = sim.survivors[0];
    survivor.stats.morale = 50;
    sim.scenario.state.elapsedTicks = sim.scenario.state.deadlineTicks! - 1;

    sim.tick();

    expect(sim.scenario.state.status).toBe('FAILED');
    expect(sim.scenario.state.score?.rating).toBe('C');
    expect(sim.scenario.state.score?.completionBonus).toBe(0);
    expect(sim.scenario.state.score?.objectivePoints).toBe(167);
    expect(sim.scenario.state.score?.survivorPoints).toBe(200);
    expect(sim.scenario.state.score?.speedBonus).toBe(96);
    expect(sim.scenario.state.score?.objectivesComplete).toBe(1);
    expect(sim.scenario.state.outcomeMessage).toContain('morale dropped');
    expect(survivor.stats.morale).toBeLessThan(50);
  });

  it('allows completion on the final deadline tick', () => {
    const sim = new Simulation();
    sim.initMockData('POWER_RELAY', ['craft_axe', 'craft_crystal_spear']);
    sim.structures.push(createStructure('solar_deadline', 'solar_panel', 0, 0, true));
    sim.structures.push(createStructure('battery_deadline', 'battery_bank', 20, 0, true));
    sim.power.state.batteryLevel = 100;
    sim.scenario.state.elapsedTicks = sim.scenario.state.deadlineTicks! - 1;

    sim.tick();

    expect(sim.scenario.state.status).toBe('COMPLETE');
    expect(sim.scenario.state.score?.rating).not.toBe('F');
  });

  it('applies a morale penalty when a scenario fails', () => {
    const sim = new Simulation();
    sim.initMockData();
    const survivor = sim.survivors[0];
    survivor.stats.health = 0;
    survivor.stats.morale = 50;

    sim.tick();

    expect(sim.scenario.state.status).toBe('FAILED');
    expect(sim.scenario.state.outcomeMessage).toContain('morale dropped');
    expect(sim.scenario.state.score?.rating).toBe('F');
    expect(sim.scenario.state.score?.survivorsAlive).toBe(1);
    expect(sim.scenario.state.score?.unlockedRecipes).toEqual([]);
    expect(createScenarioScoreRecord(sim.scenario.state)?.status).toBe('FAILED');
    expect(survivor.stats.morale).toBeLessThanOrEqual(40.1);
    expect(survivor.stats.morale).toBeGreaterThanOrEqual(39.9);
  });

  it('does not create score history records for active scenarios', () => {
    const sim = new Simulation();
    sim.initMockData();

    expect(createScenarioScoreRecord(sim.scenario.state)).toBeNull();
  });
});
