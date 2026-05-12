import { describe, it, expect } from 'vitest';
import { createWorld } from '../game/world';
import { spawnPois } from '../game/poi';
import { Simulation } from '../simulation/Simulation';

describe('poi', () => {
  it('should spawn deterministic POIs for a given seed', () => {
    const world = createWorld(1337, 40, 30, 20);
    const a = spawnPois(world, 5);
    const b = spawnPois(world, 5);
    expect(a).toEqual(b);
  });

  it('should discover POI when a survivor reveals its tile', () => {
    const sim = new Simulation();
    sim.initMockData();

    // Force a POI onto the survivor_1 tile (0,0)
    const { tx, ty } = sim.world.worldToTile(0, 0);
    sim.pois = [{ id: 'poi_test', type: 'RUIN', tx, ty }];
    sim.discoveredPoiIds = new Set();

    sim.tick();
    expect(sim.discoveredPoiIds.has('poi_test')).toBe(true);
  });

  it('should grant POI rewards once on discovery', () => {
    const sim = new Simulation();
    sim.initMockData();
    const survivor = sim.survivors[0];
    // Remove the second survivor to avoid social morale recovery affecting this test.
    sim.survivors = [survivor];
    survivor.inventory = {};
    survivor.stats.morale = 50;

    const { tx, ty } = sim.world.worldToTile(survivor.x, survivor.y);
    sim.pois = [{ id: 'poi_reward', type: 'BONFIRE_SITE', tx, ty }];
    sim.discoveredPoiIds = new Set();

    sim.tick();
    expect(sim.discoveredPoiIds.has('poi_reward')).toBe(true);
    const hasTorch = (survivor.inventory['torch'] || 0) > 0 || survivor.equippedTool?.id === 'torch';
    expect(hasTorch).toBe(true);
    expect(survivor.inventory['wood']).toBe(1);
    expect(survivor.stats.morale).toBeCloseTo(54.95, 5);

    // Tick again: reward should not repeat
    sim.tick();
    const hasTorch2 = (survivor.inventory['torch'] || 0) > 0 || survivor.equippedTool?.id === 'torch';
    expect(hasTorch2).toBe(true);
    expect(survivor.inventory['wood']).toBe(1);
  });

  it('should spawn a POI structure on discovery (BONFIRE_SITE -> campfire)', () => {
    const sim = new Simulation();
    sim.initMockData();
    const survivor = sim.survivors[0];
    sim.survivors = [survivor];

    const { tx, ty } = sim.world.worldToTile(survivor.x, survivor.y);
    sim.pois = [{ id: 'poi_struct', type: 'BONFIRE_SITE', tx, ty }];
    sim.discoveredPoiIds = new Set();

    const initialStructures = sim.structures.length;
    sim.tick();

    expect(sim.structures.length).toBe(initialStructures + 1);
    expect(sim.structures[sim.structures.length - 1].type).toBe('campfire');
    expect(sim.structures[sim.structures.length - 1].isComplete).toBe(true);

    // Tick again: should not spawn another structure for the same POI
    sim.tick();
    expect(sim.structures.length).toBe(initialStructures + 1);
  });
});
