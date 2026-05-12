export type DayPhase = 'MORNING' | 'AFTERNOON' | 'NIGHT';

export interface TimeState {
  day: number;
  phase: DayPhase;
  progress: number; // 0.0 to 1.0 within the day
}

export class TimeSystem {
  private ticksPerDay = 240; // 24 seconds at 10 ticks/sec
  private morningEnd = 0.4;
  private afternoonEnd = 0.8;

  public state: TimeState = {
    day: 1,
    phase: 'MORNING',
    progress: 0,
  };

  public tick(): void {
    this.state.progress += 1 / this.ticksPerDay;

    if (this.state.progress >= 1.0) {
      this.state.progress = 0;
      this.state.day += 1;
    }

    this.updatePhase();
  }

  private updatePhase(): void {
    if (this.state.progress < this.morningEnd) {
      this.state.phase = 'MORNING';
    } else if (this.state.progress < this.afternoonEnd) {
      this.state.phase = 'AFTERNOON';
    } else {
      this.state.phase = 'NIGHT';
    }
  }
}
