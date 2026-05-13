export interface StructureData {
  id: string;
  name: string;
  ingredients: { itemId: string; amount: number }[];
  type: 'UTILITY' | 'STORAGE' | 'DEFENSE' | 'PRODUCTION';
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
  wood_shed: {
    id: 'wood_shed',
    name: 'Wood Shed',
    type: 'STORAGE',
    ingredients: [{ itemId: 'wood', amount: 6 }],
  },
  stone_mason: {
    id: 'stone_mason',
    name: 'Stone Mason',
    type: 'STORAGE',
    ingredients: [{ itemId: 'stone', amount: 4 }, { itemId: 'wood', amount: 2 }],
  },
  furnace: {
    id: 'furnace',
    name: 'Stone Furnace',
    type: 'UTILITY',
    ingredients: [{ itemId: 'stone', amount: 8 }, { itemId: 'wood', amount: 4 }],
  },
  bone_wall: {
    id: 'bone_wall',
    name: 'Bone Wall',
    type: 'DEFENSE',
    ingredients: [{ itemId: 'bone', amount: 4 }],
  },
  spike_trap: {
    id: 'spike_trap',
    name: 'Spike Trap',
    type: 'DEFENSE',
    ingredients: [{ itemId: 'wood', amount: 2 }, { itemId: 'bone', amount: 1 }],
  },
  solar_panel: {
    id: 'solar_panel',
    name: 'Solar Panel',
    type: 'UTILITY',
    ingredients: [{ itemId: 'ancient_tech', amount: 1 }, { itemId: 'refined_fossil', amount: 1 }, { itemId: 'stone', amount: 2 }],
  },
  coal_generator: {
    id: 'coal_generator',
    name: 'Coal Generator',
    type: 'UTILITY',
    ingredients: [{ itemId: 'stone', amount: 5 }, { itemId: 'refined_fossil', amount: 2 }],
  },
  battery_bank: {
    id: 'battery_bank',
    name: 'Battery Bank',
    type: 'UTILITY',
    ingredients: [{ itemId: 'ancient_tech', amount: 1 }, { itemId: 'refined_fossil', amount: 2 }],
  },
  electric_smelter: {
    id: 'electric_smelter',
    name: 'Electric Smelter',
    type: 'PRODUCTION',
    ingredients: [{ itemId: 'stone', amount: 4 }, { itemId: 'refined_fossil', amount: 2 }, { itemId: 'ancient_tech', amount: 1 }],
  },
  water_pump: {
    id: 'water_pump',
    name: 'Water Pump',
    type: 'UTILITY',
    ingredients: [{ itemId: 'stone', amount: 5 }, { itemId: 'refined_fossil', amount: 2 }, { itemId: 'ancient_tech', amount: 1 }],
  },
  dimensional_beacon: {
    id: 'dimensional_beacon',
    name: 'Dimensional Beacon',
    type: 'UTILITY',
    ingredients: [{ itemId: 'ancient_tech', amount: 3 }, { itemId: 'fossil', amount: 2 }, { itemId: 'stone', amount: 5 }],
  },
};
