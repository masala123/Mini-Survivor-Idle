export type ResourceType = 'BERRY_BUSH' | 'TREE' | 'STONE' | 'FERN_BUSH' | 'BONE_PILE' | 'FOSSIL_DEPOSIT' | 'ANCIENT_TECH_NODE';

export const resourceToItemMap: Record<ResourceType, string> = {
  BERRY_BUSH: 'berry',
  TREE: 'wood',
  STONE: 'stone',
  FERN_BUSH: 'fern',
  BONE_PILE: 'bone',
  FOSSIL_DEPOSIT: 'fossil',
  ANCIENT_TECH_NODE: 'ancient_tech',
};

export interface ResourceNode {
  id: string;
  type: ResourceType;
  x: number;
  y: number;
  amount: number;
  maxAmount: number;
  regrowRate: number; // Ticks per 1 unit regrow
  regrowTimer: number;
}

export const createResourceNode = (
  id: string,
  type: ResourceType,
  x: number,
  y: number,
  amount: number,
  regrowRate: number = 200 // Default regrow slowly
): ResourceNode => ({
  id,
  type,
  x,
  y,
  amount,
  maxAmount: amount,
  regrowRate,
  regrowTimer: 0,
});
