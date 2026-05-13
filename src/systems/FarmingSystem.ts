import { Structure } from '../entities/Structure';
import { WeatherState } from './WeatherSystem';
import { PowerSystem } from './PowerSystem';

export class FarmingSystem {
  public tick(structures: Structure[], weather: WeatherState, power: PowerSystem): void {
    const activePumps = structures.filter(s => s.type === 'water_pump' && s.isComplete && power.isPowered(10));

    for (const struct of structures) {
      if (struct.type !== 'farm_plot' || !struct.isComplete) continue;

      if (!struct.inventory) struct.inventory = {};
      struct.farmProgress ??= 0;

      const baseGrowth = 1;

      let weatherBoost = 0;
      if (weather.type === 'RAIN') weatherBoost = 0.75 * weather.intensity;
      if (weather.type === 'COLD') weatherBoost = -0.5 * weather.intensity;

      let growth = Math.max(0, baseGrowth + weatherBoost);

      // Irrigation Check
      const isIrrigated = activePumps.some(pump => {
        const d = Math.sqrt(Math.pow(struct.x - pump.x, 2) + Math.pow(struct.y - pump.y, 2));
        return d < 100;
      });

      if (isIrrigated) {
        growth *= 2.0;
      }
      struct.isIrrigated = isIrrigated;

      struct.farmProgress += growth;

      while (struct.farmProgress >= 100) {
        struct.farmProgress -= 100;
        struct.inventory['vegetable'] = (struct.inventory['vegetable'] || 0) + 1;
      }
    }
  }
}

