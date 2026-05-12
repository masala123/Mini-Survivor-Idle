# System Design: Riding System

## 1. Overview
The Riding System allows survivors to mount tamed prehistoric creatures to enhance their mobility and utility. This system is a core part of the mid-to-late game progression, rewarding the player for successful taming.

## 2. Core Mechanics
- **Mounting:** Survivors can mount a `TAMED` animal if they are within proximity (60 units).
- **Movement Speed:** While mounted, the survivor's movement speed is increased (default 2x multiplier).
- **Position Sync:** The survivor's position is locked to the animal's position every tick.
- **Dismounting:** The player can command a survivor to dismount at any time. The survivor will appear at the animal's current location.
- **Safety:** Tamed animals act as a buffer in combat (planned feature: damage sharing).

## 3. Data Requirements
- **Survivor State:** `mountedAnimalId: string | null`.
- **Animal State:** `mountedBySurvivorId: string | null`.

## 4. Integration
- **Simulation:** Syncs coordinates between the survivor and the mount.
- **AI Brain:** `moveSurvivor` helper automatically applies speed bonuses if the survivor is mounted.
- **Interaction System:** Commands `MOUNT_ANIMAL` and `DISMOUNT_ANIMAL`.

## 5. Technical Specification
- **Implementation Status:** Implemented ✅
- **Key Files:** 
  - `src/entities/Survivor.ts`
  - `src/entities/Animal.ts`
  - `src/ai/SurvivorBrain.ts`
  - `src/simulation/Simulation.ts`
- **Relevant Tests:** 
  - `src/tests/simulation.test.ts`

## 6. MVP Reference
- **Target MVP:** MVP 5
- **Prerequisites:** Taming System.

---
*Created by AI Agent on: May 13, 2026*
*Last Updated: May 13, 2026*
