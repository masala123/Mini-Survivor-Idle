# System Design: Animal AI System

## 1. Overview
The Animal AI System governs the autonomous behavior of prehistoric creatures in the game world. It transitions the game from a static enemy-spawn model to a dynamic ecosystem where creatures have their own needs and interactions.

## 2. Core Mechanics
- **Factions:**
  - `HOSTILE`: Aggressively hunts survivors and neutral animals (e.g., Velociraptor, T-Rex).
  - `NEUTRAL`: Coexists peacefully unless attacked. Engages in life-sustaining behaviors like grazing (e.g., Triceratops, Ankylosaurus).
  - `TAMED`: Allied with survivors. Assists in defense or gathering.
- **Tasks:**
  - `WANDER`: Random movement within a local area.
  - `GRAZE`: Herbivores move to resource bushes and consume them slowly over time.
  - `HUNT`: Predators track and move towards the nearest prey (Survivor or Neutral Animal).
  - `FIGHT`: Damage is applied when within range of a target.

## 3. Data Requirements
- Animal entity state: `faction`, `health`, `attackPower`, `currentTask`, `debugState`.
- Task targets: `targetId` or `targetX/Y`.

## 4. Integration
- **Simulation:** Ticked every frame. Decisions are made when idle or wandering.
- **Combat System:** Resolves damage when AI brings an animal into range of a target.
- **Resource System:** Animals can consume `BERRY_BUSH` and `FERN_BUSH` nodes.

## 5. Technical Specification
- **Implementation Status:** Implemented ✅
- **Key Files:** 
  - `src/entities/Animal.ts`
  - `src/systems/AnimalAISystem.ts`
- **Relevant Tests:** 
  - `src/tests/simulation.test.ts` (Ecosystem spawning)

## 6. MVP Reference
- **Target MVP:** MVP 5
- **Prerequisites:** Basic Simulation, Resource System.

---
*Created by AI Agent on: May 13, 2026*
*Last Updated: May 13, 2026*
