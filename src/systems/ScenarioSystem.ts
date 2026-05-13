import { Survivor } from '../entities/Survivor';
import { Structure } from '../entities/Structure';
import { TimeState } from './TimeSystem';
import { WeatherState } from './WeatherSystem';
import { PowerState } from './PowerSystem';
import { ProgressionSystem } from './ProgressionSystem';
import { Animal } from '../entities/Animal';

export type ScenarioId = 'FIRST_CAMP' | 'SURVIVE_HEATWAVE' | 'POWER_RELAY' | 'TAMING_TRIAL';
export type ScenarioStatus = 'ACTIVE' | 'COMPLETE' | 'FAILED';

export interface ScenarioOption {
  id: ScenarioId;
  label: string;
  requiredRecipeId?: string;
}

export const scenarioOptions: ScenarioOption[] = [
  { id: 'FIRST_CAMP', label: 'Camp' },
  { id: 'SURVIVE_HEATWAVE', label: 'Heatwave', requiredRecipeId: 'craft_axe' },
  { id: 'POWER_RELAY', label: 'Power', requiredRecipeId: 'craft_crystal_spear' },
  { id: 'TAMING_TRIAL', label: 'Tame', requiredRecipeId: 'craft_bone_club' },
];

export const isScenarioOptionUnlocked = (option: ScenarioOption, unlockedRecipeIds: Iterable<string>): boolean => {
  if (!option.requiredRecipeId) return true;
  return new Set(unlockedRecipeIds).has(option.requiredRecipeId);
};

export interface ScenarioObjective {
  id: string;
  label: string;
  current: number;
  target: number;
  completed: boolean;
}

export interface ScenarioState {
  id: ScenarioId;
  name: string;
  description: string;
  status: ScenarioStatus;
  elapsedTicks: number;
  outcomeMessage: string;
  outcomeApplied: boolean;
  deadlineTicks: number | null;
  score: ScenarioScore | null;
  objectives: ScenarioObjective[];
}

export interface ScenarioScore {
  total: number;
  rating: 'S' | 'A' | 'B' | 'C' | 'F';
  completionBonus: number;
  objectivePoints: number;
  survivorPoints: number;
  speedBonus: number;
  objectivesComplete: number;
  objectivesTotal: number;
  survivorsAlive: number;
  elapsedTicks: number;
  unlockedRecipes: string[];
}

export interface ScenarioScoreRecord {
  scenarioId: ScenarioId;
  scenarioName: string;
  status: Exclude<ScenarioStatus, 'ACTIVE'>;
  total: number;
  rating: ScenarioScore['rating'];
  objectivesComplete: number;
  objectivesTotal: number;
  survivorsAlive: number;
  elapsedTicks: number;
}

export const createScenarioScoreRecord = (state: ScenarioState): ScenarioScoreRecord | null => {
  if (state.status === 'ACTIVE' || !state.score) return null;

  return {
    scenarioId: state.id,
    scenarioName: state.name,
    status: state.status,
    total: state.score.total,
    rating: state.score.rating,
    objectivesComplete: state.score.objectivesComplete,
    objectivesTotal: state.score.objectivesTotal,
    survivorsAlive: state.score.survivorsAlive,
    elapsedTicks: state.score.elapsedTicks,
  };
};

export interface ScenarioContext {
  tickCount: number;
  time: TimeState;
  survivors: Survivor[];
  structures: Structure[];
  animals: Animal[];
  weather: WeatherState;
  power: PowerState;
  progression: ProgressionSystem;
}

const createObjective = (id: string, label: string, target: number): ScenarioObjective => ({
  id,
  label,
  current: 0,
  target,
  completed: false,
});

export class ScenarioSystem {
  public state: ScenarioState;

  constructor(initialScenario: ScenarioId = 'FIRST_CAMP') {
    this.state = this.createScenario(initialScenario);
  }

  public start(scenarioId: ScenarioId): void {
    this.state = this.createScenario(scenarioId);
  }

  public tick(context: ScenarioContext): void {
    if (this.state.status !== 'ACTIVE') return;

    this.state.elapsedTicks++;

    if (this.state.id === 'SURVIVE_HEATWAVE') {
      this.applyHeatwave(context);
    }

    this.updateObjectives(context);

    const anyDead = context.survivors.some(survivor => survivor.stats.health <= 0);
    if (anyDead) {
      this.finish('FAILED', context);
      return;
    }

    if (this.state.objectives.every(objective => objective.completed)) {
      this.finish('COMPLETE', context);
      return;
    }

    if (this.state.deadlineTicks !== null && this.state.elapsedTicks >= this.state.deadlineTicks) {
      this.finish('FAILED', context);
    }
  }

  private createScenario(scenarioId: ScenarioId): ScenarioState {
    if (scenarioId === 'SURVIVE_HEATWAVE') {
      return {
        id: scenarioId,
        name: 'Survive the Heatwave',
        description: 'Keep every survivor alive until the heatwave breaks on day 3.',
        status: 'ACTIVE',
        elapsedTicks: 0,
        outcomeMessage: '',
        outcomeApplied: false,
        deadlineTicks: 320,
        score: null,
        objectives: [
          createObjective('survive_days', 'Survive to day 3', 3),
          createObjective('keep_survivors_alive', 'Survivors alive', 2),
        ],
      };
    }

    if (scenarioId === 'POWER_RELAY') {
      return {
        id: scenarioId,
        name: 'Power Relay',
        description: 'Build a renewable power loop and charge the first battery bank.',
        status: 'ACTIVE',
        elapsedTicks: 0,
        outcomeMessage: '',
        outcomeApplied: false,
        deadlineTicks: 180,
        score: null,
        objectives: [
          createObjective('complete_solar_panel', 'Complete solar panel', 1),
          createObjective('complete_battery_bank', 'Complete battery bank', 1),
          createObjective('charge_battery', 'Stored power', 100),
          createObjective('keep_survivors_alive', 'Survivors alive', 2),
        ],
      };
    }

    if (scenarioId === 'TAMING_TRIAL') {
      return {
        id: scenarioId,
        name: 'Taming Trial',
        description: 'Tame and mount a neutral dinosaur before the herd scatters.',
        status: 'ACTIVE',
        elapsedTicks: 0,
        outcomeMessage: '',
        outcomeApplied: false,
        deadlineTicks: 120,
        score: null,
        objectives: [
          createObjective('tame_animal', 'Tame dinosaur', 1),
          createObjective('mount_animal', 'Mount dinosaur', 1),
          createObjective('keep_survivors_alive', 'Survivors alive', 2),
        ],
      };
    }

    return {
      id: scenarioId,
      name: 'First Camp Protocol',
      description: 'Establish a complete campfire and keep the colony alive through the first night.',
      status: 'ACTIVE',
      elapsedTicks: 0,
      outcomeMessage: '',
      outcomeApplied: false,
      deadlineTicks: 340,
      score: null,
      objectives: [
        createObjective('complete_campfire', 'Complete campfire', 1),
        createObjective('survive_first_night', 'Reach day 2', 2),
        createObjective('keep_survivors_alive', 'Survivors alive', 2),
      ],
    };
  }

  private updateObjectives(context: ScenarioContext): void {
    for (const objective of this.state.objectives) {
      if (objective.id === 'complete_campfire') {
        objective.current = context.structures.some(s => s.type === 'campfire' && s.isComplete) ? 1 : 0;
      } else if (objective.id === 'complete_solar_panel') {
        objective.current = context.structures.some(s => s.type === 'solar_panel' && s.isComplete) ? 1 : 0;
      } else if (objective.id === 'complete_battery_bank') {
        objective.current = context.structures.some(s => s.type === 'battery_bank' && s.isComplete) ? 1 : 0;
      } else if (objective.id === 'charge_battery') {
        objective.current = Math.floor(context.power.batteryLevel);
      } else if (objective.id === 'tame_animal') {
        objective.current = context.animals.some(animal => animal.faction === 'TAMED') ? 1 : 0;
      } else if (objective.id === 'mount_animal') {
        objective.current = context.survivors.some(survivor => survivor.mountedAnimalId !== null) ? 1 : 0;
      } else if (objective.id === 'survive_first_night' || objective.id === 'survive_days') {
        objective.current = context.time.day;
      } else if (objective.id === 'keep_survivors_alive') {
        objective.current = context.survivors.filter(s => s.stats.health > 0).length;
      }

      objective.completed = objective.current >= objective.target;
    }
  }

  private applyHeatwave(context: ScenarioContext): void {
    context.weather.type = 'CLEAR';
    context.weather.intensity = 1;
    context.weather.duration = Math.max(context.weather.duration, 10);

    if (context.tickCount % 20 !== 0) return;
    if (context.time.phase === 'NIGHT') return;

    for (const survivor of context.survivors) {
      const isSheltered = context.structures.some(structure => {
        if (!structure.isComplete || structure.type !== 'campfire') return false;
        const dx = survivor.x - structure.x;
        const dy = survivor.y - structure.y;
        return Math.sqrt(dx * dx + dy * dy) <= 70;
      });

      if (!isSheltered) {
        survivor.stats.health -= 1;
        survivor.debugState = 'Heatwave exhaustion';
      }
    }
  }

  private finish(status: Exclude<ScenarioStatus, 'ACTIVE'>, context: ScenarioContext): void {
    this.state.status = status;
    if (this.state.outcomeApplied) return;

    this.state.outcomeApplied = true;
    this.state.score = this.calculateScore(status, context);
    this.applyScoreUnlocks(status, context);

    if (status === 'FAILED') {
      for (const survivor of context.survivors) {
        survivor.stats.morale = Math.max(0, survivor.stats.morale - 10);
      }
      this.state.outcomeMessage = 'Scenario failed: colony morale dropped.';
      return;
    }

    if (this.state.id === 'SURVIVE_HEATWAVE') {
      const leadSurvivor = context.survivors[0];
      if (leadSurvivor) {
        leadSurvivor.inventory['ancient_tech'] = (leadSurvivor.inventory['ancient_tech'] || 0) + 1;
        leadSurvivor.inventory['refined_fossil'] = (leadSurvivor.inventory['refined_fossil'] || 0) + 2;
      }
      for (const survivor of context.survivors) {
        survivor.stats.morale = Math.min(survivor.stats.maxMorale, survivor.stats.morale + 15);
      }
      this.state.outcomeMessage = 'Scenario complete: recovered ancient tech and refined fossils.';
      return;
    }

    if (this.state.id === 'POWER_RELAY') {
      const leadSurvivor = context.survivors[0];
      if (leadSurvivor) {
        leadSurvivor.inventory['ancient_tech'] = (leadSurvivor.inventory['ancient_tech'] || 0) + 2;
        leadSurvivor.inventory['refined_fossil'] = (leadSurvivor.inventory['refined_fossil'] || 0) + 1;
      }
      for (const survivor of context.survivors) {
        survivor.stats.morale = Math.min(survivor.stats.maxMorale, survivor.stats.morale + 12);
      }
      this.state.outcomeMessage = 'Scenario complete: relay stabilized and tech cache recovered.';
      return;
    }

    if (this.state.id === 'TAMING_TRIAL') {
      for (const survivor of context.survivors) {
        survivor.inventory['vegetable'] = (survivor.inventory['vegetable'] || 0) + 1;
        survivor.stats.morale = Math.min(survivor.stats.maxMorale, survivor.stats.morale + 18);
      }
      this.state.outcomeMessage = 'Scenario complete: herd bond secured and camp morale lifted.';
      return;
    }

    for (const survivor of context.survivors) {
      survivor.inventory['berry'] = (survivor.inventory['berry'] || 0) + 2;
      survivor.stats.morale = Math.min(survivor.stats.maxMorale, survivor.stats.morale + 10);
    }
    this.state.outcomeMessage = 'Scenario complete: camp supplies secured.';
  }

  private calculateScore(status: Exclude<ScenarioStatus, 'ACTIVE'>, context: ScenarioContext): ScenarioScore {
    const objectivesComplete = this.state.objectives.filter(objective => objective.completed).length;
    const objectivesTotal = this.state.objectives.length;
    const survivorsAlive = context.survivors.filter(survivor => survivor.stats.health > 0).length;
    const survivorRatio = context.survivors.length > 0 ? survivorsAlive / context.survivors.length : 0;
    const objectiveRatio = objectivesTotal > 0 ? objectivesComplete / objectivesTotal : 0;
    const completionBonus = status === 'COMPLETE' ? 300 : 0;
    const objectivePoints = Math.round(objectiveRatio * 500);
    const survivorPoints = Math.round(survivorRatio * 200);
    const speedBonus = Math.max(0, 100 - Math.floor(this.state.elapsedTicks / 25));

    const total = Math.max(0, completionBonus + objectivePoints + survivorPoints + speedBonus);

    let rating: ScenarioScore['rating'] = 'F';
    if (status === 'COMPLETE' && total >= 1000) rating = 'S';
    else if (status === 'COMPLETE' && total >= 850) rating = 'A';
    else if (status === 'COMPLETE' && total >= 700) rating = 'B';
    else if (total >= 450) rating = 'C';

    return {
      total,
      rating,
      completionBonus,
      objectivePoints,
      survivorPoints,
      speedBonus,
      objectivesComplete,
      objectivesTotal,
      survivorsAlive,
      elapsedTicks: this.state.elapsedTicks,
      unlockedRecipes: [],
    };
  }

  private applyScoreUnlocks(status: Exclude<ScenarioStatus, 'ACTIVE'>, context: ScenarioContext): void {
    if (status !== 'COMPLETE' || !this.state.score) return;

    const strongRating = this.state.score.rating === 'S' || this.state.score.rating === 'A' || this.state.score.rating === 'B';
    const eliteRating = this.state.score.rating === 'S' || this.state.score.rating === 'A';

    const unlocks: string[] = [];
    if (this.state.id === 'FIRST_CAMP' && strongRating) {
      unlocks.push('craft_axe');
    } else if (this.state.id === 'SURVIVE_HEATWAVE' && eliteRating) {
      unlocks.push('craft_crystal_spear');
    } else if (this.state.id === 'POWER_RELAY' && eliteRating) {
      unlocks.push('craft_bone_club');
    }

    for (const recipeId of unlocks) {
      context.progression.unlockRecipe(recipeId);
    }
    this.state.score.unlockedRecipes = unlocks;
  }
}
