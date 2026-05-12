import { ResourceNode } from '../entities/ResourceNode';

export class ResourceSystem {
  public tick(resources: ResourceNode[]): void {
    for (const res of resources) {
      if (res.amount < res.maxAmount) {
        res.regrowTimer++;
        if (res.regrowTimer >= res.regrowRate) {
          res.amount += 1;
          res.regrowTimer = 0;
        }
      }
    }
  }
}
