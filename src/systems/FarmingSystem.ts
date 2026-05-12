import { Structure } from '../entities/Structure';
import { WeatherState } from './WeatherSystem';

export class FarmingSystem {
  public tick(structures: Structure[], weather: WeatherState): void {
    for (const struct of structures) {
      if (struct.type !== 'farm_plot' || !struct.isComplete) continue;

      if (!struct.inventory) struct.inventory = {};
      struct.farmProgress ??= 0;

      const baseGrowth = 1;

      let weatherBoost = 0;
      if (weather.type === 'RAIN') weatherBoost = 0.75 * weather.intensity;
      if (weather.type === 'COLD') weatherBoost = -0.5 * weather.intensity;

      const growth = Math.max(0, baseGrowth + weatherBoost);
      struct.farmProgress += growth;

      while (struct.farmProgress >= 100) {
        struct.farmProgress -= 100;
        struct.inventory['vegetable'] = (struct.inventory['vegetable'] || 0) + 1;
      }
    }
  }
}

