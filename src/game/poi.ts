import { World } from './world';

export type PoiType = 'RUIN' | 'BONFIRE_SITE' | 'STONE_RING' | 'CRYSTAL_RUIN' | 'DIMENSIONAL_ANOMALY';

export interface Poi {
  id: string;
  type: PoiType;
  tx: number;
  ty: number;
}

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};

const pick = <T>(rand: () => number, items: readonly T[]): T => items[Math.floor(rand() * items.length)];

const poiTypes: readonly PoiType[] = ['RUIN', 'BONFIRE_SITE', 'STONE_RING', 'CRYSTAL_RUIN', 'DIMENSIONAL_ANOMALY'] as const;

export const spawnPois = (world: World, count: number, seedOffset: number = 777): Poi[] => {
  const { seed, widthTiles, heightTiles } = world.config;
  const rand = mulberry32(seed + seedOffset);

  const pois: Poi[] = [];
  const used = new Set<string>();

  while (pois.length < count) {
    const tx = Math.floor(rand() * widthTiles);
    const ty = Math.floor(rand() * heightTiles);
    const key = `${tx},${ty}`;
    if (used.has(key)) continue;
    used.add(key);

    pois.push({
      id: `poi_${pois.length}`,
      type: pick(rand, poiTypes),
      tx,
      ty,
    });
  }

  return pois;
};

