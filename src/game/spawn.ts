import { ResourceNode, ResourceType, createResourceNode } from '../entities/ResourceNode';
import { World } from './world';

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};

const pick = <T>(rand: () => number, items: T[]): T => items[Math.floor(rand() * items.length)];

const resourceChoicesForBiome: Record<string, ResourceType[]> = {
  GRASSLAND: ['BERRY_BUSH', 'FERN_BUSH', 'TREE'],
  FOREST: ['TREE', 'TREE', 'BONE_PILE', 'FERN_BUSH'],
  SWAMP: ['FERN_BUSH', 'BONE_PILE', 'FOSSIL_DEPOSIT'],
  DESERT: ['STONE', 'STONE', 'FOSSIL_DEPOSIT', 'BONE_PILE', 'ANCIENT_TECH_NODE'],
};

export const spawnInitialResources = (world: World, count: number, seedOffset: number = 1): ResourceNode[] => {
  const { seed, widthTiles, heightTiles, tileSize, originX, originY } = world.config;
  const rand = mulberry32(seed + seedOffset);

  const resources: ResourceNode[] = [];
  for (let i = 0; i < count; i++) {
    const tx = Math.floor(rand() * widthTiles);
    const ty = Math.floor(rand() * heightTiles);

    const biome = world.biomeAtTile(tx, ty);
    const choices = resourceChoicesForBiome[biome] ?? ['BERRY_BUSH', 'TREE', 'STONE'];
    const type = pick(rand, choices);

    // Place near the tile center with a small deterministic jitter.
    const cx = originX + tx * tileSize + tileSize / 2;
    const cy = originY + ty * tileSize + tileSize / 2;
    const jitter = tileSize * 0.3;
    const x = Math.round(cx + (rand() - 0.5) * jitter);
    const y = Math.round(cy + (rand() - 0.5) * jitter);

    let amount = 4;
    if (type === 'TREE') amount = 10;
    else if (type === 'STONE' || type === 'BONE_PILE') amount = 5;
    else if (type === 'FOSSIL_DEPOSIT') amount = 3;
    else if (type === 'ANCIENT_TECH_NODE') amount = 1;

    let regrowRate = 500;
    if (type === 'BERRY_BUSH' || type === 'FERN_BUSH') regrowRate = 120;
    else if (type === 'TREE') regrowRate = 260;
    else if (type === 'BONE_PILE' || type === 'FOSSIL_DEPOSIT') regrowRate = 800; // very slow
    else if (type === 'ANCIENT_TECH_NODE') regrowRate = 2000; // extremely slow

    resources.push(createResourceNode(`res_${i}_${type}`, type, x, y, amount, regrowRate));
  }

  return resources;
};

