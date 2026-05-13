import { describe, expect, it } from 'vitest';
import { CAMPAIGN_STORAGE_KEY, clearCampaignState, getCampaignGoals, getCampaignRank, loadCampaignState, normalizeCampaignState, saveCampaignState } from '../systems/CampaignSystem';
import { ScenarioScoreRecord } from '../systems/ScenarioSystem';

const record: ScenarioScoreRecord = {
  scenarioId: 'FIRST_CAMP',
  scenarioName: 'First Camp Protocol',
  status: 'COMPLETE',
  total: 1000,
  rating: 'S',
  objectivesComplete: 3,
  objectivesTotal: 3,
  survivorsAlive: 2,
  elapsedTicks: 10,
};

const heatwaveRecord: ScenarioScoreRecord = {
  scenarioId: 'SURVIVE_HEATWAVE',
  scenarioName: 'Survive the Heatwave',
  status: 'COMPLETE',
  total: 950,
  rating: 'A',
  objectivesComplete: 3,
  objectivesTotal: 3,
  survivorsAlive: 2,
  elapsedTicks: 12,
};

const powerRecord: ScenarioScoreRecord = {
  scenarioId: 'POWER_RELAY',
  scenarioName: 'Power Relay',
  status: 'FAILED',
  total: 300,
  rating: 'F',
  objectivesComplete: 1,
  objectivesTotal: 3,
  survivorsAlive: 1,
  elapsedTicks: 18,
};

const completedPowerRecord: ScenarioScoreRecord = {
  ...powerRecord,
  status: 'COMPLETE',
  total: 900,
  rating: 'A',
  objectivesComplete: 4,
  objectivesTotal: 4,
};

const tamingRecord: ScenarioScoreRecord = {
  scenarioId: 'TAMING_TRIAL',
  scenarioName: 'Taming Trial',
  status: 'COMPLETE',
  total: 850,
  rating: 'A',
  objectivesComplete: 3,
  objectivesTotal: 3,
  survivorsAlive: 2,
  elapsedTicks: 16,
};

class MemoryStorage {
  public values = new Map<string, string>();

  public getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  public setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  public removeItem(key: string): void {
    this.values.delete(key);
  }
}

describe('Campaign System', () => {
  it('normalizes campaign state and removes duplicate recipe unlocks', () => {
    const state = normalizeCampaignState({
      unlockedRecipeIds: ['craft_axe', 'craft_axe', 42, 'craft_bone_club'],
      history: [record],
    });

    expect(state.unlockedRecipeIds).toEqual(['craft_axe', 'craft_bone_club']);
    expect(state.history).toEqual([record]);
  });

  it('loads empty state from missing or corrupted storage', () => {
    const storage = new MemoryStorage();

    expect(loadCampaignState(storage)).toEqual({ unlockedRecipeIds: [], history: [] });

    storage.setItem(CAMPAIGN_STORAGE_KEY, '{bad json');
    expect(loadCampaignState(storage)).toEqual({ unlockedRecipeIds: [], history: [] });
  });

  it('saves and loads normalized campaign state', () => {
    const storage = new MemoryStorage();

    saveCampaignState(storage, {
      unlockedRecipeIds: ['craft_crystal_spear', 'craft_axe'],
      history: [record],
    });

    expect(loadCampaignState(storage)).toEqual({
      unlockedRecipeIds: ['craft_axe', 'craft_crystal_spear'],
      history: [record],
    });
  });

  it('clears persisted campaign state', () => {
    const storage = new MemoryStorage();
    saveCampaignState(storage, {
      unlockedRecipeIds: ['craft_axe'],
      history: [record],
    });

    clearCampaignState(storage);

    expect(storage.getItem(CAMPAIGN_STORAGE_KEY)).toBeNull();
    expect(loadCampaignState(storage)).toEqual({ unlockedRecipeIds: [], history: [] });
  });

  it('reports campaign goals from history and unlocked recipes', () => {
    const goals = getCampaignGoals({
      unlockedRecipeIds: ['craft_axe', 'craft_crystal_spear', 'craft_bone_club'],
      history: [record, heatwaveRecord, powerRecord],
    });

    expect(goals).toContainEqual({
      id: 'first_success',
      label: 'Complete any scenario',
      current: 1,
      target: 1,
      completed: true,
    });
    expect(goals).toContainEqual({
      id: 'recipe_cache',
      label: 'Unlock all scenario recipes',
      current: 3,
      target: 3,
      completed: true,
    });
    expect(goals.find(goal => goal.id === 'scenario_sweep')).toMatchObject({
      current: 2,
      completed: false,
    });
    expect(goals.find(goal => goal.id === 'elite_runs')).toMatchObject({
      current: 2,
      completed: true,
    });
  });

  it('caps campaign goal progress at the target value', () => {
    const goals = getCampaignGoals({
      unlockedRecipeIds: ['craft_axe'],
      history: [record, heatwaveRecord, record, heatwaveRecord],
    });

    expect(goals.find(goal => goal.id === 'first_success')).toMatchObject({
      current: 1,
      target: 1,
      completed: true,
    });
    expect(goals.find(goal => goal.id === 'campaign_score')).toMatchObject({
      current: 3000,
      target: 3000,
      completed: true,
    });
  });

  it('summarizes campaign rank from completed goals and score history', () => {
    const rank = getCampaignRank({
      unlockedRecipeIds: ['craft_axe', 'craft_crystal_spear', 'craft_bone_club'],
      history: [record, heatwaveRecord, completedPowerRecord, tamingRecord],
    });

    expect(rank).toEqual({
      title: 'Expedition Master',
      completedGoals: 5,
      totalGoals: 5,
      totalScore: 3700,
      bestRating: 'S',
    });
  });

  it('reports a stranded rank for empty campaigns', () => {
    expect(getCampaignRank({ unlockedRecipeIds: [], history: [] })).toEqual({
      title: 'Stranded',
      completedGoals: 0,
      totalGoals: 5,
      totalScore: 0,
      bestRating: null,
    });
  });
});
