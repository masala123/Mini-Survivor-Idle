import { Poi, PoiType } from './poi';
import { World } from './world';
import { Structure, createStructure } from '../entities/Structure';

export interface PoiWorldEffectResult {
  createdStructure?: Structure;
}

const structureForPoi: Record<PoiType, Structure['type'] | null> = {
  RUIN: 'chest',
  BONFIRE_SITE: 'campfire',
  STONE_RING: null,
  CRYSTAL_RUIN: 'chest', // Might change to a specific ancient chest later
  DIMENSIONAL_ANOMALY: null,
};

export const applyPoiWorldEffect = (world: World, structures: Structure[], poi: Poi): PoiWorldEffectResult => {
  const structureType = structureForPoi[poi.type] ?? null;
  if (!structureType) return {};

  const { originX, originY, tileSize } = world.config;
  const x = originX + poi.tx * tileSize + tileSize / 2;
  const y = originY + poi.ty * tileSize + tileSize / 2;

  // Avoid stacking the same structure type at the same location.
  const existing = structures.find(s => s.type === structureType && Math.abs(s.x - x) < 1 && Math.abs(s.y - y) < 1);
  if (existing) return {};

  const created = createStructure(`poi_${poi.id}_${structureType}`, structureType, x, y, true);

  if (structureType === 'chest') {
    created.inventory = { ...(created.inventory || {}), wood: 1, stone: 1 };
  }

  structures.push(created);
  return { createdStructure: created };
};

