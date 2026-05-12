import { Survivor } from '../entities/Survivor';
import { WeatherState } from './WeatherSystem';

export class MoraleSystem {
  public tick(survivors: Survivor[], isNight: boolean, hasCampfire: boolean, weather?: WeatherState): void {
    for (const survivor of survivors) {
      // 1. Passive Decay
      let decay = 0.05;
      const stressMultiplier = 1 + survivor.personality.neuroticism * 0.5;
      
      // 2. Darkness penalty
      if (isNight && !hasCampfire && survivor.equippedTool?.id !== 'torch') {
        decay += 0.15 * stressMultiplier;
      }
      
      // 3. Hunger penalty
      if (survivor.stats.hunger < 30) {
        decay += 0.1 * stressMultiplier;
      }

      // 4. Weather penalty
      if (weather) {
          if (weather.type === 'RAIN') decay += 0.1 * weather.intensity * stressMultiplier;
          if (weather.type === 'COLD') decay += 0.2 * weather.intensity * stressMultiplier;
      }

      survivor.stats.morale = Math.max(0, survivor.stats.morale - decay);

      // 5. Campfire recovery
      if (hasCampfire && !isNight && survivor.currentTask?.type === 'IDLE') {
          survivor.stats.morale = Math.min(survivor.stats.maxMorale, survivor.stats.morale + 0.2);
      }
      
      // 6. Social recovery (simple: if multiple survivors exist and are close)
      if (survivors.length > 1) {
          const other = survivors.find(s => s.id !== survivor.id);
          if (other) {
              const dist = Math.sqrt(Math.pow(survivor.x - other.x, 2) + Math.pow(survivor.y - other.y, 2));
              if (dist < 100) {
                  const socialBoost = 0.05 * (0.5 + survivor.personality.sociability); // 0.025..0.075
                  survivor.stats.morale = Math.min(survivor.stats.maxMorale, survivor.stats.morale + socialBoost);
              }
          }
      }
    }
  }
}
