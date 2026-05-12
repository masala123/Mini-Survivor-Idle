import { Survivor } from '../entities/Survivor';
import { Animal } from '../entities/Animal';
import { Structure } from '../entities/Structure';

export class CombatSystem {
  public tick(survivors: Survivor[], animals: Animal[], structures: Structure[]): void {
    // 1. Animals attacking survivors or other animals
    for (const animal of animals) {
      if (!animal.targetId && animal.faction === 'HOSTILE') {
          // Default target for hostiles if none exists
          const lead = survivors[0];
          if (lead) animal.targetId = lead.id;
      }

      if (!animal.targetId) continue;

      // Find target (could be survivor or another animal)
      let target: { id: string, x: number, y: number, stats?: { health: number }, health?: number } | undefined = survivors.find(s => s.id === animal.targetId);
      if (!target) target = animals.find(a => a.id === animal.targetId);

      if (!target) {
        animal.targetId = null;
        continue;
      }

      const dist = Math.sqrt(Math.pow(animal.x - target.x, 2) + Math.pow(animal.y - target.y, 2));
      
      // Wall Protection Logic: If a wall is in between or very close, attack the wall instead
      if (animal.faction === 'HOSTILE') {
          const nearestWall = structures.find(s => (s.type === 'wall' || s.type === 'bone_wall') && s.isComplete && Math.sqrt(Math.pow(animal.x - s.x, 2) + Math.pow(animal.y - s.y, 2)) < 30);
          if (nearestWall) {
              nearestWall.health -= animal.attackPower / 20; // Walls take less damage
              animal.debugState = `Attacking ${nearestWall.type}!`;
              continue; // Don't attack the real target yet
          }
      }

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

    // 3. Trap Logic: Environmental interaction
    for (const struct of structures) {
        if (struct.type === 'spike_trap' && struct.isComplete && !struct.isTriggered) {
            // Check if any hostile animal is walking over it
            for (const animal of animals) {
                if (animal.faction === 'HOSTILE') {
                    const dist = Math.sqrt(Math.pow(struct.x - animal.x, 2) + Math.pow(struct.y - animal.y, 2));
                    if (dist < 20) {
                        animal.health -= 50; // Massive damage
                        struct.isTriggered = true;
                        struct.durability! -= 1;
                        animal.debugState = 'HIT BY TRAP!';
                        break;
                    }
                }
            }
        }
    }
  }
}
