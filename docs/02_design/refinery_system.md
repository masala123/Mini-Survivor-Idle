# System Design: Refinery System (Automated Processing)

## 1. Overview
The Refinery System allows for automated resource processing without direct survivor interaction. It introduces the `Furnace` structure, which converts raw materials into high-tier refined items over time.

## 2. Core Mechanics
- **Structure:** `Furnace`
- **Recipe:** 1 `fossil` + 1 `wood` (fuel) -> 1 `refined_fossil`.
- **Logic:** 
  - If a complete `Furnace` contains at least 1 `fossil` and 1 `wood` in its inventory:
    - Increment `processTimer` every tick.
    - When `processTimer` reaches `maxProcessTimer` (200 ticks):
      - Consume 1 `fossil` and 1 `wood`.
      - Add 1 `refined_fossil` to the furnace inventory.
      - Reset `processTimer`.
- **AI Integration:** Survivors will automatically haul raw materials to the furnace and collect refined products.

## 3. Data Requirements
- `refined_fossil` item.
- `furnace` structure data.
- Structure properties: `processTimer`, `maxProcessTimer`.

## 4. Integration
- **Simulation:** Ticks the Refinery System logic.
- **Survivor AI:** Uses the `HAUL` task to supply and empty the furnace.

## 5. Technical Specification
- **Implementation Status:** Implemented ✅
- **Key Files:** 
  - `src/systems/RefinerySystem.ts`
  - `src/simulation/Simulation.ts`
- **Relevant Tests:** 
  - `src/tests/simulation.test.ts` (Automated processing)

## 6. MVP Reference
- **Target MVP:** MVP 6
- **Prerequisites:** Base Building, Logistics AI.

---
*Created by AI Agent on: May 13, 2026*
*Last Updated: May 13, 2026*
