import { Survivor } from '../entities/Survivor';

export class HungerSystem {
  // Configurable data
  private decayRatePerTick = 0.5;

  public tick(survivors: Survivor[]): void {
    for (const survivor of survivors) {
      survivor.stats.hunger = Math.max(
        0,
        survivor.stats.hunger - this.decayRatePerTick
      );

      // Hunger damage if starving
      if (survivor.stats.hunger === 0) {
        survivor.stats.health = Math.max(0, survivor.stats.health - 1);
      }
    }
  }
}
