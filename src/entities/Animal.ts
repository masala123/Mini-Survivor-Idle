export type AnimalFaction = 'HOSTILE' | 'NEUTRAL' | 'TAMED';

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
});
