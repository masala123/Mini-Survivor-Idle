import { Structure } from '../entities/Structure';
import { TimeState } from './TimeSystem';
import { WeatherState } from './WeatherSystem';

export interface PowerState {
  currentOutput: number;
  currentConsumption: number;
  batteryLevel: number;
  maxBatteryCapacity: number;
}

export class PowerSystem {
  public state: PowerState = {
    currentOutput: 0,
    currentConsumption: 0,
    batteryLevel: 0,
    maxBatteryCapacity: 1000,
  };

  public tick(structures: Structure[], time: TimeState, weather: WeatherState): void {
    let totalOutput = 0;
    let totalConsumption = 0;
    let totalCapacity = 0;

    for (const struct of structures) {
      if (!struct.isComplete) continue;

      // Generation
      if (struct.type === 'solar_panel') {
        const isDay = time.phase === 'MORNING' || time.phase === 'AFTERNOON';
        const isSunny = weather.type === 'CLEAR';
        if (isDay && isSunny) {
          totalOutput += 20;
        }
      }

      if (struct.type === 'coal_generator') {
        // Fuel check (Logic handled in AI or RefinerySystem later, for now assume constant if fueled)
        if ((struct.inventory?.['wood'] || 0) > 0 || (struct.inventory?.['refined_fossil'] || 0) > 0) {
            totalOutput += 50;
            // Consume fuel periodically
            if (Math.random() < 0.05) { // Simplified decay
                const fuelId = (struct.inventory?.['refined_fossil'] || 0) > 0 ? 'refined_fossil' : 'wood';
                struct.inventory![fuelId] -= 1;
            }
        }
      }

      // Storage
      if (struct.type === 'battery_bank') {
        totalCapacity += 500;
      }

      // Consumption
      if (struct.type === 'electric_smelter') totalConsumption += 15;
      if (struct.type === 'searchlight') totalConsumption += 5;
      if (struct.type === 'auto_turret') totalConsumption += 10;
    }

    this.state.maxBatteryCapacity = totalCapacity || 100; // Minimum capacity
    this.state.currentOutput = totalOutput;
    this.state.currentConsumption = totalConsumption;

    const netPower = totalOutput - totalConsumption;
    this.state.batteryLevel = Math.max(0, Math.min(this.state.maxBatteryCapacity, this.state.batteryLevel + netPower));
  }

  public isPowered(consumption: number): boolean {
    // If output + battery can cover consumption
    return (this.state.currentOutput + this.state.batteryLevel) >= consumption;
  }
}
