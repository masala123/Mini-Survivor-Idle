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
  durability?: number;
  maxDurability?: number;
  isTriggered?: boolean;
  processTimer?: number;
  maxProcessTimer?: number;
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

  if (type === 'bone_wall') {
    struct.health = 250;
    struct.maxHealth = 250;
  }

  if (type === 'spike_trap') {
    struct.durability = 3;
    struct.maxDurability = 3;
    struct.isTriggered = false;
  }

  if (type === 'chest' || type === 'wood_shed' || type === 'stone_mason' || type === 'furnace') {
    struct.inventory = {};
    if (type === 'wood_shed' || type === 'stone_mason') {
        struct.health = 200;
        struct.maxHealth = 200;
    }
  }

  if (type === 'furnace') {
    struct.processTimer = 0;
    struct.maxProcessTimer = 200; // Ticks to process
  }

  if (type === 'farm_plot') {
    struct.inventory = {};
    struct.farmProgress = 0;
  }

  return struct;
};
