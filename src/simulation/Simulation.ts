import { Survivor, createSurvivor } from '../entities/Survivor';
import { ResourceNode, resourceToItemMap } from '../entities/ResourceNode';
import { SurvivorBrain } from '../ai/SurvivorBrain';
import { HungerSystem } from '../systems/HungerSystem';
import { TimeSystem } from '../systems/TimeSystem';
import { InteractionSystem, PlayerCommand } from '../systems/InteractionSystem';
import { ResourceSystem } from '../systems/ResourceSystem';
import { ProgressionSystem } from '../systems/ProgressionSystem';
import { WaveSystem } from '../systems/WaveSystem';
import { MoraleSystem } from '../systems/MoraleSystem';
import { WeatherSystem } from '../systems/WeatherSystem';
import { FarmingSystem } from '../systems/FarmingSystem';
import { EcosystemSystem } from '../systems/EcosystemSystem';
import { AnimalAISystem } from '../systems/AnimalAISystem';
import { RefinerySystem } from '../systems/RefinerySystem';
import { PowerSystem } from '../systems/PowerSystem';
import { GovernanceSystem } from '../systems/GovernanceSystem';
import { ScenarioId, ScenarioSystem } from '../systems/ScenarioSystem';

import { Structure } from '../entities/Structure';

import { Animal, createAnimal } from '../entities/Animal';
import { CombatSystem } from '../systems/CombatSystem';
import { structureData } from '../data/structures';
import { createStructure } from '../entities/Structure';
import { isPlacementValid } from '../game/placement';
import { World, createWorld } from '../game/world';
import { spawnInitialResources } from '../game/spawn';
import { Poi, spawnPois } from '../game/poi';
import { applyPoiReward } from '../game/poiRewards';
import { applyPoiWorldEffect } from '../game/poiEffects';

export class Simulation {
  public tickCount: number = 0;
  public survivors: Survivor[] = [];
  public resources: ResourceNode[] = [];
  public structures: Structure[] = [];
  public animals: Animal[] = [];
  public world: World;
  public discovered: boolean[][] = [];
  public pois: Poi[] = [];
  public discoveredPoiIds: Set<string> = new Set();
  public time: TimeSystem;
  public interaction: InteractionSystem;
  public progression: ProgressionSystem;
  public wave: WaveSystem;
  public moraleSystem: MoraleSystem;
  public weather: WeatherSystem;
  public power: PowerSystem;
  public governance: GovernanceSystem;
  public scenario: ScenarioSystem;
  public isGameOver: boolean = false;
  public isVictory: boolean = false;

  private brain: SurvivorBrain;
  private hungerSystem: HungerSystem;
  private resourceSystem: ResourceSystem;
  private combatSystem: CombatSystem;
  private farmingSystem: FarmingSystem;
  private ecosystemSystem: EcosystemSystem;
  private animalAISystem: AnimalAISystem;
  private refinerySystem: RefinerySystem;

  constructor() {
    this.brain = new SurvivorBrain();
    this.hungerSystem = new HungerSystem();
    this.time = new TimeSystem();
    this.interaction = new InteractionSystem();
    this.resourceSystem = new ResourceSystem();
    this.combatSystem = new CombatSystem();
    this.progression = new ProgressionSystem();
    this.wave = new WaveSystem();
    this.moraleSystem = new MoraleSystem();
    this.weather = new WeatherSystem();
    this.power = new PowerSystem();
    this.governance = new GovernanceSystem();
    this.scenario = new ScenarioSystem();
    this.farmingSystem = new FarmingSystem();
    this.ecosystemSystem = new EcosystemSystem();
    this.animalAISystem = new AnimalAISystem();
    this.refinerySystem = new RefinerySystem();
    this.world = createWorld(1337, 40, 30, 20);
    this.resetDiscovery();
    this.resetPois();
  }

  private resetDiscovery() {
    const { widthTiles, heightTiles } = this.world.config;
    this.discovered = Array.from({ length: heightTiles }, () => Array.from({ length: widthTiles }, () => false));
  }

  private resetPois() {
    this.pois = spawnPois(this.world, 8);
    this.discoveredPoiIds = new Set();
  }

  public initMockData(scenarioId: ScenarioId = 'FIRST_CAMP', unlockedRecipeIds: Iterable<string> = []) {
    this.tickCount = 0;
    this.isGameOver = false;
    this.isVictory = false;
    this.survivors = [];
    this.resources = [];
    this.structures = [];
    this.animals = [];
    this.time = new TimeSystem();
    this.weather = new WeatherSystem();
    this.power = new PowerSystem();
    this.governance = new GovernanceSystem();
    this.interaction = new InteractionSystem();
    this.progression = new ProgressionSystem();
    for (const recipeId of unlockedRecipeIds) {
      this.progression.unlockRecipe(recipeId);
    }
    this.survivors.push(createSurvivor('survivor_1', 0, 0, { bravery: 0.7, sociability: 0.6, neuroticism: 0.4 }));
    this.survivors.push(createSurvivor('survivor_2', 30, 30, { bravery: 0.4, sociability: 0.8, neuroticism: 0.6 }));
    this.world = createWorld(1337, 40, 30, 20);
    this.resetDiscovery();
    this.resetPois();
    this.resources.push(...spawnInitialResources(this.world, 4));
    this.startScenario(scenarioId);
  }

  public startScenario(scenarioId: ScenarioId) {
    this.scenario.start(scenarioId);
    this.applyScenarioStartingConditions(scenarioId);
  }

  public tick() {
    if (this.isGameOver || this.isVictory) return;

    this.tickCount++;

    // Cooldowns
    for (const survivor of this.survivors) {
      survivor.scoutCooldown = Math.max(0, survivor.scoutCooldown - 1);
    }

    // 1. Process Player Commands
    this.processCommands();

    // 2. Update vital systems
    this.time.tick();
    this.weather.tick();
    this.updateDiscovery();
    this.farmingSystem.tick(this.structures, this.weather.state, this.power);
    this.power.tick(this.structures, this.time.state, this.weather.state);
    this.refinerySystem.tick(this.structures, this.power);
    this.ecosystemSystem.tick(this.tickCount, this.animals, this.world, this.time.state.phase);
    this.animalAISystem.tick(this.animals, this.resources, this.survivors);
    this.handleAnimalSpawning();
    this.hungerSystem.tick(this.survivors);
    this.resourceSystem.tick(this.resources);
    
    // Rain helps resources grow faster
    if (this.weather.state.type === 'RAIN') {
        this.resourceSystem.tick(this.resources);
    }

    this.combatSystem.tick(this.survivors, this.animals, this.structures);
    this.animals = this.animals.filter(a => a.health > 0);
    this.structures = this.structures.filter(s => s.health > 0);
    
    const hasCampfire = this.structures.some(s => s.type === 'campfire' && s.isComplete);
    this.moraleSystem.tick(this.survivors, this.time.state.phase === 'NIGHT', hasCampfire, this.weather.state);
    this.scenario.tick({
      tickCount: this.tickCount,
      time: this.time.state,
      survivors: this.survivors,
      structures: this.structures,
      animals: this.animals,
      weather: this.weather.state,
      power: this.power.state,
      progression: this.progression,
    });

    // 2.5 Equipment Passive Effects
    this.handleEquipmentEffects();

    // 2.6 Handle Mounting Sync
    for (const survivor of this.survivors) {
        if (survivor.mountedAnimalId) {
            const animal = this.animals.find(a => a.id === survivor.mountedAnimalId);
            if (animal) {
                survivor.x = animal.x;
                survivor.y = animal.y;
            } else {
                survivor.mountedAnimalId = null; // Animal died or vanished
            }
        }
    }

    // Hazard Biomes Effects
    for (const survivor of this.survivors) {
      if (this.tickCount % 10 === 0) {
        const biome = this.world.biomeAtWorld(survivor.x, survivor.y);
        if (biome === 'VOLCANIC') {
          survivor.stats.health -= 2;
          survivor.debugState = 'Taking Volcanic Heat Damage!';
        }
      }
    }

    // Check Victory
    const beacon = this.structures.find(s => s.type === 'dimensional_beacon' && s.isComplete);
    if (beacon) {
      this.isVictory = true;
      return;
    }

    // 3. AI Decision & Execution
    for (const survivor of this.survivors) {
       if (survivor.stats.health <= 0) {
         this.isGameOver = true;
         survivor.debugState = 'DIED';
         continue;
       }

       if (!survivor.currentTask || survivor.currentTask.type === 'IDLE') {
         this.brain.decideTask(
           survivor,
           this.resources,
           this.structures,
           this.animals,
           this.time.state,
           this.progression,
           this.survivors,
           this.world,
           this.discovered,
           this.governance.state.globalFocus
         );
       }
       
       this.brain.executeTask(survivor, this.resources, this.structures, this.animals);
    }
  }

  private updateDiscovery() {
    const { widthTiles, heightTiles } = this.world.config;
    const radiusTiles = 2;

    for (const survivor of this.survivors) {
      const { tx, ty } = this.world.worldToTile(survivor.x, survivor.y);

      for (let oy = -radiusTiles; oy <= radiusTiles; oy++) {
        for (let ox = -radiusTiles; ox <= radiusTiles; ox++) {
          const nx = tx + ox;
          const ny = ty + oy;
          if (nx < 0 || ny < 0 || nx >= widthTiles || ny >= heightTiles) continue;
          const wasKnown = this.discovered[ny][nx] === true;
          this.discovered[ny][nx] = true;
          if (!wasKnown) {
            this.onTileDiscovered(nx, ny, survivor.id);
          }
        }
      }
    }
  }

  private onTileDiscovered(tx: number, ty: number, bySurvivorId: string) {
    const found = this.pois.find(p => p.tx === tx && p.ty === ty && !this.discoveredPoiIds.has(p.id));
    if (!found) return;

    this.discoveredPoiIds.add(found.id);
    const survivor = this.survivors.find(s => s.id === bySurvivorId);
    if (survivor) {
      applyPoiReward(survivor, found);
      applyPoiWorldEffect(this.world, this.structures, found);
      survivor.debugState = `Discovered POI: ${found.type}`;
    }
  }

  private handleEquipmentEffects() {
    if (this.time.state.phase === 'NIGHT') {
      for (const survivor of this.survivors) {
        if (survivor.equippedTool?.id === 'torch') {
          survivor.equippedTool.durability -= 0.1; // Passive decay for torch at night
          if (survivor.equippedTool.durability <= 0) {
            survivor.equippedTool = null;
            survivor.debugState = 'Torch burned out!';
          }
        }
      }
    }
  }

  private handleAnimalSpawning() {
    const survivor = this.survivors[0];
    if (!survivor) return;

    this.wave.checkSpawn(
      this.time.state.day,
      this.time.state.phase,
      this.animals,
      survivor.x,
      survivor.y
    );

    if (this.time.state.phase === 'MORNING') {
      // Animals vanish at morning
      this.animals = [];
    }
  }

  private processCommands() {
    const commands = this.interaction.fetchCommands();
    for (const cmd of commands) {
      this.handleCommand(cmd);
    }
  }

  private handleCommand(cmd: PlayerCommand) {
    switch (cmd.type) {
      case 'UNLOCK_RECIPE': {
        this.progression.unlockRecipe(cmd.recipeId);
        break;
      }
      case 'ASSIST_GATHER': {
        const resource = this.resources.find(r => r.id === cmd.targetId);
        if (resource && resource.amount > 0) {
          resource.amount -= 1;
          const survivor = (cmd.survivorId ? this.survivors.find(s => s.id === cmd.survivorId) : undefined) ?? this.survivors[0];
          if (survivor) {
             const itemId = resourceToItemMap[resource.type] ?? 'item';
             survivor.inventory[itemId] = (survivor.inventory[itemId] || 0) + 1;
             survivor.debugState = `Player assisted gathering ${itemId}`;
          }
        }
        break;
      }
      case 'ASSIST_ATTACK': {
        const animal = this.animals.find(a => a.id === cmd.targetId);
        if (animal) {
          animal.health -= 10;
          const survivor = (cmd.survivorId ? this.survivors.find(s => s.id === cmd.survivorId) : undefined) ?? this.survivors[0];
          if (survivor) survivor.debugState = `Player assisted attack (${animal.type})`;
          if (animal.health <= 0) {
            this.animals = this.animals.filter(a => a.id !== animal.id);
          }
        }
        break;
      }
      case 'EMERGENCY_FEED': {
        const survivor = this.survivors.find(s => s.id === cmd.survivorId);
        if (survivor) {
          survivor.stats.hunger = Math.min(survivor.stats.hunger + 10, survivor.stats.maxHunger);
          survivor.debugState = 'Player fed survivor (Emergency)';
        }
        break;
      }
      case 'EMERGENCY_HEAL': {
        const survivor = this.survivors.find(s => s.id === cmd.survivorId);
        if (survivor) {
          survivor.stats.health = Math.min(survivor.stats.health + 10, survivor.stats.maxHealth);
          survivor.debugState = 'Player healed survivor (Emergency)';
        }
        break;
      }
      case 'GIVE_ITEM': {
        const survivor = this.survivors.find(s => s.id === cmd.survivorId);
        if (survivor) {
          const amount = Math.max(1, cmd.amount ?? 1);
          survivor.inventory[cmd.itemId] = (survivor.inventory[cmd.itemId] || 0) + amount;
          survivor.debugState = `Player gave ${cmd.itemId} x${amount}`;
        }
        break;
      }
      case 'PLACE_STRUCTURE': {
        const survivor = this.survivors.find(s => s.id === cmd.survivorId);
        const data = structureData[cmd.structureId];
        if (!survivor || !data) break;

        const placementOk = isPlacementValid({
          x: cmd.x,
          y: cmd.y,
          structures: this.structures,
          resources: this.resources,
          survivors: this.survivors,
          animals: this.animals,
        });
        if (!placementOk) {
          survivor.debugState = `Player: Cannot place ${data.name} (blocked)`;
          break;
        }

        const canBuild = data.ingredients.every(ing => (survivor.inventory[ing.itemId] || 0) >= ing.amount);
        if (!canBuild) {
          const missing = data.ingredients.find(ing => (survivor.inventory[ing.itemId] || 0) < ing.amount);
          survivor.debugState = `Player: Cannot place ${data.name} (missing ${missing?.itemId ?? 'materials'})`;
          break;
        }

        for (const ing of data.ingredients) {
          survivor.inventory[ing.itemId] -= ing.amount;
        }

        this.structures.push(createStructure(`${data.id}_${Date.now()}`, data.id, cmd.x, cmd.y, false));
        survivor.debugState = `Player: Placed ${data.name}`;
        break;
      }
      case 'TAME_ANIMAL': {
        const survivor = this.survivors.find(s => s.id === cmd.survivorId);
        const animal = this.animals.find(a => a.id === cmd.targetId);
        if (!survivor || !animal) break;

        if (animal.faction !== 'NEUTRAL') {
            survivor.debugState = `Player: Cannot tame ${animal.type} (not neutral)`;
            break;
        }

        const dist = Math.sqrt(Math.pow(survivor.x - animal.x, 2) + Math.pow(survivor.y - animal.y, 2));
        if (dist > 50) {
            survivor.debugState = `Player: Too far to tame ${animal.type}`;
            break;
        }

        const tamingFood = ['vegetable', 'fern'];
        const foodId = tamingFood.find(f => (survivor.inventory[f] || 0) > 0);

        if (foodId) {
            survivor.inventory[foodId] -= 1;
            animal.faction = 'TAMED';
            animal.currentTask = null;
            animal.debugState = 'TAMED!';
            survivor.debugState = `Player: Tamed ${animal.type} with ${foodId}`;
        } else {
            survivor.debugState = `Player: Need vegetable or fern to tame ${animal.type}`;
        }
        break;
      }
      case 'MOUNT_ANIMAL': {
        const survivor = this.survivors.find(s => s.id === cmd.survivorId);
        const animal = this.animals.find(a => a.id === cmd.targetId);
        if (!survivor || !animal) break;

        if (animal.faction !== 'TAMED') {
            survivor.debugState = `Player: Cannot ride ${animal.type} (not tamed)`;
            break;
        }

        const dist = Math.sqrt(Math.pow(survivor.x - animal.x, 2) + Math.pow(survivor.y - animal.y, 2));
        if (dist > 60) {
            survivor.debugState = `Player: Too far to ride ${animal.type}`;
            break;
        }

        if (animal.mountedBySurvivorId && animal.mountedBySurvivorId !== survivor.id) {
            survivor.debugState = `Player: ${animal.type} is already being ridden`;
            break;
        }

        survivor.mountedAnimalId = animal.id;
        animal.mountedBySurvivorId = survivor.id;
        survivor.debugState = `Player: Riding ${animal.type}`;
        break;
      }
      case 'SET_ROLE': {
        const survivor = this.survivors.find(s => s.id === cmd.survivorId);
        if (survivor) {
          survivor.role = cmd.role;
          survivor.debugState = `Player: Set Role to ${cmd.role}`;
        }
        break;
      }
      case 'SET_GOVERNANCE_FOCUS': {
        this.governance.setFocus(cmd.focus);
        break;
      }
      case 'START_SCENARIO': {
        this.startScenario(cmd.scenarioId);
        break;
      }
      case 'DISMOUNT_ANIMAL': {
        const survivor = this.survivors.find(s => s.id === cmd.survivorId);
        if (!survivor || !survivor.mountedAnimalId) break;

        const animal = this.animals.find(a => a.id === survivor.mountedAnimalId);
        if (animal) animal.mountedBySurvivorId = null;
        survivor.mountedAnimalId = null;
        survivor.debugState = 'Player: Dismounted';
        break;
      }
    }
  }

  private applyScenarioStartingConditions(scenarioId: ScenarioId) {
    const leadSurvivor = this.survivors[0];
    if (!leadSurvivor) return;

    if (scenarioId === 'FIRST_CAMP') {
      leadSurvivor.inventory['wood'] = Math.max(leadSurvivor.inventory['wood'] || 0, 3);
      leadSurvivor.debugState = 'Scenario: First Camp supplies ready';
      return;
    }

    if (scenarioId === 'SURVIVE_HEATWAVE') {
      this.time.state.day = 2;
      this.time.state.phase = 'MORNING';
      this.time.state.progress = 0.05;
      this.weather.state.type = 'CLEAR';
      this.weather.state.intensity = 1;
      this.weather.state.duration = 500;

      this.structures.push(createStructure('scenario_campfire', 'campfire', 0, 0, true));
      for (const survivor of this.survivors) {
        survivor.stats.hunger = Math.max(survivor.stats.hunger, 80);
        survivor.inventory['berry'] = (survivor.inventory['berry'] || 0) + 2;
        survivor.debugState = 'Scenario: Heatwave shelter ready';
      }
      return;
    }

    if (scenarioId === 'POWER_RELAY') {
      this.time.state.phase = 'MORNING';
      this.time.state.progress = 0.05;
      this.weather.state.type = 'CLEAR';
      this.weather.state.intensity = 0;
      this.weather.state.duration = 500;
      this.power.state.batteryLevel = 0;

      leadSurvivor.inventory['ancient_tech'] = Math.max(leadSurvivor.inventory['ancient_tech'] || 0, 2);
      leadSurvivor.inventory['refined_fossil'] = Math.max(leadSurvivor.inventory['refined_fossil'] || 0, 3);
      leadSurvivor.inventory['stone'] = Math.max(leadSurvivor.inventory['stone'] || 0, 4);
      leadSurvivor.debugState = 'Scenario: Power relay kit ready';
      return;
    }

    if (scenarioId === 'TAMING_TRIAL') {
      this.time.state.phase = 'AFTERNOON';
      this.time.state.progress = 0.45;
      this.weather.state.type = 'CLEAR';
      this.weather.state.intensity = 0;
      this.weather.state.duration = 500;

      leadSurvivor.inventory['vegetable'] = Math.max(leadSurvivor.inventory['vegetable'] || 0, 1);
      leadSurvivor.inventory['fern'] = Math.max(leadSurvivor.inventory['fern'] || 0, 1);
      this.animals.push(createAnimal('scenario_triceratops', 'Triceratops', 'NEUTRAL', 20, 0, 80, 5));
      leadSurvivor.debugState = 'Scenario: Taming food ready';
    }
  }
}
