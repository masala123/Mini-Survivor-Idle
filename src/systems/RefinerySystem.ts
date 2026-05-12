import { Structure } from '../entities/Structure';

export class RefinerySystem {
  public tick(structures: Structure[]): void {
    for (const struct of structures) {
      if (struct.type === 'furnace' && struct.isComplete && struct.inventory) {
        this.processFurnace(struct);
      }
    }
  }

  private processFurnace(furnace: Structure): void {
    const fossil = furnace.inventory!['fossil'] || 0;
    const wood = furnace.inventory!['wood'] || 0;

    // Check if we have ingredients
    if (fossil >= 1 && wood >= 1) {
      furnace.processTimer = (furnace.processTimer || 0) + 1;
      
      if (furnace.processTimer >= (furnace.maxProcessTimer || 200)) {
        // Complete process
        furnace.inventory!['fossil'] -= 1;
        furnace.inventory!['wood'] -= 1;
        furnace.inventory!['refined_fossil'] = (furnace.inventory!['refined_fossil'] || 0) + 1;
        furnace.processTimer = 0;
      }
    } else {
      // Not enough ingredients, reset timer slowly or keep it? 
      // Keep it for now, but in a real game you might lose progress if fuel runs out.
    }
  }
}
