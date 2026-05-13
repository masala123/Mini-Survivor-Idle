# Project Status - Idle Survivor Sandbox

## Current Status: MVP 7 Complete / Post-MVP Scenario Campaign In-Progress

Core survival simulation and the MVP 6 thematic features (dinosaurs, base automation, logistics, victory condition) are implemented and validated by tests.

### Roadmap Overview

- [x] Phase 0: Project Initialization & Doc Refactoring
- [x] Phase 1-5: MVP 1 Foundation (Simulation, AI, Hunger, Visuals, Interaction)
- [x] Phase 6: MVP 2 - Expansion (Crafting, Building, Tools)
- [x] Phase 7: MVP 3 - Depth (Survivors, Weather, Farming)
- [x] Phase 8: MVP 4 - Thematic Update & Mystery (Dinosaurs, Ruins)
- [x] Phase 9: MVP 5 - Ecosystem Depth & Taming
- [x] Phase 10: MVP 6 - Advanced Base Building & Logistics
- [x] Post-MVP 6: Finalized Victory Condition & Hazard Biomes

### Accomplishments

- [x] Decoupled Simulation/Rendering architecture.
- [x] Utility-based Survivor AI with needs and social awareness.
- [x] Day/Night cycle with time progression.
- [x] Dynamic Weather System (Rain, Cold) with environmental effects.
- [x] Command-based player interaction system.
- [x] Canvas-based world rendering with weather visual effects.
- [x] Resource regeneration system.
- [x] Game Over/Restart loop.
- [x] Progression System for unlocking crafting recipes.
- [x] Wave-based monster spawning system (refactored to Animals).
- [x] Improved Tool Durability & Equipment system.
- [x] Base Building Expansion with construction progress.
- [x] Multiple Survivors with Morale and Social Interaction.
- [x] Basic Farming & Food Production via farm plot growth.
- [x] Survivor Personality Traits affecting behavior.
- [x] Dinosaur-themed monsters (Compsognathus, Velociraptor, T-Rex) implemented.
- [x] Prehistoric resources (Ferns, Bones, Fossils) and Ancient Tech nodes added.
- [x] Crystal Ruins and Dimensional Anomaly POIs implemented.
- [x] Visual rendering updated to display the new thematic elements on Canvas and Minimap.
- [x] Post-MVP Polish: Dynamic weapon damage implemented via tool stats (`bone_club`, `crystal_spear`).
- [x] Post-MVP Polish: `dimensional_beacon` end-game structure added, bridging exploration and resource gathering.
- [x] MVP 5: Entity & Ecosystem Refactor complete - Animals now have Factions (HOSTILE, NEUTRAL, TAMED).
- [x] MVP 5: Animal AI implemented - Herbivores graze on bushes, Predators hunt survivors and neutral dinosaurs.
- [x] MVP 5: Taming Mechanics implemented - Neutral dinosaurs can be tamed using food (vegetables/ferns).
- [x] MVP 5: Tamed AI Support - Tamed animals follow survivors and defend the base from hostiles.
- [x] MVP 5: Mounting & Riding - Survivors can now ride tamed dinosaurs for a 2x speed boost.
- [x] MVP 6: Advanced Defenses - Implemented `Bone Wall` (high HP) and `Spike Trap` (collidable damage).
- [x] MVP 6: Logistics & Sorting - Added `Wood Shed` and `Stone Mason` specialized stockpiles.
- [x] MVP 6: HAUL AI Task - Survivors automatically sort and move materials into dedicated storage.
- [x] MVP 6: Automated Processing - Implemented `Stone Furnace` for processing Raw Fossils into `Refined Fossils`.
- [x] MVP 6: Autonomous Refinery AI - Survivors manage furnace input/output logistics.
- [x] Post-MVP 6: Finalized Victory Condition - Building the Dimensional Beacon triggers the game's victory state and ends the simulation.
- [x] Post-MVP 6: Implemented Hazard Biomes (Volcanic Heat) - Survivors take periodic damage when standing in volcanic biomes.
- [x] Post-MVP 6: UI/UX Cleanup - Reorganized HUD into logical sections and compacted layout for usability.
- [x] MVP 7: Job Roles - Survivors can now be assigned to specialized roles (Gatherer, Builder, Logistics) that influence AI task prioritization.
- [x] MVP 7: Power System - Implemented energy generation (Solar, Coal), storage (Batteries), and powered machines (Electric Smelter).
- [x] MVP 7: Advanced Farming - Added Water Pumps and Irrigation bonuses for farm plots.
- [x] MVP 7: Colony Governance - Implemented global priorities (Survival, Expansion, Logistics, Exploration) that shift AI behavior colony-wide.
- [x] Post-MVP Scenario System: Added tracked challenge objectives with First Camp and Heatwave scenarios selectable from the HUD.
- [x] Post-MVP Scenario Outcomes: Scenario completion now grants rewards, failures apply morale penalties, and HUD shows outcome messages.
- [x] Post-MVP Scenario Expansion: Added Power Relay mission and HUD construction controls for power infrastructure.
- [x] Post-MVP Scenario Setup: Scenario selection now starts a fresh mission run with scenario-specific supplies, weather, shelter, and power materials.
- [x] Post-MVP Scenario Scoring: Completed and failed scenarios now produce score summaries with rating, objectives completed, survivors alive, and elapsed ticks.
- [x] Post-MVP Score Unlocks: Strong scenario ratings now unlock recipes through the existing Progression System.
- [x] Post-MVP Scenario Chains: Scenario buttons now gate later missions behind campaign recipe unlocks and carry unlocked recipes across fresh runs.
- [x] Post-MVP Score History: Recent completed/failed scenario scores are retained across fresh scenario runs and displayed in the HUD.
- [x] Post-MVP Campaign Persistence: Campaign unlocks and recent score history now persist through browser localStorage with validation.
- [x] Post-MVP Campaign Reset: Added a HUD control to clear persisted campaign unlocks/history and restart the campaign.
- [x] Post-MVP Campaign Goals: HUD now tracks campaign-level goals for scenario clears, recipe unlocks, high-rank runs, and banked score.
- [x] Post-MVP Scenario Variety: Added Taming Trial as a fourth campaign scenario that seeds a neutral dinosaur and tracks taming/mounting objectives.
- [x] Post-MVP Scenario Difficulty: Active scenarios now have mission-specific deadlines, HUD countdowns, and deadline failure tests.
- [x] Post-MVP Campaign Rank: Campaign goals now roll up into a HUD rank with banked score and best rating.
- [x] Post-MVP Score Transparency: Scenario scores now expose completion, objective, survivor, and speed components in the HUD.
- [x] Comprehensive test suite (62 tests passing).

### Documentation Coverage (Source of Truth)

| System | Design Doc | Status |
|---|---|---|
| Core Simulation | [01_game_vision.md](../02_design/01_game_vision.md) | Current ✅ |
| AI Behavior | [03_survivor_ai_system.md](../02_design/03_survivor_ai_system.md) | Current ✅ |
| Animal AI | [animal_ai_system.md](../02_design/animal_ai_system.md) | Current ✅ |
| Ecosystem | [06_world_and_biomes.md](../02_design/06_world_and_biomes.md) | Current ✅ |
| Combat | [07_combat_system.md](../02_design/07_combat_system.md) | Current ✅ |
| Progression | [05_progression_system.md](../02_design/05_progression_system.md) | Current ✅ |
| Taming | [taming_system.md](../02_design/taming_system.md) | Current ✅ |
| Riding | [riding_system.md](../02_design/riding_system.md) | Current ✅ |
| Advanced Base | [08_base_building_system.md](../02_design/08_base_building_system.md) | Current ✅ |
| Automated Processing | [refinery_system.md](../02_design/refinery_system.md) | Current ✅ |
| Power System | [11_power_system.md](../02_design/11_power_system.md) | Current ✅ |
| Advanced Farming | [12_advanced_farming.md](../02_design/12_advanced_farming.md) | Current ✅ |
| Colony Governance | [13_colony_governance.md](../02_design/13_colony_governance.md) | Current ✅ |

### Next Steps (Post-MVP 7)

- **Scenario System**: Add richer scenario modifiers, rewards, and campaign meta-progression.
- **Visual Polish**: Add more animations, particles, and sound effects.
- **Save/Load System**: Implement persistent world state.
- **Balance Pass**: Fine-tune resource rates and threat levels.

### Known Blockers

- None.
