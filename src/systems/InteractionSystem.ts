export type PlayerCommand =
  | { type: 'ASSIST_GATHER'; targetId: string; survivorId?: string }
  | { type: 'ASSIST_ATTACK'; targetId: string; survivorId?: string }
  | { type: 'EMERGENCY_FEED'; survivorId: string }
  | { type: 'EMERGENCY_HEAL'; survivorId: string }
  | { type: 'GIVE_ITEM'; survivorId: string; itemId: string; amount?: number }
  | { type: 'PLACE_STRUCTURE'; survivorId: string; structureId: string; x: number; y: number }
  | { type: 'UNLOCK_RECIPE'; recipeId: string };

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
