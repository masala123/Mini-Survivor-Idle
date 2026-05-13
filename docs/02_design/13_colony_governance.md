# Colony Governance (MVP 7)

## Overview

Colony Governance allows players to set high-level strategic goals for the entire settlement. It influences the behavior of all survivors regardless of their individual job roles.

## Core Concepts

- **Global Focus**: A single active priority that affects the colony's behavior.
- **Utility Multipliers**: The global focus applies a multiplier to related tasks in the AI's decision-making logic.
- **Adaptability**: Survivors will still handle emergency needs (Hunger/Combat) regardless of the global focus.

## Governance Priorities

| Priority | Description | AI Effect |
|---|---|---|
| **Balanced** | Default setting | Standard utility calculation. |
| **Survival** | Focus on food and safety | +50% utility for Gathering Food and Harvesting Farms. |
| **Expansion** | Focus on base building | +50% utility for Construction and Gathering Materials. |
| **Logistics** | Focus on sorting and processing | +50% utility for Hauling and Storage. |
| **Exploration** | Focus on revealing the map | +50% utility for Scouting (reduced cooldown). |

## Technical Implementation

### Simulation
- `GovernanceSystem.ts` will manage the current `globalFocus`.
- It will be integrated into the `Simulation` loop.

### AI Integration
- `SurvivorBrain.decideTask` will take the `globalFocus` as an input and apply the relevant multipliers to task scores.

## UI/UX
- A new "Governance" panel in the HUD with a dropdown or radio buttons to switch priorities.
- The current priority will be displayed clearly in the HUD.
