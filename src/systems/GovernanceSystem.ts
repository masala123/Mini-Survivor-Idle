export type ColonyFocus = 'BALANCED' | 'SURVIVAL' | 'EXPANSION' | 'LOGISTICS' | 'EXPLORATION';

export interface GovernanceState {
  globalFocus: ColonyFocus;
}

export class GovernanceSystem {
  public state: GovernanceState = {
    globalFocus: 'BALANCED',
  };

  public setFocus(focus: ColonyFocus): void {
    this.state.globalFocus = focus;
  }
}
