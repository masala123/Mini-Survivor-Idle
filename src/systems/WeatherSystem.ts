export type WeatherType = 'CLEAR' | 'RAIN' | 'COLD';

export interface WeatherState {
  type: WeatherType;
  intensity: number; // 0.0 to 1.0
  duration: number; // in ticks
}

export class WeatherSystem {
  public state: WeatherState = {
    type: 'CLEAR',
    intensity: 0,
    duration: 120, // Start with some clear weather
  };

  public tick(): void {
    this.state.duration--;

    if (this.state.duration <= 0) {
      this.changeWeather();
    }
  }

  private changeWeather(): void {
    const rand = Math.random();
    if (rand < 0.6) {
      this.state.type = 'CLEAR';
      this.state.duration = 100 + Math.random() * 200;
      this.state.intensity = 0;
    } else if (rand < 0.85) {
      this.state.type = 'RAIN';
      this.state.duration = 50 + Math.random() * 100;
      this.state.intensity = 0.5 + Math.random() * 0.5;
    } else {
      this.state.type = 'COLD';
      this.state.duration = 50 + Math.random() * 100;
      this.state.intensity = 0.3 + Math.random() * 0.4;
    }
  }
}
