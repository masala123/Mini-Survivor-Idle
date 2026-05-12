import { Survivor } from '../entities/Survivor';
import { Animal } from '../entities/Animal';

export class CombatSystem {
  public tick(survivors: Survivor[], animals: Animal[]): void {
    for (const animal of animals) {
      if (animal.faction !== 'HOSTILE') continue;
      
      // Hostile animals target the closest survivor
      if (survivors.length > 0) {
        const target = survivors[0]; // Simplification
        animal.targetId = target.id;

        // If close enough, attack
        const dist = Math.sqrt(Math.pow(animal.x - target.x, 2) + Math.pow(animal.y - target.y, 2));
        if (dist < 30) {
          target.stats.health -= animal.attackPower / 10; // Slow damage over ticks
          target.debugState = `Under Attack by ${animal.type}!`;
        }
      }
    }
  }
}
