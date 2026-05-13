import { SurvivorRole } from '../entities/Survivor';
import { ColonyFocus } from './GovernanceSystem';

export type PlayerCommand =
  | { type: 'ASSIST_GATHER'; targetId: string; survivorId?: string }
  | { type: 'ASSIST_ATTACK'; targetId: string; survivorId?: string }
  | { type: 'EMERGENCY_FEED'; survivorId: string }
  | { type: 'EMERGENCY_HEAL'; survivorId: string }
  | { type: 'GIVE_ITEM'; survivorId: string; itemId: string; amount?: number }
  | { type: 'PLACE_STRUCTURE'; survivorId: string; structureId: string; x: number; y: number }
  | { type: 'UNLOCK_RECIPE'; recipeId: string }
  | { type: 'TAME_ANIMAL'; targetId: string; survivorId: string }
  | { type: 'MOUNT_ANIMAL'; targetId: string; survivorId: string }
  | { type: 'DISMOUNT_ANIMAL'; survivorId: string }
  | { type: 'SET_ROLE'; survivorId: string; role: SurvivorRole }
  | { type: 'SET_GOVERNANCE_FOCUS'; focus: ColonyFocus };

export class InteractionSystem {
  private commandQueue: PlayerCommand[] = [];

  public pushCommand(command: PlayerCommand): void {
    this.commandQueue.push(command);
  }

  public fetchCommands(): PlayerCommand[] {
    const commands = [...this.commandQueue];
    this.commandQueue = [];
    return commands;
  }
}
