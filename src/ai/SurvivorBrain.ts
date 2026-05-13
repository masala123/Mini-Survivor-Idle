import { Survivor } from '../entities/Survivor';
import { ResourceNode, resourceToItemMap } from '../entities/ResourceNode';
import { Structure, createStructure } from '../entities/Structure';
import { TimeState } from '../systems/TimeSystem';
import { ProgressionSystem } from '../systems/ProgressionSystem';
import { recipes } from '../data/recipes';
import { structureData } from '../data/structures';
import { Animal } from '../entities/Animal';
import { itemData } from '../data/items';
import { World } from '../game/world';

import { ColonyFocus } from '../systems/GovernanceSystem';

export class SurvivorBrain {
  private getInventoryWeight(survivor: Survivor): number {
    let weight = 0;
    for (const itemId in survivor.inventory) {
        weight += survivor.inventory[itemId];
    }
    return weight;
  }

  public decideTask(
    survivor: Survivor,
    resources: ResourceNode[],
    structures: Structure[],
    animals: Animal[],
    time: TimeState,
    progression: ProgressionSystem,
    allSurvivors: Survivor[],
    world?: World,
    discovered?: boolean[][],
    focus: ColonyFocus = 'BALANCED'
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
    const gearPriority = ['crystal_spear', 'bone_club', 'axe', 'torch'];
    let bestAvailableGear = null;
    for (const item of gearPriority) {
        if ((survivor.inventory[item] || 0) > 0 || survivor.equippedTool?.id === item) {
            bestAvailableGear = item;
            break;
        }
    }

    if (time.phase === 'NIGHT') {
        const hasTorch = survivor.equippedTool?.id === 'torch' || (survivor.inventory['torch'] || 0) > 0;
        if (hasTorch && survivor.equippedTool?.id !== 'torch') {
            survivor.currentTask = { type: 'EQUIP', itemId: 'torch' };
            survivor.debugState = 'Task: EQUIP | Reason: Night Light';
            return;
        }
    }

    if (time.phase !== 'NIGHT' && bestAvailableGear && survivor.equippedTool?.id !== bestAvailableGear) {
        survivor.currentTask = { type: 'EQUIP', itemId: bestAvailableGear };
        survivor.debugState = `Task: EQUIP | Reason: Best Gear (${bestAvailableGear})`;
        return;
    }

    // 1. Survival: Eat
    if (isHungry && hasFoodInInventory) {
        survivor.currentTask = { type: 'EAT_FOOD' };
        survivor.debugState = `Task: EAT_FOOD | Reason: Hunger ${Math.floor(survivor.stats.hunger)}`;
        return;
    }

    // 1.5 Survival: Relax (Low Morale)
    if (isMoraleLow) {
        const campfire = structures.find(s => s.type === 'campfire' && s.isComplete);
        if (campfire) {
            survivor.currentTask = { type: 'RELAX', targetId: campfire.id };
            survivor.debugState = 'Task: RELAX | Reason: Low Morale';
            return;
        }
    }

    // --- WORK & LOGISTICS (ORDERED BY ROLE + GLOBAL FOCUS) ---
    const rolePriority = {
        'GENERALIST': ['SURVIVAL_GATHER', 'BUILDING', 'LOGISTICS', 'PROACTIVE_GATHER'],
        'GATHERER': ['SURVIVAL_GATHER', 'PROACTIVE_GATHER', 'BUILDING', 'LOGISTICS'],
        'BUILDER': ['BUILDING', 'SURVIVAL_GATHER', 'LOGISTICS', 'PROACTIVE_GATHER'],
        'LOGISTICS': ['LOGISTICS', 'BUILDING', 'SURVIVAL_GATHER', 'PROACTIVE_GATHER']
    };

    let priorities = [...rolePriority[survivor.role]];

    if (focus === 'SURVIVAL') {
        priorities = priorities.filter(p => p !== 'SURVIVAL_GATHER');
        priorities.unshift('SURVIVAL_GATHER');
    } else if (focus === 'EXPANSION') {
        priorities = priorities.filter(p => p !== 'BUILDING');
        priorities.unshift('BUILDING');
    } else if (focus === 'LOGISTICS') {
        priorities = priorities.filter(p => p !== 'LOGISTICS');
        priorities.unshift('LOGISTICS');
    }

    for (const p of priorities) {
        if (p === 'SURVIVAL_GATHER') {
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

            if (isHungry && !hasFoodInInventory) {
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
        }

        if (p === 'BUILDING') {
            const hasCampfire = structures.some(s => s.type === 'campfire' && s.isComplete);
            const hasWorkbench = structures.some(s => s.type === 'workbench' && s.isComplete);
            const hasChest = structures.some(s => s.type === 'chest' && s.isComplete);
            const hasFarmPlot = structures.some(s => s.type === 'farm_plot' && s.isComplete);
            const wallCount = structures.filter(s => s.type === 'wall' && s.isComplete).length;

            if (time.phase === 'AFTERNOON' || (survivor.role === 'BUILDER' && time.phase !== 'NIGHT')) {
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
                        survivor.debugState = `Task: BUILD | Target: ${data.name}`;
                        return;
                    } else {
                        const missing = data.ingredients.find(ing => (survivor.inventory[ing.itemId] || 0) < ing.amount);
                        if (missing) {
                            const resourceType = missing.itemId === 'wood' ? 'TREE' : 'STONE';
                            const target = resources.find(r => r.type === resourceType && r.amount > 0);
                            if (target) {
                                survivor.currentTask = { type: 'GATHER_MATERIAL', targetId: target.id };
                                survivor.debugState = `Task: GATHER_MATERIAL | Reason: Need ${missing.itemId}`;
                                return;
                            }
                        }
                    }
                }
            }
        }

        if (p === 'LOGISTICS') {
            const hasChest = structures.some(s => s.type === 'chest' && s.isComplete);
            const materialCount = (survivor.inventory['wood'] || 0) + (survivor.inventory['stone'] || 0);
            if (hasChest && (materialCount > 3 || survivor.role === 'LOGISTICS')) {
                const chest = structures.find(s => s.type === 'chest' && s.isComplete);
                if (chest && materialCount > 0) {
                    survivor.currentTask = { type: 'STORE', targetId: chest.id };
                    survivor.debugState = 'Task: STORE | Reason: Inventory Management';
                    return;
                }
            }

            if (!isHungry && !isMoraleLow) {
                const woodShed = structures.find(s => s.type === 'wood_shed' && s.isComplete);
                const stoneMason = structures.find(s => s.type === 'stone_mason' && s.isComplete);
                const genericChests = structures.filter(s => s.type === 'chest' && s.isComplete);
                const furnace = structures.find(s => s.type === 'furnace' && s.isComplete);
                const smelter = structures.find(s => s.type === 'electric_smelter' && s.isComplete);
                const generator = structures.find(s => s.type === 'coal_generator' && s.isComplete);

                if (generator && (generator.inventory?.['wood'] || 0) < 5) {
                    if ((survivor.inventory['wood'] || 0) > 0) {
                        survivor.currentTask = { type: 'HAUL', targetId: generator.id, itemId: 'wood' };
                        survivor.debugState = 'Task: HAUL | Fuel Generator';
                        return;
                    }
                }

                const refinery = smelter || furnace;
                if (refinery) {
                    if ((refinery.inventory?.['refined_fossil'] || 0) > 0) {
                        survivor.currentTask = { type: 'HAUL', sourceId: refinery.id, targetId: hasChest ? structures.find(s => s.type === 'chest')!.id : undefined };
                        survivor.debugState = `Task: HAUL | Empty ${refinery.type}`;
                        return;
                    }
                    const needsFossil = (refinery.inventory?.['fossil'] || 0) < 5;
                    if (needsFossil && (survivor.inventory['fossil'] || 0) > 0) {
                        survivor.currentTask = { type: 'HAUL', targetId: refinery.id, itemId: 'fossil' };
                        survivor.debugState = `Task: HAUL | Supply ${refinery.type}`;
                        return;
                    }
                }

                if (woodShed && (survivor.inventory['wood'] || 0) > 0) {
                    survivor.currentTask = { type: 'HAUL', targetId: woodShed.id };
                    survivor.debugState = 'Task: HAUL | Reason: Sort wood';
                    return;
                }
                if (stoneMason && (survivor.inventory['stone'] || 0) > 0) {
                    survivor.currentTask = { type: 'HAUL', targetId: stoneMason.id };
                    survivor.debugState = 'Task: HAUL | Reason: Sort stone';
                    return;
                }

                for (const chest of genericChests) {
                    if (woodShed && (chest.inventory?.['wood'] || 0) > 0) {
                        survivor.currentTask = { type: 'HAUL', sourceId: chest.id, targetId: woodShed.id, itemId: 'wood' };
                        survivor.debugState = 'Task: HAUL | Sort Wood Shed';
                        return;
                    }
                    if (stoneMason && (chest.inventory?.['stone'] || 0) > 0) {
                        survivor.currentTask = { type: 'HAUL', sourceId: chest.id, targetId: stoneMason.id, itemId: 'stone' };
                        survivor.debugState = 'Task: HAUL | Sort Stone Mason';
                        return;
                    }
                }
            }
        }

        if (p === 'PROACTIVE_GATHER') {
            if (survivor.stats.hunger < 90 && !hasFoodInInventory) {
                const target = resources.find(r => 
                    (r.type === 'BERRY_BUSH' || r.type === 'FERN_BUSH') && 
                    r.amount > 0 &&
                    !allSurvivors.some(s => s.id !== survivor.id && s.currentTask?.targetId === r.id)
                );
                if (target) {
                    survivor.currentTask = { type: 'GATHER_FOOD', targetId: target.id };
                    survivor.debugState = `Task: GATHER_FOOD | Reason: Stockpiling`;
                    return;
                }
            }
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
                survivor.debugState = 'Task: CRAFT | Stone Axe';
                return;
            }
        }
    }

    // 5.5 Exploration: Scout undiscovered tiles
    if ((time.phase === 'MORNING' || time.phase === 'AFTERNOON') && world && discovered && survivor.scoutCooldown <= 0) {
      const { widthTiles, heightTiles, tileSize, originX, originY } = world.config;
      let best: { x: number; y: number; d2: number } | null = null;

      for (let ty = 0; ty < heightTiles; ty++) {
        for (let tx = 0; tx < widthTiles; tx++) {
          if (discovered[ty]?.[tx] === true) continue;

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
            const tId = survivor.currentTask?.targetId;
            const sId = survivor.currentTask?.structureId;
            let target = structures.find(s => s.id === tId);

            if (!target && sId) {
                const data = structureData[sId];
                if (data) {
                    for (const ing of data.ingredients) {
                        survivor.inventory[ing.itemId] = (survivor.inventory[ing.itemId] || 0) - ing.amount;
                    }
                    const offsetX = (Math.random() - 0.5) * 40;
                    const offsetY = (Math.random() - 0.5) * 40;
                    target = createStructure(`${sId}_${Date.now()}`, sId, survivor.x + offsetX, survivor.y + offsetY, false);
                    structures.push(target);
                    survivor.currentTask!.targetId = target.id;
                    survivor.debugState = `Placed blueprint for ${data.name}`;
                }
            }

            if (target && !target.isComplete) {
                const dist = Math.sqrt(Math.pow(survivor.x - target.x, 2) + Math.pow(survivor.y - target.y, 2));
                if (dist < 30) {
                    target.constructionProgress += 20; 
                    survivor.debugState = `Building ${target.type}... ${target.constructionProgress}%`;
                    if (target.constructionProgress >= 100) {
                        target.isComplete = true;
                        target.constructionProgress = 100;
                        survivor.currentTask = null;
                        survivor.debugState = `Finished building ${target.type}`;
                    }
                } else {
                    this.moveSurvivor(survivor, animals, target.x, target.y);
                }
            } else if (!sId) {
                 survivor.currentTask = null; 
            }
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
        case 'HAUL': {
            const sId = survivor.currentTask?.sourceId;
            const tId = survivor.currentTask?.targetId;
            const itemId = survivor.currentTask?.itemId; 
            
            const target = structures.find(s => s.id === tId);
            if (!target || !target.isComplete) {
                survivor.currentTask = null;
                break;
            }

            if (sId) {
                const source = structures.find(s => s.id === sId);
                if (!source || !source.isComplete || !source.inventory) {
                    survivor.currentTask = null;
                    break;
                }

                const distSource = Math.sqrt(Math.pow(survivor.x - source.x, 2) + Math.pow(survivor.y - source.y, 2));
                if (distSource > 20) {
                    this.moveSurvivor(survivor, animals, source.x, source.y);
                    survivor.debugState = `Moving to source: ${source.type}`;
                } else {
                    const key = itemId || Object.keys(source.inventory).find(k => source.inventory![k] > 0);
                    if (key && source.inventory[key] > 0) {
                        const amount = source.inventory[key];
                        survivor.inventory[key] = (survivor.inventory[key] || 0) + amount;
                        source.inventory[key] = 0;
                        survivor.debugState = `Took ${key} from ${source.type}`;
                        survivor.currentTask!.sourceId = undefined; 
                    } else {
                        survivor.currentTask = null;
                    }
                }
            } else {
                const distTarget = Math.sqrt(Math.pow(survivor.x - target.x, 2) + Math.pow(survivor.y - target.y, 2));
                if (distTarget > 20) {
                    this.moveSurvivor(survivor, animals, target.x, target.y);
                    survivor.debugState = `Hauling to ${target.type}`;
                } else {
                    const itemsToStore = target.type === 'wood_shed' ? ['wood'] : (target.type === 'stone_mason' ? ['stone'] : (target.type === 'coal_generator' ? ['wood'] : ['wood', 'stone', 'fossil', 'refined_fossil']));
                    let storedAny = false;
                    for (const key of itemsToStore) {
                        const amount = survivor.inventory[key] || 0;
                        if (amount > 0) {
                            if (!target.inventory) target.inventory = {};
                            target.inventory[key] = (target.inventory[key] || 0) + amount;
                            survivor.inventory[key] = 0;
                            storedAny = true;
                        }
                    }
                    survivor.debugState = storedAny ? `Deposited materials in ${target.type}` : 'Hauling finished';
                    survivor.currentTask = null;
                }
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
