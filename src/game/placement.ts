import { ResourceNode } from '../entities/ResourceNode';
import { Structure } from '../entities/Structure';
import { Survivor } from '../entities/Survivor';
import { Animal } from '../entities/Animal';

const dist2 = (ax: number, ay: number, bx: number, by: number) => {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
};

export interface PlacementValidityInput {
  x: number;
  y: number;
  structures: Structure[];
  resources: ResourceNode[];
  survivors: Survivor[];
  animals: Animal[];
}

export const isPlacementValid = ({ x, y, structures, resources, survivors, animals }: PlacementValidityInput): boolean => {
  // Simple "no overlap" rule for MVP: prevent placing too close to existing entities.
  const minStructureDist = 22; // structures are drawn as 20x20
  const minStructureDist2 = minStructureDist * minStructureDist;

  for (const s of structures) {
    if (dist2(x, y, s.x, s.y) <= minStructureDist2) return false;
  }

  const minResourceDist = 18; // resources are drawn as radius ~10
  const minResourceDist2 = minResourceDist * minResourceDist;
  for (const r of resources) {
    if (dist2(x, y, r.x, r.y) <= minResourceDist2) return false;
  }

  const minSurvivorDist = 22; // survivors are drawn as radius ~15
  const minSurvivorDist2 = minSurvivorDist * minSurvivorDist;
  for (const s of survivors) {
    if (dist2(x, y, s.x, s.y) <= minSurvivorDist2) return false;
  }

  const minAnimalDist = 22;
  const minAnimalDist2 = minAnimalDist * minAnimalDist;
  for (const a of animals) {
    if (dist2(x, y, a.x, a.y) <= minAnimalDist2) return false;
  }

  return true;
};

