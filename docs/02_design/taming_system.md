# System Design: Taming System

## 1. Overview
The Taming System allows survivors to convert neutral prehistoric creatures into loyal allies. This system provides the player with additional tactical options and colony-level utility.

## 2. Core Mechanics
- **Proximity:** A survivor must be within a short distance (50 units) of a `NEUTRAL` animal to attempt taming.
- **Offering:** The player issues a `TAME_ANIMAL` command. This consumes 1 unit of `vegetable` or `fern` from the survivor's inventory.
- **Conversion:** If the food is available, the animal's faction changes to `TAMED` permanently.
- **Behavior:**
  - Tamed animals follow the colony's primary survivor.
  - They automatically engage any `HOSTILE` animals that come within range of the survivor or the base.

## 3. Data Requirements
- Animal Faction: `NEUTRAL` -> `TAMED`.
- Item stats: Requires `type: FOOD` items (specifically Ferns or Vegetables).

## 4. Integration
- **Interaction System:** New command `TAME_ANIMAL`.
- **Simulation:** Validates range and inventory before applying the faction change.
- **Animal AI:** Switches logic to the "Colony Support" mode once tamed.

## 5. Technical Specification
- **Implementation Status:** Implemented ✅
- **Key Files:** 
  - `src/systems/InteractionSystem.ts`
  - `src/simulation/Simulation.ts`
  - `src/systems/AnimalAISystem.ts`
- **Relevant Tests:** 
  - `src/tests/simulation.test.ts`

## 6. MVP Reference
- **Target MVP:** MVP 5
- **Prerequisites:** Animal AI, Resource System.

---
*Created by AI Agent on: May 13, 2026*
*Last Updated: May 13, 2026*
