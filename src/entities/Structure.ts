export interface Structure {
  id: string;
  type: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  isComplete: boolean;
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
