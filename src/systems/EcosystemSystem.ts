import { Animal, createAnimal } from '../entities/Animal';
import { World } from '../game/world';

export class EcosystemSystem {
  private lastSpawnTick: number = 0;
  private spawnInterval: number = 300; // Ticks between natural spawns

  public tick(tickCount: number, animals: Animal[], world: World, phase: string): void {
    // Natural spawning during the day
    if ((phase === 'MORNING' || phase === 'AFTERNOON') && tickCount - this.lastSpawnTick > this.spawnInterval) {
      if (animals.length < 10) {
        this.spawnNeutralAnimal(animals, world);
      }
      this.lastSpawnTick = tickCount;
    }
  }

  private spawnNeutralAnimal(animals: Animal[], world: World): void {
    const { widthTiles, heightTiles, tileSize, originX, originY } = world.config;
    
    // Pick a random edge tile
    const side = Math.floor(Math.random() * 4);
    let tx = 0, ty = 0;
    if (side === 0) { tx = Math.floor(Math.random() * widthTiles); ty = 0; }
    else if (side === 1) { tx = Math.floor(Math.random() * widthTiles); ty = heightTiles - 1; }
    else if (side === 2) { tx = 0; ty = Math.floor(Math.random() * heightTiles); }
    else { tx = widthTiles - 1; ty = Math.floor(Math.random() * heightTiles); }

    const x = originX + tx * tileSize + tileSize / 2;
    const y = originY + ty * tileSize + tileSize / 2;

    const types: { type: string, health: number, power: number }[] = [
      { type: 'Triceratops', health: 100, power: 10 },
      { type: 'Ankylosaurus', health: 120, power: 12 },
    ];
    const choice = types[Math.floor(Math.random() * types.length)];

    animals.push(createAnimal(
      `animal_n_${Date.now()}`,
      choice.type,
      'NEUTRAL',
      x,
      y,
      choice.health,
      choice.power
    ));
  }
}
