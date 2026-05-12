export interface Item {
  id: string;
  name: string;
  type: 'FOOD' | 'MATERIAL' | 'TOOL' | 'EQUIPMENT';
  stats?: {
    hungerRecover?: number;
    healthRecover?: number;
    durability?: number;
    workPower?: number;
    attackPower?: number;
  };
}

export const itemData: Record<string, Item> = {
  berry: {
    id: 'berry',
    name: 'Berry',
    type: 'FOOD',
    stats: { hungerRecover: 25 },
  },
  fern: {
    id: 'fern',
    name: 'Prehistoric Fern',
    type: 'FOOD',
    stats: { hungerRecover: 20 },
  },
  vegetable: {
    id: 'vegetable',
    name: 'Vegetable',
    type: 'FOOD',
    stats: { hungerRecover: 35 },
  },
  wood: {
    id: 'wood',
    name: 'Wood',
    type: 'MATERIAL',
  },
  stone: {
    id: 'stone',
    name: 'Stone',
    type: 'MATERIAL',
  },
  bone: {
    id: 'bone',
    name: 'Dinosaur Bone',
    type: 'MATERIAL',
  },
  fossil: {
    id: 'fossil',
    name: 'Ancient Fossil',
    type: 'MATERIAL',
  },
  ancient_tech: {
    id: 'ancient_tech',
    name: 'Crystal Tech Fragment',
    type: 'MATERIAL',
  },
  axe: {
    id: 'axe',
    name: 'Stone Axe',
    type: 'TOOL',
    stats: { durability: 50, workPower: 2, attackPower: 5 },
  },
  torch: {
    id: 'torch',
    name: 'Torch',
    type: 'EQUIPMENT',
    stats: { durability: 100, attackPower: 2 },
  },
  bone_club: {
    id: 'bone_club',
    name: 'Bone Club',
    type: 'EQUIPMENT',
    stats: { durability: 80, attackPower: 15 },
  },
  crystal_spear: {
    id: 'crystal_spear',
    name: 'Crystal Spear',
    type: 'EQUIPMENT',
    stats: { durability: 120, attackPower: 30 },
  },
};
