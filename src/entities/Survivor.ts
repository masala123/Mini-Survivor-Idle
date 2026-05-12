export interface EquippedTool {
  id: string;
  durability: number;
}

export interface Personality {
  bravery: number; // 0..1 (higher = engages danger sooner)
  sociability: number; // 0..1 (higher = social morale matters more)
  neuroticism: number; // 0..1 (higher = worse mood under stress)
}

export interface Survivor {
  id: string;
  x: number;
  y: number;
  personality: Personality;
  scoutCooldown: number;
  stats: {
    health: number;
    maxHealth: number;
    hunger: number;
    maxHunger: number;
    morale: number;
    maxMorale: number;
    attackPower: number;
  };
  inventory: Record<string, number>;
  equippedTool: EquippedTool | null;
  currentTask: Task | null;
  debugState: string;
}

export type TaskType =
  | 'IDLE'
  | 'GATHER_FOOD'
  | 'GATHER_MATERIAL'
  | 'HARVEST_FARM'
  | 'SCOUT'
  | 'EAT_FOOD'
  | 'CRAFT'
  | 'BUILD'
  | 'FIGHT'
  | 'FLEE'
  | 'EQUIP'
  | 'STORE'
  | 'RELAX';

export interface Task {
  type: TaskType;
  targetId?: string;
  recipeId?: string;
  structureId?: string;
  itemId?: string;
  targetX?: number;
  targetY?: number;
  progress?: number;
}

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

export const createSurvivor = (id: string, x: number, y: number, personality?: Partial<Personality>): Survivor => ({
  id,
  x,
  y,
  personality: {
    bravery: clamp01(personality?.bravery ?? 0.5),
    sociability: clamp01(personality?.sociability ?? 0.5),
    neuroticism: clamp01(personality?.neuroticism ?? 0.5),
  },
  scoutCooldown: 0,
  stats: {
    health: 100,
    maxHealth: 100,
    hunger: 100,
    maxHunger: 100,
    morale: 100,
    maxMorale: 100,
    attackPower: 5,
  },
  inventory: {},
  equippedTool: null,
  currentTask: null,
  debugState: 'Initialized',
});
