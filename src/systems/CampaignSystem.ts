import { ScenarioId, ScenarioScoreRecord, scenarioOptions } from './ScenarioSystem';

export const CAMPAIGN_STORAGE_KEY = 'mini-survivor-idle:campaign:v1';

export interface CampaignState {
  unlockedRecipeIds: string[];
  history: ScenarioScoreRecord[];
}

export interface CampaignGoal {
  id: string;
  label: string;
  current: number;
  target: number;
  completed: boolean;
}

export interface CampaignRank {
  title: string;
  completedGoals: number;
  totalGoals: number;
  totalScore: number;
  bestRating: ScenarioScoreRecord['rating'] | null;
}

interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem?(key: string): void;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isScenarioId = (value: unknown): value is ScenarioId =>
  typeof value === 'string' && scenarioOptions.some(option => option.id === value);

const isScenarioStatus = (value: unknown): value is ScenarioScoreRecord['status'] =>
  value === 'COMPLETE' || value === 'FAILED';

const isRating = (value: unknown): value is ScenarioScoreRecord['rating'] =>
  value === 'S' || value === 'A' || value === 'B' || value === 'C' || value === 'F';

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const parseScoreRecord = (value: unknown): ScenarioScoreRecord | null => {
  if (!isRecord(value)) return null;
  if (!isScenarioId(value.scenarioId)) return null;
  if (typeof value.scenarioName !== 'string') return null;
  if (!isScenarioStatus(value.status)) return null;
  if (!isNumber(value.total)) return null;
  if (!isRating(value.rating)) return null;
  if (!isNumber(value.objectivesComplete)) return null;
  if (!isNumber(value.objectivesTotal)) return null;
  if (!isNumber(value.survivorsAlive)) return null;
  if (!isNumber(value.elapsedTicks)) return null;

  return {
    scenarioId: value.scenarioId,
    scenarioName: value.scenarioName,
    status: value.status,
    total: value.total,
    rating: value.rating,
    objectivesComplete: value.objectivesComplete,
    objectivesTotal: value.objectivesTotal,
    survivorsAlive: value.survivorsAlive,
    elapsedTicks: value.elapsedTicks,
  };
};

export const normalizeCampaignState = (value: unknown): CampaignState => {
  if (!isRecord(value)) return { unlockedRecipeIds: [], history: [] };

  const unlockedRecipeIds = Array.isArray(value.unlockedRecipeIds)
    ? [...new Set(value.unlockedRecipeIds.filter((id): id is string => typeof id === 'string'))].sort()
    : [];

  const history = Array.isArray(value.history)
    ? value.history
        .map(parseScoreRecord)
        .filter((record): record is ScenarioScoreRecord => record !== null)
        .slice(-5)
    : [];

  return { unlockedRecipeIds, history };
};

export const loadCampaignState = (storage: KeyValueStorage | undefined): CampaignState => {
  if (!storage) return { unlockedRecipeIds: [], history: [] };

  try {
    const raw = storage.getItem(CAMPAIGN_STORAGE_KEY);
    if (!raw) return { unlockedRecipeIds: [], history: [] };
    return normalizeCampaignState(JSON.parse(raw));
  } catch {
    return { unlockedRecipeIds: [], history: [] };
  }
};

export const saveCampaignState = (storage: KeyValueStorage | undefined, state: CampaignState): void => {
  if (!storage) return;

  storage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(normalizeCampaignState(state)));
};

export const clearCampaignState = (storage: KeyValueStorage | undefined): void => {
  if (!storage) return;

  if (storage.removeItem) {
    storage.removeItem(CAMPAIGN_STORAGE_KEY);
    return;
  }

  saveCampaignState(storage, { unlockedRecipeIds: [], history: [] });
};

const createGoal = (id: string, label: string, current: number, target: number): CampaignGoal => ({
  id,
  label,
  current: Math.min(current, target),
  target,
  completed: current >= target,
});

export const getCampaignGoals = (state: CampaignState): CampaignGoal[] => {
  const normalized = normalizeCampaignState(state);
  const completedRuns = normalized.history.filter(record => record.status === 'COMPLETE');
  const uniqueCompletedScenarios = new Set(completedRuns.map(record => record.scenarioId));
  const bestRatingRuns = normalized.history.filter(record => record.rating === 'S' || record.rating === 'A');
  const totalScore = normalized.history.reduce((sum, record) => sum + record.total, 0);

  return [
    createGoal('first_success', 'Complete any scenario', completedRuns.length, 1),
    createGoal('scenario_sweep', 'Complete all scenarios', uniqueCompletedScenarios.size, scenarioOptions.length),
    createGoal('recipe_cache', 'Unlock all scenario recipes', normalized.unlockedRecipeIds.length, 3),
    createGoal('elite_runs', 'Earn 2 A-rank runs', bestRatingRuns.length, 2),
    createGoal('campaign_score', 'Bank 3000 score', totalScore, 3000),
  ];
};

const ratingValue: Record<ScenarioScoreRecord['rating'], number> = {
  S: 5,
  A: 4,
  B: 3,
  C: 2,
  F: 1,
};

const rankTitleForGoals = (completedGoals: number): string => {
  if (completedGoals >= 5) return 'Expedition Master';
  if (completedGoals >= 4) return 'Colony Vanguard';
  if (completedGoals >= 2) return 'Trail Proven';
  if (completedGoals >= 1) return 'Camp Initiate';
  return 'Stranded';
};

export const getCampaignRank = (state: CampaignState): CampaignRank => {
  const normalized = normalizeCampaignState(state);
  const goals = getCampaignGoals(normalized);
  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalScore = normalized.history.reduce((sum, record) => sum + record.total, 0);
  const bestRating = normalized.history.reduce<ScenarioScoreRecord['rating'] | null>((best, record) => {
    if (!best) return record.rating;
    return ratingValue[record.rating] > ratingValue[best] ? record.rating : best;
  }, null);

  return {
    title: rankTitleForGoals(completedGoals),
    completedGoals,
    totalGoals: goals.length,
    totalScore,
    bestRating,
  };
};
