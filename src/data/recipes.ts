export interface Recipe {
  id: string;
  resultId: string;
  amount: number;
  ingredients: { itemId: string; amount: number }[];
  requireStation?: string;
}

export const recipes: Recipe[] = [
  {
    id: 'craft_torch',
    resultId: 'torch',
    amount: 1,
    ingredients: [
      { itemId: 'wood', amount: 2 },
    ],
  },
  {
    id: 'craft_axe',
    resultId: 'axe',
    amount: 1,
    ingredients: [
      { itemId: 'wood', amount: 2 },
      { itemId: 'stone', amount: 2 },
    ],
  },
  {
    id: 'craft_bone_club',
    resultId: 'bone_club',
    amount: 1,
    ingredients: [
      { itemId: 'bone', amount: 2 },
      { itemId: 'wood', amount: 1 },
    ],
  },
  {
    id: 'craft_crystal_spear',
    resultId: 'crystal_spear',
    amount: 1,
    ingredients: [
      { itemId: 'ancient_tech', amount: 2 },
      { itemId: 'bone', amount: 1 },
    ],
  },
];
