export type AnimalFaction = 'HOSTILE' | 'NEUTRAL' | 'TAMED';

export interface AnimalTask {
  type: 'GRAZE' | 'HUNT' | 'WANDER' | 'SLEEP' | 'FIGHT';
  targetId: string | null;
  targetX?: number;
  targetY?: number;
}

export interface Animal {
  id: string;
  type: string;
  faction: AnimalFaction;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  attackPower: number;
  targetId: string | null;
  mountedBySurvivorId: string | null;
  currentTask: AnimalTask | null;
  debugState: string;
}

export const createAnimal = (
  id: string,
  type: string,
  faction: AnimalFaction,
  x: number,
  y: number,
  health: number = 50,
  attackPower: number = 10
): Animal => ({
  id,
  type,
  faction,
  x,
  y,
  health,
  maxHealth: health,
  attackPower,
  targetId: null,
  mountedBySurvivorId: null,
  currentTask: null,
  debugState: 'Idle',
});
