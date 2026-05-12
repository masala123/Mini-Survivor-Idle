# CHANGELOG

## 2026-05-12

### Added
- **Weather System**: Implemented dynamic weather (Clear, Rain, Cold). Weather affects morale decay and resource growth rates.
- **Weather Visuals**: Added rain and frost/snow visual effects to the canvas renderer.
- **Multiple Survivors**: The simulation now supports multiple survivors. They independently make decisions and interact socially.
- **Morale System**: Introduced `Morale` as a core stat. Morale decays in darkness and hunger, and recovers near campfires or via social interaction.
- **Social Interaction**: Survivors now receive a morale boost when staying close to each other.
- **Social AI**: `SurvivorBrain` now coordinates gathering to prevent multiple survivors from targeting the same resource node simultaneously.
- **Relax Behavior**: AI now prioritizes relaxing near a campfire if morale is low.
- **Multi-Survivor HUD**: The HUD now tracks status for all active survivors.
- **Farming (Basic)**: Added `farm_plot` structures that grow `vegetable` food over time (modified by weather), plus AI harvesting behavior.
- **Personality Traits**: Survivors now have simple personality traits (bravery/sociability/neuroticism) that affect danger engagement distance and morale behavior.
- **Click Assistance**: Clicking resources assists gathering; clicking monsters assists combat via new `ASSIST_ATTACK` command.
- **Targeted Assistance**: Player can select which survivor receives assistance (gather/attack) and trigger per-survivor emergency feed/heal from the HUD.
- **Throw Item**: Player can give items (torch/axe/food) directly to the selected survivor via `GIVE_ITEM`.
- **Place Structure**: Player can place basic structures via `PLACE_STRUCTURE` by selecting a structure and clicking the canvas (materials are deducted from the selected survivor).
- **Placement Preview**: While placing, the canvas shows a ghost preview and snaps placement to a grid.
- **Placement Blocking**: Placement is prevented when overlapping existing entities (preview turns red; simulation rejects placement).
- **World Biomes (Groundwork)**: Added deterministic seedable biome tiles and renders them as a background grid.
- **Biome-Based Spawning (Groundwork)**: Initial resource nodes now spawn deterministically based on biome tiles.
- **Minimap (MVP4 UX)**: Added a minimap overlay showing biome tiles and entity dots (survivors/resources/structures/monsters).
- **Exploration (Fog of War)**: Minimap now hides undiscovered tiles; survivors reveal nearby tiles as they move.
- **Points of Interest (POIs)**: Added deterministic POIs that get discovered through exploration and appear on the minimap with a discoveries counter.
- **POI Rewards**: Discovered POIs now grant one-time rewards (items/morale) to the discovering survivor.
- **POI World Effects**: Some POIs spawn pre-built structures on discovery (e.g., bonfire sites create a campfire).
- **Exploration AI**: Survivors can now SCOUT toward undiscovered tiles to reveal the fog-of-war.
- **Scout Frontier Targeting**: SCOUT now prefers the nearest frontier tile (unknown adjacent to known) for smoother exploration.
- **Scout Cooldown**: Survivors now have a cooldown after starting SCOUT to prevent nonstop exploration loops.

### Fixed
- Fixed a syntax error in `Simulation.ts` caused by concurrent file edits.
- Fixed `npm run lint` on ESLint v9 by adding `eslint.config.js` (flat config).

### Changed
- Updated `SurvivorBrain` to respect locked recipes in its decision-making logic.
- Extended test suite to cover progression and locked crafting.
- Changed `npm test` to run non-watch mode by default (`vitest --run`).

---

## 2026-05-12

### Added
- Created core simulation loop (`Simulation.ts`).
- Added `Survivor` entity with health and hunger stats.
- Added `ResourceNode` entity (e.g., berry bushes).
- Added `HungerSystem` to decay survivor hunger over time.
- Implemented `SurvivorBrain` for basic AI task selection (finding food when hungry).
- Added Vitest setup and initial simulation tests.

## 2026-05-12 (Phase 2)

### Added
- Implemented `TimeSystem` with Day/Night cycle logic (Morning, Afternoon, Night).
- Added `inventory` to `Survivor` entity.
- Enhanced `SurvivorBrain` to support stockpiling and inventory-based eating.
- Simulation now tracks time and phases.
- Added Phase 2 tests for time progression and inventory gathering.

### Notes
- Completed Phase 2 (World Interaction - Basics). AI can now gather food into an inventory and consume it when needed. Stockpiling logic ensures they don't wait until starving to gather.

## 2026-05-12 (Phase 3)

### Added
- Implemented `InteractionSystem` and `PlayerCommand` system.
- Added support for player commands in `Simulation`:
  - `ASSIST_GATHER`: Player helps gather resources.
  - `EMERGENCY_FEED`: Player restores survivor hunger.
  - `EMERGENCY_HEAL`: Player restores survivor health.
- Enhanced `SurvivorBrain` to preserve player interaction feedback in `debugState`.
- Added Phase 3 tests for player interaction and command processing.

### Notes
- Completed Phase 3 (Player Interaction). The game now supports indirect player assistance via a clean command system, fulfilling a core design pillar.

## 2026-05-12 (Phase 4)

### Added
- Implemented `CanvasRenderer` for basic 2D world rendering.
- Created React-based `Hud` component for status tracking.
- Set up core `App` component with game and render loops.
- Added visual indicators for Survivor thoughts (debug strings) and Time.
- Implemented "Assist Gathering" button in the HUD connected to the Command System.
- Basic visual styling for Grassland biome and entity placeholders.

### Notes
- Completed Phase 4 (Basic Visuals). The simulation is now fully visible and interactive in the browser. AI behavior is readable through both status bars and thought bubbles.

## 2026-05-12 (Phase 5 - MVP 1 Final Release)

### Added
- Implemented `ResourceSystem` for resource regeneration (bushes regrow over time).
- Added `isGameOver` state to `Simulation` and handled survivor death.
- Added "GAME OVER" display and "RESTART" button to the UI.
- Improved game balance: adjusted hunger decay and berry food value.
- Added Phase 5 tests for regeneration and game over logic.

### Notes
- **MVP 1 is now complete.** The project has a solid foundation with a decoupled simulation, utility AI, day/night cycle, inventory, and player interaction system. It is ready for further expansion into MVP 2 (Crafting & Building).

## 2026-05-12 (Phase 6 - MVP 2 Final Release)

### Added
- Implemented **Crafting System**:
  - Data-driven item definitions (`items.ts`).
  - Recipe-based crafting (`recipes.ts`).
  - Survivor can now craft **Stone Axe** for efficiency.
- Implemented **Base Building**:
  - Survivor can now build **Campfire** (for night safety) and **Wooden Chest** (for storage).
  - Infrastructure planning: AI prioritizes base expansion during the afternoon.
- Implemented **Tool Durability & Equipment**:
  - Tools now have durability and can break after usage.
  - Survivor automatically equips tools from inventory.
- Implemented **Storage System**:
  - Chests now have their own inventory.
  - Survivor stores excess materials in chests to keep inventory clean.
- Implemented **Monster Waves & Combat**:
  - Night now spawns **Shadow Raptors** that hunt the survivor.
  - Survivor can **FIGHT** (if near a campfire) or **FLEE** (if caught in the open).
  - Added `CombatSystem` for damage processing.
- Added comprehensive tests for Crafting, Building, and Storage (13 tests passing).

### Notes
- **MVP 2 is now complete.** The game has evolved from pure survival to infrastructure development and threat management. The survivor is now an active inhabitant of the world, building a home and defending it.
