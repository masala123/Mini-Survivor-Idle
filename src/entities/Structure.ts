export interface Structure {
  id: string;
  type: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  isComplete: boolean;
  constructionProgress: number;
  inventory?: Record<string, number>;
  farmProgress?: number;
}

export const createStructure = (
  id: string,
  type: string,
  x: number,
  y: number,
  isComplete: boolean = false
): Structure => {
  const struct: Structure = {
    id,
    type,
    x,
    y,
    health: 100,
    maxHealth: 100,
    isComplete,
    constructionProgress: isComplete ? 100 : 0,
  };

  if (type === 'chest') {
    struct.inventory = {};
  }

  if (type === 'farm_plot') {
    struct.inventory = {};
    struct.farmProgress = 0;
  }

  return struct;
};
