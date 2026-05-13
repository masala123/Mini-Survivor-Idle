import { Structure } from '../entities/Structure';
import { PowerSystem } from './PowerSystem';

export class RefinerySystem {
  public tick(structures: Structure[], power: PowerSystem): void {
    for (const struct of structures) {
      if (!struct.isComplete || !struct.inventory) continue;

      if (struct.type === 'furnace') {
        this.processFurnace(struct);
      }

      if (struct.type === 'electric_smelter') {
        const isPowered = power.isPowered(15);
        this.processSmelter(struct, isPowered);
      }
    }
  }

  private processFurnace(furnace: Structure): void {
    const fossil = furnace.inventory!['fossil'] || 0;
    const wood = furnace.inventory!['wood'] || 0;

    if (fossil >= 1 && wood >= 1) {
      furnace.processTimer = (furnace.processTimer || 0) + 1;
      
      if (furnace.processTimer >= (furnace.maxProcessTimer || 200)) {
        furnace.inventory!['fossil'] -= 1;
        furnace.inventory!['wood'] -= 1;
        furnace.inventory!['refined_fossil'] = (furnace.inventory!['refined_fossil'] || 0) + 1;
        furnace.processTimer = 0;
      }
    }
  }

  private processSmelter(smelter: Structure, isPowered: boolean): void {
    const fossil = smelter.inventory!['fossil'] || 0;
    const wood = smelter.inventory!['wood'] || 0;

    if (fossil >= 1 && wood >= 1) {
      // Powered smelter is 2x faster
      const speed = isPowered ? 2 : 0; // Does not work without power? Or just slower? 
      // Roadmap says "Processes materials 2x faster than Furnace" 
      // Let's say it needs power to function at all.
      
      if (speed > 0) {
        smelter.processTimer = (smelter.processTimer || 0) + speed;
        
        if (smelter.processTimer >= (smelter.maxProcessTimer || 200)) {
            smelter.inventory!['fossil'] -= 1;
            smelter.inventory!['wood'] -= 1;
            smelter.inventory!['refined_fossil'] = (smelter.inventory!['refined_fossil'] || 0) + 1;
            smelter.processTimer = 0;
        }
      }
    }
  }
}
