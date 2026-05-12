import { Survivor } from '../entities/Survivor';
import { ResourceNode, resourceToItemMap, ResourceType } from '../entities/ResourceNode';
import { Structure, createStructure } from '../entities/Structure';
import { TimeState } from '../systems/TimeSystem';
import { ProgressionSystem } from '../systems/ProgressionSystem';
import { recipes } from '../data/recipes';
import { structureData } from '../data/structures';
import { Animal } from '../entities/Animal';
import { itemData } from '../data/items';
import { World } from '../game/world';

export class SurvivorBrain {
  public decideTask(
    survivor: Survivor,
    resources: ResourceNode[],
    structures: Structure[],
    animals: Animal[],
    time: TimeState,
    progression: ProgressionSystem,
    allSurvivors: Survivor[],
    world?: World,
    discovered?: boolean[][]
  ): void {
    const hungerThreshold = 50;
    const isHungry = survivor.stats.hunger < hungerThreshold;
    const foodItemIds = Object.values(itemData).filter(i => i.type === 'FOOD').map(i => i.id);
    const hasFoodInInventory = foodItemIds.some(id => (survivor.inventory[id] || 0) > 0);
    const isMoraleLow = survivor.stats.morale < 30;
    const preservePlayerDebug = survivor.debugState.startsWith('Player');

    // 0. Danger: Combat
    const hostileAnimals = animals.filter(a => a.faction === 'HOSTILE');
    if (hostileAnimals.length > 0) {
        let closestAnimal = hostileAnimals[0];
        let minDist = Infinity;

        for (const a of hostileAnimals) {
            const d = Math.sqrt(Math.pow(survivor.x - a.x, 2) + Math.pow(survivor.y - a.y, 2));
            if (d < minDist) {
                minDist = d;
                closestAnimal = a;
            }
        }
        
        const dangerDistance = 120 * (0.7 + survivor.personality.bravery * 0.6); // 84..156
        if (minDist < dangerDistance) {
            const hasCampfire = structures.some(s => s.type === 'campfire' && s.isComplete);
            if (hasCampfire) {
                survivor.currentTask = { type: 'FIGHT', targetId: closestAnimal.id };
                survivor.debugState = `Task: FIGHT | Target: ${closestAnimal.type}`;
            } else {
                survivor.currentTask = { type: 'FLEE', targetId: closestAnimal.id };
                survivor.debugState = `Task: FLEE | Danger: ${closestAnimal.type}`;
            }
            return;
        }
    }

    // 0.5 Utility: Equip Tools & Torches
    // Always try to equip the best weapon if we have one and we aren't starving
    const weapons = ['crystal_spear', 'bone_club', 'axe', 'torch'];
    let bestWeaponToEquip = null;
    for (const w of weapons) {
        if ((survivor.inventory[w] || 0) > 0) {
            bestWeaponToEquip = w;
            break;
        }
    }

    if (time.phase === 'NIGHT' && (!survivor.equippedTool || survivor.equippedTool.id !== 'torch') && (survivor.inventory['torch'] || 0) > 0) {
        survivor.currentTask = { type: 'EQUIP', itemId: 'torch' };
        survivor.debugState = 'Task: EQUIP | Reason: Need Light';
        return;
    }

    if (time.phase !== 'NIGHT' && bestWeaponToEquip && (!survivor.equippedTool || survivor.equippedTool.id !== bestWeaponToEquip)) {
        survivor.currentTask = { type: 'EQUIP', itemId: bestWeaponToEquip };
        survivor.debugState = `Task: EQUIP | Reason: Equip ${bestWeaponToEquip}`;
        return;
    }

    // Un-equip torch in morning to save durability (or just auto-swap to best tool)
    if (time.phase === 'MORNING' && survivor.equippedTool?.id === 'torch') {
        if (bestWeaponToEquip) {
            survivor.currentTask = { type: 'EQUIP', itemId: bestWeaponToEquip };
            survivor.debugState = 'Task: EQUIP | Reason: Morning swap';
            return;
        }
    }

    // 1. Survival: Eat
    if (isHungry && hasFoodInInventory) {
        survivor.currentTask = { type: 'EAT_FOOD' };
        survivor.debugState = `Task: EAT_FOOD | Reason: Hunger ${Math.floor(survivor.stats.hunger)}`;
        return;
    }

    // 1.5 Survival: Relax (Low Morale)
    if (isMoraleLow) {
        const hasCampfire = structures.some(s => s.type === 'campfire' && s.isComplete);
        if (hasCampfire) {
            survivor.currentTask = { type: 'RELAX' };
            survivor.debugState = 'Task: RELAX | Reason: Low Morale';
            return;
        }
    }

    // 2. Survival: Harvest Farm Food
    if (isHungry && !hasFoodInInventory) {
      const target = structures.find(
        s =>
          s.type === 'farm_plot' &&
          s.isComplete &&
          (s.inventory?.['vegetable'] || 0) > 0 &&
          !allSurvivors.some(other => other.id !== survivor.id && other.currentTask?.targetId === s.id)
      );
      if (target) {
        survivor.currentTask = { type: 'HARVEST_FARM', targetId: target.id };
        survivor.debugState = `Task: HARVEST_FARM | Reason: Hungry | Target: ${target.id}`;
        return;
      }
    }

    // 2. Survival: Gather Food
    if (isHungry && !hasFoodInInventory) {
      // Avoid targeting the same resource as another survivor
      const target = resources.find(r => 
          r.type === 'BERRY_BUSH' && 
          r.amount > 0 && 
          !allSurvivors.some(s => s.id !== survivor.id && s.currentTask?.targetId === r.id)
      );
      if (target) {
        survivor.currentTask = { type: 'GATHER_FOOD', targetId: target.id };
        survivor.debugState = `Task: GATHER_FOOD | Reason: Starving | Target: ${target.id}`;
        return;
      }
    }

    // 3. Infrastructure: Campfire, Workbench, Chest, or Wall
    const hasCampfire = structures.some(s => s.type === 'campfire' && s.isComplete);
    const hasWorkbench = structures.some(s => s.type === 'workbench' && s.isComplete);
    const hasChest = structures.some(s => s.type === 'chest' && s.isComplete);
    const hasFarmPlot = structures.some(s => s.type === 'farm_plot' && s.isComplete);
    const wallCount = structures.filter(s => s.type === 'wall' && s.isComplete).length;

    if (time.phase === 'AFTERNOON') {
        const targetStructure = !hasCampfire
          ? 'campfire'
          : !hasWorkbench
            ? 'workbench'
            : !hasChest
              ? 'chest'
              : !hasFarmPlot
                ? 'farm_plot'
                : wallCount < 4
                  ? 'wall'
                  : null;
        
        if (targetStructure) {
            // Check if there is an incomplete structure of this type already
            const incomplete = structures.find(s => s.type === targetStructure && !s.isComplete);
            
            if (incomplete) {
                survivor.currentTask = { type: 'BUILD', targetId: incomplete.id, progress: 0 };
                survivor.debugState = `Task: BUILD | Target: Incomplete ${incomplete.type}`;
                return;
            }

            const data = structureData[targetStructure];
            const canBuild = data.ingredients.every(ing => (survivor.inventory[ing.itemId] || 0) >= ing.amount);
            
            if (canBuild) {
                survivor.currentTask = { type: 'BUILD', structureId: targetStructure, progress: 0 };
                survivor.debugState = `Task: BUILD | Reason: Expanding Base | Target: ${data.name}`;
                return;
            } else {
                const missing = data.ingredients.find(ing => (survivor.inventory[ing.itemId] || 0) < ing.amount);
                if (missing) {
                    const resourceType = missing.itemId === 'wood' ? 'TREE' : 'STONE';
                    const target = resources.find(r => r.type === resourceType && r.amount > 0);
                    if (target) {
                        survivor.currentTask = { type: 'GATHER_MATERIAL', targetId: target.id };
                        survivor.debugState = `Task: GATHER_MATERIAL | Reason: Need ${missing.itemId} | Target: ${target.id}`;
                        return;
                    }
                }
            }
        }
    }

    // 3.5 Storage: Store excess materials
    const materialCount = (survivor.inventory['wood'] || 0) + (survivor.inventory['stone'] || 0);
    if (hasChest && materialCount > 3) {
        const chest = structures.find(s => s.type === 'chest' && s.isComplete);
        if (chest) {
            survivor.currentTask = { type: 'STORE', targetId: chest.id };
            survivor.debugState = 'Task: STORE | Reason: Inventory full';
            return;
        }
    }

    // 4. Crafting: Axe
    const hasAxe = (survivor.inventory['axe'] || 0) > 0 || survivor.equippedTool?.id === 'axe';
    if (!hasAxe && !isHungry && progression.isRecipeUnlocked('craft_axe')) {
        const axeRecipe = recipes.find(r => r.resultId === 'axe');
        if (axeRecipe) {
            const canCraft = axeRecipe.ingredients.every(ing => (survivor.inventory[ing.itemId] || 0) >= ing.amount);
            if (canCraft) {
                survivor.currentTask = { type: 'CRAFT', recipeId: axeRecipe.id };
                survivor.debugState = 'Task: CRAFT | Reason: Need tools | Target: Stone Axe';
                return;
            }
        }
    }

    // 5. Proactive Gathering
    if (survivor.stats.hunger < 90 && !hasFoodInInventory) {
        const target = resources.find(r => 
            (r.type === 'BERRY_BUSH' || r.type === 'FERN_BUSH') && 
            r.amount > 0 &&
            !allSurvivors.some(s => s.id !== survivor.id && s.currentTask?.targetId === r.id)
        );
        if (target) {
            survivor.currentTask = { type: 'GATHER_FOOD', targetId: target.id };
            survivor.debugState = `Task: GATHER_FOOD | Reason: Stockpiling | Target: ${target.id}`;
            return;
        }
    }

    // 5.5 Exploration: Scout undiscovered tiles
    if ((time.phase === 'MORNING' || time.phase === 'AFTERNOON') && world && discovered && survivor.scoutCooldown <= 0) {
      const { widthTiles, heightTiles, tileSize, originX, originY } = world.config;
      let best: { x: number; y: number; d2: number } | null = null;

      for (let ty = 0; ty < heightTiles; ty++) {
        for (let tx = 0; tx < widthTiles; tx++) {
          if (discovered[ty]?.[tx] === true) continue;

          // Prefer frontier tiles: unknown tile adjacent to a known tile.
          const hasKnownNeighbor =
            discovered[ty]?.[tx - 1] === true ||
            discovered[ty]?.[tx + 1] === true ||
            discovered[ty - 1]?.[tx] === true ||
            discovered[ty + 1]?.[tx] === true;
          if (!hasKnownNeighbor) continue;

          const wx = originX + tx * tileSize + tileSize / 2;
          const wy = originY + ty * tileSize + tileSize / 2;
          const dx = survivor.x - wx;
          const dy = survivor.y - wy;
          const d2 = dx * dx + dy * dy;

          if (!best || d2 < best.d2) best = { x: wx, y: wy, d2 };
        }
      }

      if (best) {
        survivor.currentTask = { type: 'SCOUT', targetX: best.x, targetY: best.y };
        survivor.scoutCooldown = 120;
        if (!preservePlayerDebug) {
          survivor.debugState = 'Task: SCOUT | Reason: Explore';
        }
        return;
      }
    }

    // Default Idle
    if (survivor.currentTask?.type !== 'IDLE') {
        survivor.currentTask = { type: 'IDLE' };
        const aiReason = 'Reason: No urgent needs';
        survivor.debugState = survivor.debugState.startsWith('Player') 
            ? `${survivor.debugState} | AI: IDLE` 
            : `Task: IDLE | ${aiReason}`;
    }
  }

  private moveSurvivor(survivor: Survivor, animals: Animal[], tx: number, ty: number, baseSpeed: number = 2.0): void {
    const dx = tx - survivor.x;
    const dy = ty - survivor.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 5) return;

    let speed = baseSpeed;
    let moveTarget: { x: number, y: number } = survivor;

    if (survivor.mountedAnimalId) {
        const animal = animals.find(a => a.id === survivor.mountedAnimalId);
        if (animal) {
            speed *= 2.0; // Double speed when mounted
            moveTarget = animal;
        }
    }

    moveTarget.x += (dx / dist) * speed;
    moveTarget.y += (dy / dist) * speed;
    
    // Sync survivor position immediately to avoid jitter
    survivor.x = moveTarget.x;
    survivor.y = moveTarget.y;
  }

  public executeTask(survivor: Survivor, resources: ResourceNode[], structures: Structure[], animals: Animal[]): void {
     if (!survivor.currentTask) return;

     switch (survivor.currentTask.type) {
        case 'GATHER_FOOD': {
            const target = resources.find(r => r.id === survivor.currentTask?.targetId);
            if (target && target.amount > 0) {
                const dist = Math.sqrt(Math.pow(survivor.x - target.x, 2) + Math.pow(survivor.y - target.y, 2));
                if (dist < 20) {
                    target.amount -= 1;
                    const itemId = resourceToItemMap[target.type] || 'item';
                    survivor.inventory[itemId] = (survivor.inventory[itemId] || 0) + 1;
                    survivor.debugState = `Gathered ${itemId}. Inventory: ${survivor.inventory[itemId]}`;
                    survivor.currentTask = null; 
                } else {
                    this.moveSurvivor(survivor, animals, target.x, target.y);
                }
            } else { survivor.currentTask = null; }
            break;
        }
        case 'GATHER_MATERIAL': {
            const target = resources.find(r => r.id === survivor.currentTask?.targetId);
            if (target && target.amount > 0) {
                const dist = Math.sqrt(Math.pow(survivor.x - target.x, 2) + Math.pow(survivor.y - target.y, 2));
                if (dist < 20) {
                    target.amount -= 1;
                    const itemId = resourceToItemMap[target.type] || 'item';
                    survivor.inventory[itemId] = (survivor.inventory[itemId] || 0) + 1;
                    
                    if (survivor.equippedTool) {
                        survivor.equippedTool.durability -= 5;
                        if (survivor.equippedTool.durability <= 0) {
                            survivor.debugState = `Tool ${survivor.equippedTool.id} broke!`;
                            survivor.equippedTool = null;
                            survivor.currentTask = null;
                            return;
                        }
                    }
                    survivor.debugState = `Gathered ${itemId}. Inventory: ${survivor.inventory[itemId]}`;
                    survivor.currentTask = null; 
                } else {
                    this.moveSurvivor(survivor, animals, target.x, target.y);
                }
            } else { survivor.currentTask = null; }
            break;
        }
        case 'BUILD': {
            const target = structures.find(s => s.id === survivor.currentTask?.targetId);
            if (target && !target.isComplete) {
                const dist = Math.sqrt(Math.pow(survivor.x - target.x, 2) + Math.pow(survivor.y - target.y, 2));
                if (dist < 30) {
                    target.constructionProgress += 1;
                    survivor.debugState = `Building ${target.type}... ${target.constructionProgress}%`;
                    if (target.constructionProgress >= 100) {
                        target.isComplete = true;
                        survivor.currentTask = null;
                        survivor.debugState = `Finished building ${target.type}`;
                    }
                } else {
                    this.moveSurvivor(survivor, animals, target.x, target.y);
                }
            } else { survivor.currentTask = null; }
            break;
        }
        case 'HARVEST_FARM': {
            const target = structures.find(s => s.id === survivor.currentTask?.targetId);
            if (target && target.type === 'farm_plot' && target.isComplete && (target.inventory?.['vegetable'] || 0) >= 1) {
                const dist = Math.sqrt(Math.pow(survivor.x - target.x, 2) + Math.pow(survivor.y - target.y, 2));
                if (dist < 30) {
                    target.inventory!['vegetable'] -= 1;
                    survivor.inventory['vegetable'] = (survivor.inventory['vegetable'] || 0) + 1;
                    survivor.debugState = `Harvested vegetable. Inventory: ${survivor.inventory['vegetable']}`;
                    survivor.currentTask = null;
                } else {
                    this.moveSurvivor(survivor, animals, target.x, target.y);
                }
            } else { survivor.currentTask = null; }
            break;
        }
        case 'SCOUT': {
            const tx = survivor.currentTask.targetX!;
            const ty = survivor.currentTask.targetY!;
            const dist = Math.sqrt(Math.pow(survivor.x - tx, 2) + Math.pow(survivor.y - ty, 2));
            
            if (dist < 10) {
              survivor.scoutCooldown = 500;
              survivor.currentTask = null;
              break;
            }

            this.moveSurvivor(survivor, animals, tx, ty, 2.0);
            break;
        }
        case 'STORE': {
            const target = structures.find(s => s.id === survivor.currentTask?.targetId);
            if (target && target.type === 'chest' && target.isComplete) {
                const dist = Math.sqrt(Math.pow(survivor.x - target.x, 2) + Math.pow(survivor.y - target.y, 2));
                if (dist < 30) {
                    // Deposit all materials
                    for (const itemId in survivor.inventory) {
                        const item = itemData[itemId];
                        if (item && item.type === 'MATERIAL') {
                            const amount = survivor.inventory[itemId];
                            target.inventory![itemId] = (target.inventory![itemId] || 0) + amount;
                            survivor.inventory[itemId] = 0;
                        }
                    }
                    survivor.debugState = 'Stored materials in chest';
                    survivor.currentTask = null;
                } else {
                    this.moveSurvivor(survivor, animals, target.x, target.y);
                }
            } else { survivor.currentTask = null; }
            break;
        }
        case 'EAT_FOOD': {
            const foodItemIds = Object.values(itemData)
              .filter(i => i.type === 'FOOD')
              .map(i => i.id);
            const foodId = foodItemIds.find(id => (survivor.inventory[id] || 0) > 0);
            if (foodId) {
                survivor.inventory[foodId] -= 1;
                const recovery = itemData[foodId].stats?.hungerRecover || 20;
                survivor.stats.hunger = Math.min(survivor.stats.maxHunger, survivor.stats.hunger + recovery);
                survivor.debugState = `Ate ${foodId}. Hunger: ${Math.round(survivor.stats.hunger)}`;
            }
            survivor.currentTask = null;
            break;
        }
        case 'EQUIP': {
            const itemId = survivor.currentTask.itemId!;
            const item = itemData[itemId];
            if (item && (survivor.inventory[itemId] || 0) > 0) {
                if (survivor.equippedTool) {
                    survivor.inventory[survivor.equippedTool.id] = (survivor.inventory[survivor.equippedTool.id] || 0) + 1;
                }
                survivor.equippedTool = { id: itemId, durability: item.stats?.durability || 100 };
                survivor.inventory[itemId] -= 1;
                survivor.debugState = `Equipped ${item.name}`;
            }
            survivor.currentTask = null;
            break;
        }
        case 'RELAX': {
            const target = structures.find(s => s.id === survivor.currentTask?.targetId);
            if (target && target.isComplete) {
                const dist = Math.sqrt(Math.pow(survivor.x - target.x, 2) + Math.pow(survivor.y - target.y, 2));
                if (dist > 40) {
                    this.moveSurvivor(survivor, animals, target.x, target.y);
                } else {
                    survivor.debugState = 'Relaxing by Campfire';
                    survivor.stats.morale = Math.min(survivor.stats.maxMorale, survivor.stats.morale + 0.3);
                    if (survivor.stats.morale >= 90) {
                        survivor.currentTask = null;
                    }
                }
            } else {
                survivor.currentTask = null;
            }
            break;
        }
        case 'CRAFT': {
            const rId = survivor.currentTask.recipeId!;
            const recipe = recipes.find(r => r.id === rId);
            if (recipe) {
                recipe.ingredients.forEach(ing => {
                    survivor.inventory[ing.itemId] -= ing.amount;
                });
                survivor.inventory[recipe.resultId] = (survivor.inventory[recipe.resultId] || 0) + recipe.amount;
                survivor.debugState = `Crafted ${recipe.resultId}!`;
            }
            survivor.currentTask = null;
            break;
        }
        case 'FIGHT': {
            const target = animals.find(a => a.id === survivor.currentTask?.targetId);
            if (target) {
                const dist = Math.sqrt(Math.pow(survivor.x - target.x, 2) + Math.pow(survivor.y - target.y, 2));
                if (dist < 40) {
                    let totalAttack = survivor.stats.attackPower;
                    if (survivor.equippedTool) {
                        const toolStats = itemData[survivor.equippedTool.id]?.stats;
                        if (toolStats && toolStats.attackPower) {
                            totalAttack += toolStats.attackPower;
                        }
                        survivor.equippedTool.durability -= 2;
                        if (survivor.equippedTool.durability <= 0) {
                            survivor.debugState = `Weapon ${survivor.equippedTool.id} broke!`;
                            survivor.equippedTool = null;
                        }
                    }
                    
                    target.health -= totalAttack;
                    survivor.debugState = `Fighting ${target.type}. Animal HP: ${Math.round(target.health)}`;
                    if (target.health <= 0) {
                        survivor.debugState = `Defeated ${target.type}!`;
                        survivor.currentTask = null;
                    }
                } else {
                    this.moveSurvivor(survivor, animals, target.x, target.y, 2.5);
                }
            } else { survivor.currentTask = null; }
            break;
        }
        case 'FLEE': {
            const target = animals.find(a => a.id === survivor.currentTask?.targetId);
            if (target) {
                const dx = survivor.x - target.x;
                const dy = survivor.y - target.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist > 150) {
                    survivor.currentTask = null;
                } else {
                    this.moveSurvivor(survivor, animals, survivor.x + (dx > 0 ? 50 : -50), survivor.y + (dy > 0 ? 50 : -50), 3.0);
                    survivor.debugState = `Fleeing from ${target.type}!`;
                }
            } else { survivor.currentTask = null; }
            break;
        }
        case 'IDLE':
            break;
     }
  }
}
