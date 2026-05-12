import { Poi, PoiType } from './poi';
import { Survivor } from '../entities/Survivor';

export interface PoiReward {
  inventory?: Record<string, number>;
  moraleDelta?: number;
}

const rewardByType: Record<PoiType, PoiReward> = {
  RUIN: { inventory: { wood: 2, stone: 2 } },
  BONFIRE_SITE: { inventory: { wood: 1, torch: 1 }, moraleDelta: 5 },
  STONE_RING: { moraleDelta: 10 },
  CRYSTAL_RUIN: { inventory: { ancient_tech: 1, stone: 3 } },
  DIMENSIONAL_ANOMALY: { inventory: { ancient_tech: 2 }, moraleDelta: -5 },
};

export const getPoiReward = (poi: Poi): PoiReward => rewardByType[poi.type] ?? {};

export const applyPoiReward = (survivor: Survivor, poi: Poi): PoiReward => {
  const reward = getPoiReward(poi);

  if (reward.inventory) {
    for (const [itemId, amount] of Object.entries(reward.inventory)) {
      survivor.inventory[itemId] = (survivor.inventory[itemId] || 0) + amount;
    }
  }

  if (typeof reward.moraleDelta === 'number' && reward.moraleDelta !== 0) {
    survivor.stats.morale = Math.max(0, Math.min(survivor.stats.maxMorale, survivor.stats.morale + reward.moraleDelta));
  }

  return reward;
};

