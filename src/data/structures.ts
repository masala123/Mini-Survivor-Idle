export interface StructureData {
  id: string;
  name: string;
  ingredients: { itemId: string; amount: number }[];
  type: 'UTILITY' | 'STORAGE' | 'DEFENSE';
}

export const structureData: Record<string, StructureData> = {
  campfire: {
    id: 'campfire',
    name: 'Campfire',
    type: 'UTILITY',
    ingredients: [{ itemId: 'wood', amount: 3 }],
  },
  farm_plot: {
    id: 'farm_plot',
    name: 'Farm Plot',
    type: 'UTILITY',
    ingredients: [{ itemId: 'wood', amount: 4 }],
  },
  chest: {
    id: 'chest',
    name: 'Wooden Chest',
    type: 'STORAGE',
    ingredients: [{ itemId: 'wood', amount: 5 }],
  },
  workbench: {
    id: 'workbench',
    name: 'Workbench',
    type: 'UTILITY',
    ingredients: [{ itemId: 'wood', amount: 4 }, { itemId: 'stone', amount: 2 }],
  },
  wall: {
    id: 'wall',
    name: 'Log Wall',
    type: 'DEFENSE',
    ingredients: [{ itemId: 'wood', amount: 2 }],
  },
  dimensional_beacon: {
    id: 'dimensional_beacon',
    name: 'Dimensional Beacon',
    type: 'UTILITY',
    ingredients: [{ itemId: 'ancient_tech', amount: 3 }, { itemId: 'fossil', amount: 2 }, { itemId: 'stone', amount: 5 }],
  },
};
