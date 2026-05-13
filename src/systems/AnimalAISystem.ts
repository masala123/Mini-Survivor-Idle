import { Animal } from '../entities/Animal';
import { ResourceNode } from '../entities/ResourceNode';
import { Survivor } from '../entities/Survivor';

export class AnimalAISystem {
  public tick(animals: Animal[], resources: ResourceNode[], survivors: Survivor[]): void {
    for (const animal of animals) {
      if (!animal.currentTask || animal.currentTask.type === 'WANDER') {
        this.decideTask(animal, resources, survivors, animals);
      }
      this.executeTask(animal, resources, survivors, animals);
    }
  }

  private decideTask(animal: Animal, resources: ResourceNode[], survivors: Survivor[], allAnimals: Animal[]): void {
    // 1. Hostile AI: Hunt survivors or other animals
    if (animal.faction === 'HOSTILE') {
        // Target nearest potential prey (survivors or neutral animals)
        let nearestPrey: { id: string, x: number, y: number } | null = null;
        let minDist = 300; // Hunting range

        for (const s of survivors) {
            const d = Math.sqrt(Math.pow(animal.x - s.x, 2) + Math.pow(animal.y - s.y, 2));
            if (d < minDist) {
                minDist = d;
                nearestPrey = { id: s.id, x: s.x, y: s.y };
            }
        }

        for (const a of allAnimals) {
            if (a.faction === 'NEUTRAL') {
                const d = Math.sqrt(Math.pow(animal.x - a.x, 2) + Math.pow(animal.y - a.y, 2));
                if (d < minDist) {
                    minDist = d;
                    nearestPrey = { id: a.id, x: a.x, y: a.y };
                }
            }
        }

        if (nearestPrey) {
            animal.currentTask = { type: 'HUNT', targetId: nearestPrey.id };
            animal.debugState = `Hunting ${nearestPrey.id}`;
            return;
        }
    }

    // 2. Neutral AI: Graze
    if (animal.faction === 'NEUTRAL') {
        const bushes = resources.filter(r => (r.type === 'BERRY_BUSH' || r.type === 'FERN_BUSH') && r.amount > 0);
        if (bushes.length > 0) {
            let nearestBush = bushes[0];
            let minDist = Infinity;
            for (const b of bushes) {
                const d = Math.sqrt(Math.pow(animal.x - b.x, 2) + Math.pow(animal.y - b.y, 2));
                if (d < minDist) {
                    minDist = d;
                    nearestBush = b;
                }
            }

            if (minDist < 200) {
                animal.currentTask = { type: 'GRAZE', targetId: nearestBush.id };
                animal.debugState = 'Graze: Bush';
                return;
            }
        }
    }

    // 3. Tamed AI: Support Colony
    if (animal.faction === 'TAMED') {
        // Protect from nearby hostiles
        const hostiles = allAnimals.filter(a => a.faction === 'HOSTILE');
        if (hostiles.length > 0) {
            let nearestHostile = hostiles[0];
            let minDist = Infinity;
            for (const h of hostiles) {
                const d = Math.sqrt(Math.pow(animal.x - h.x, 2) + Math.pow(animal.y - h.y, 2));
                if (d < minDist) {
                    minDist = d;
                    nearestHostile = h;
                }
            }
            if (minDist < 250) {
                animal.currentTask = { type: 'FIGHT', targetId: nearestHostile.id };
                animal.debugState = `Protecting: ${nearestHostile.type}`;
                animal.targetId = nearestHostile.id;
                return;
            }
        }

        // Follow survivor
        const lead = survivors[0];
        if (lead) {
            const d = Math.sqrt(Math.pow(animal.x - lead.x, 2) + Math.pow(animal.y - lead.y, 2));
            if (d > 60) {
                animal.currentTask = { 
                    type: 'WANDER', 
                    targetId: null, 
                    targetX: lead.x + (Math.random() - 0.5) * 40,
                    targetY: lead.y + (Math.random() - 0.5) * 40
                };
                animal.debugState = 'Following';
                return;
            }
        }
    }

    // 3. Default: Wander
    if (Math.random() < 0.05) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 50;
        animal.currentTask = { 
            type: 'WANDER', 
            targetId: null, 
            targetX: animal.x + Math.cos(angle) * dist,
            targetY: animal.y + Math.sin(angle) * dist
        };
        animal.debugState = 'Wandering';
    }
  }

  private executeTask(animal: Animal, resources: ResourceNode[], survivors: Survivor[], allAnimals: Animal[]): void {
    if (!animal.currentTask) return;

    switch (animal.currentTask.type) {
        case 'WANDER': {
            const tx = animal.currentTask.targetX!;
            const ty = animal.currentTask.targetY!;
            const dx = tx - animal.x;
            const dy = ty - animal.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 5) {
                animal.currentTask = null;
            } else {
                const speed = 0.5;
                animal.x += (dx / dist) * speed;
                animal.y += (dy / dist) * speed;
            }
            break;
        }
        case 'GRAZE': {
            const target = resources.find(r => r.id === animal.currentTask?.targetId);
            if (!target || target.amount <= 0) {
                animal.currentTask = null;
                return;
            }

            const dx = target.x - animal.x;
            const dy = target.y - animal.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 10) {
                target.amount = Math.max(0, target.amount - 0.05); // Slow grazing
                animal.debugState = 'Grazing...';
                if (Math.random() < 0.01) animal.currentTask = null; // Finish grazing randomly
            } else {
                const speed = 0.8;
                animal.x += (dx / dist) * speed;
                animal.y += (dy / dist) * speed;
            }
            break;
        }
        case 'HUNT': {
            let target: { x: number, y: number, health?: number } | undefined = survivors.find(s => s.id === animal.currentTask?.targetId);
            if (!target) target = allAnimals.find(a => a.id === animal.currentTask?.targetId);

            if (!target || (target.health !== undefined && target.health <= 0)) {
                animal.currentTask = null;
                return;
            }

            const dx = target.x - animal.x;
            const dy = target.y - animal.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 20) {
                // Combat logic handled by CombatSystem, AI just stays on target
                animal.debugState = `Attacking target!`;
            } else {
                const speed = 1.2; // Hunting speed
                animal.x += (dx / dist) * speed;
                animal.y += (dy / dist) * speed;
            }
            break;
        }
    }
  }
}
