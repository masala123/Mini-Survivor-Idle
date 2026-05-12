import { Animal, createAnimal } from '../entities/Animal';

export class WaveSystem {
  public currentWave: number = 0;
  private spawnedForCurrentNight: boolean = false;

  public checkSpawn(day: number, phase: string, animals: Animal[], survivorX: number, survivorY: number): void {
    if (phase === 'NIGHT' && !this.spawnedForCurrentNight) {
        this.currentWave = day;
        this.spawnWave(this.currentWave, animals, survivorX, survivorY);
        this.spawnedForCurrentNight = true;
    }

    if (phase === 'MORNING') {
      this.spawnedForCurrentNight = false;
      // Monsters vanish at morning - handled by Simulation for now but could be here
    }
  }

  private spawnWave(waveNumber: number, animals: Animal[], centerX: number, centerY: number): void {
    const animalCount = Math.min(1 + Math.floor(waveNumber / 2), 5); // Start with 1, increase every 2 days, max 5

    for (let i = 0; i < animalCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 200 + Math.random() * 100; // Spawn outside survivor view/reach
      const x = centerX + Math.cos(angle) * dist;
      const y = centerY + Math.sin(angle) * dist;

      let type = 'Compsognathus';
      let health = 30 + (waveNumber * 5);
      let attackPower = 2 + waveNumber;

      if (waveNumber >= 6) {
        type = 'T-Rex';
        health = 150 + (waveNumber * 20);
        attackPower = 15 + waveNumber * 2;
      } else if (waveNumber >= 3) {
        type = 'Velociraptor';
        health = 60 + (waveNumber * 10);
        attackPower = 8 + waveNumber;
      }

      animals.push(createAnimal(
        `mob_w${waveNumber}_${i}`,
        type,
        'HOSTILE',
        x,
        y,
        health,
        attackPower
      ));
    }
  }
}
