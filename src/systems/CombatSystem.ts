import { Survivor } from '../entities/Survivor';
import { Animal } from '../entities/Animal';

export class CombatSystem {
  public tick(survivors: Survivor[], animals: Animal[]): void {
    // 1. Animals attacking survivors or other animals
    for (const animal of animals) {
      if (!animal.targetId) continue;

      // Find target (could be survivor or another animal)
      let target: { id: string, x: number, y: number, stats?: { health: number }, health?: number } | undefined = survivors.find(s => s.id === animal.targetId);
      if (!target) target = animals.find(a => a.id === animal.targetId);

      if (!target) {
        animal.targetId = null;
        continue;
      }

      const dist = Math.sqrt(Math.pow(animal.x - target.x, 2) + Math.pow(animal.y - target.y, 2));
      if (dist < 30) {
        if (target.stats) {
            // Target is Survivor
            target.stats.health -= animal.attackPower / 10;
        } else if (target.health !== undefined) {
            // Target is Animal
            target.health -= animal.attackPower / 10;
        }
      }
    }

    // 2. Survivors attacking animals (handled by SurvivorBrain execute FIGHT, but we can centralize here too)
    // For now, SurvivorBrain handles its own damage output to animals in its executeTask.
  }
}
