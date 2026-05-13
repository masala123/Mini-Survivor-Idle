export type BiomeType = 'GRASSLAND' | 'FOREST' | 'SWAMP' | 'DESERT' | 'VOLCANIC';

export interface WorldConfig {
  seed: number;
  widthTiles: number;
  heightTiles: number;
  tileSize: number;
  originX: number; // world-space coordinate of tile (0,0) top-left corner
  originY: number;
}

export interface World {
  config: WorldConfig;
  biomeAtTile: (tx: number, ty: number) => BiomeType;
  biomeAtWorld: (x: number, y: number) => BiomeType;
  worldToTile: (x: number, y: number) => { tx: number; ty: number };
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

const hash2 = (seed: number, x: number, y: number) => {
  // Small integer mixing; deterministic across JS engines.
  let h = seed | 0;
  h ^= Math.imul(x | 0, 374761393);
  h ^= Math.imul(y | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return h | 0;
};

export const createWorld = (seed: number, widthTiles: number, heightTiles: number, tileSize: number): World => {
  const originX = -Math.floor(widthTiles / 2) * tileSize;
  const originY = -Math.floor(heightTiles / 2) * tileSize;
  const worldToTile = (x: number, y: number) => ({
    tx: Math.floor((x - originX) / tileSize),
    ty: Math.floor((y - originY) / tileSize),
  });

  const biomeAtTile = (tx: number, ty: number): BiomeType => {
    const localSeed = hash2(seed, tx, ty);
    const rand = mulberry32(localSeed);
    const r = rand();
    if (r < 0.4) return 'GRASSLAND';
    if (r < 0.65) return 'FOREST';
    if (r < 0.8) return 'SWAMP';
    if (r < 0.9) return 'DESERT';
    return 'VOLCANIC';
  };

  const biomeAtWorld = (x: number, y: number): BiomeType => {
    const { tx, ty } = worldToTile(x, y);
    return biomeAtTile(tx, ty);
  };

  return {
    config: { seed, widthTiles, heightTiles, tileSize, originX, originY },
    biomeAtTile,
    biomeAtWorld,
    worldToTile,
  };
};
