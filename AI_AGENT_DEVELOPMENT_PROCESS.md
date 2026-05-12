# AI Agent Development Process

> Development workflow for the Idle Survivor Sandbox project.  
> This document tells AI agents how to develop the project smoothly, safely, and consistently.

---

# 1. Purpose

This document defines the standard development process for AI agents working on the Idle Survivor Sandbox project.

The goal is to make AI development:

- predictable
- modular
- testable
- documentation-driven
- low-risk
- easy to continue across multiple sessions

The project should always preserve its core identity:

```text
Autonomous survivor tries to survive.
Player assists indirectly.
World pressure escalates over time.
Infrastructure improves survival.
Emergent stories come from AI + survival systems.
```

---

# 2. Core Rule for All Agents

Before implementing anything, every AI agent must understand this rule:

```text
The player accelerates survival.
The player does NOT replace survival.
```

This means:

- Survivor must be able to act automatically.
- Player interactions should support or improve survivor behavior.
- The game should not become a direct-control RTS.
- The game should not become a pure clicker.
- AI readability is mandatory.

---

# 3. Required Reading Order

Before working, the AI agent must read files in this order:

```text
1. README.md
2. GEMINI.md
3. PROJECT_STATUS.md
4. docs/design/00_MASTER_INDEX.md
5. docs/agents/AGENTS.md
6. Relevant agent role file in docs/agents/
7. Relevant system design document in docs/design/
8. Existing source files related to the task
9. Existing tests related to the task
```

If any of these files are missing, the agent should create or update them only when appropriate.

---

# 4. Standard Agent Workflow

Every task should follow this sequence:

```text
Understand
→ Inspect
→ Plan
→ Implement
→ Test
→ Document
→ Report
```

---

# 5. Step 1 — Understand

The agent must first identify:

- What feature is being requested?
- Which system owns this feature?
- Which agent role is responsible?
- Is this part of MVP 1, MVP 2, or later?
- Does this preserve the game identity?
- Does this affect existing systems?

## Output Required

Before coding, the agent should summarize:

```text
Task:
Affected systems:
Relevant files:
Implementation risk:
Expected result:
```

---

# 6. Step 2 — Inspect

The agent must inspect existing project structure before editing.

## Required Inspection

Check:

- current folder structure
- existing game loop
- existing simulation files
- existing entity definitions
- existing AI/task files
- existing UI/input files
- existing tests
- existing data tables

## Do Not

Do not create duplicate systems if an existing system already exists.

Bad:

```text
Create new SurvivorAI.ts while existing ai/SurvivorBrain.ts already exists.
```

Good:

```text
Extend existing SurvivorBrain.ts and update related tests.
```

---

# 7. Step 3 — Plan

Before implementation, the agent must create a small implementation plan.

## Plan Format

```text
Plan:
1. Files to edit
2. Files to create
3. Data changes
4. Test changes
5. Documentation changes
6. Risks / assumptions
```

## Plan Rules

- Keep plan small.
- Prefer vertical slices.
- Avoid implementing multiple major systems at once.
- Do not refactor unrelated systems.
- Do not change architecture unless requested or necessary.

---

# 8. Step 4 — Implement

Implementation must be small, focused, and testable.

## Implementation Rules

1. Keep simulation separate from rendering.
2. Keep data separate from runtime state.
3. Keep AI decisions inspectable.
4. Avoid hardcoding when a data table is better.
5. Avoid large unrelated refactors.
6. Maintain TypeScript type safety.
7. Keep functions short and named clearly.
8. Add comments only where logic is non-obvious.
9. Do not silently change game rules without updating docs.
10. Do not break existing tests.

---

# 9. Recommended Project Architecture

For React + Vite + TypeScript + Canvas:

```text
src/
  app/
    App.tsx
    main.tsx

  game/
    Game.ts
    GameLoop.ts
    GameConfig.ts

  simulation/
    Simulation.ts
    SimulationTick.ts
    TimeSystem.ts

  entities/
    Survivor.ts
    ResourceNode.ts
    Monster.ts
    Structure.ts
    Item.ts

  ai/
    SurvivorBrain.ts
    TaskSelector.ts
    Tasks.ts
    UtilityScoring.ts

  systems/
    HungerSystem.ts
    HealthSystem.ts
    InventorySystem.ts
    CraftingSystem.ts
    GatheringSystem.ts
    CombatSystem.ts
    DayNightSystem.ts
    StorageSystem.ts

  data/
    items.ts
    recipes.ts
    resources.ts
    monsters.ts
    structures.ts

  rendering/
    CanvasRenderer.ts
    Camera.ts
    Sprites.ts

  input/
    MouseInput.ts
    InteractionSystem.ts

  ui/
    Hud.tsx
    CraftingPanel.tsx
    StoragePanel.tsx
    SurvivorStatusPanel.tsx

  tests/
    simulation/
    ai/
    systems/
```

---

# 10. Separation of Concerns

## Simulation

The simulation owns:

- survivor state
- hunger
- health
- AI decisions
- resource changes
- combat outcomes
- time progression

The simulation must run without React or Canvas.

## Rendering

Rendering owns:

- drawing entities
- camera
- visual effects
- animation display

Rendering must not decide gameplay rules.

## UI

UI owns:

- panels
- buttons
- crafting menu
- status display
- alerts

UI sends commands to simulation but does not directly mutate deep simulation state.

## Input

Input owns:

- mouse click
- drag/drop
- hover detection
- interaction commands

Input should produce clean commands like:

```ts
{
  type: "ASSIST_GATHER",
  targetId: "tree_001"
}
```

---

# 11. Command-Based Interaction Rule

Player input should become commands.

## Example Commands

```ts
type PlayerCommand =
  | { type: "ASSIST_GATHER"; targetId: string }
  | { type: "ASSIST_ATTACK"; targetId: string }
  | { type: "DROP_ITEM"; itemId: string; x: number; y: number }
  | { type: "PLACE_STRUCTURE"; structureId: string; x: number; y: number }
  | { type: "UNLOCK_RECIPE"; recipeId: string };
```

## Why

This keeps the game:

- testable
- deterministic
- replayable
- easier for AI agents to modify
- easier to debug

---

# 12. AI Development Rules

The Survivor AI should be built in layers.

## Layer 1 — Needs Detection

Examples:

- hunger low
- night coming
- monster nearby
- tool missing
- resource needed

## Layer 2 — Task Selection

Examples:

- eat food
- gather berries
- craft torch
- return to camp
- flee monster
- attack monster

## Layer 3 — Task Execution

Examples:

- move to target
- play work timer
- consume resource
- produce item
- update inventory

## Layer 4 — Feedback

Examples:

- thought bubble
- task icon
- warning icon
- target indicator

---

# 13. AI Task Priority Rule

The AI must always prioritize survival first.

```text
Immediate danger
> Light safety
> Hunger
> Combat survival
> Required resources
> Crafting
> Storage
> Exploration
```

---

# 14. AI Debug Requirement

Every AI decision should be inspectable.

Recommended debug output:

```ts
{
  currentTask: "GatherFood",
  reason: "Hunger below threshold",
  score: 85,
  targetId: "berry_bush_004"
}
```

This helps both developers and future AI agents understand behavior.

---

# 15. Data-Driven Development Rule

Use tables for tunable values.

## Recommended Data Tables

- items
- recipes
- resource nodes
- monsters
- structures
- survivor stats
- task weights
- biome definitions
- threat schedules

## Bad

```ts
if (item.id === "axe") damage = 3;
```

## Good

```ts
const toolPower = itemData[item.id].toolPower;
```

---

# 16. Testing Process

Every feature should include tests when possible.

## Required Test Types

### Unit Tests

For pure functions:

- hunger decay
- crafting cost validation
- AI scoring
- damage calculation

### Integration Tests

For system interactions:

- survivor gathers berries when hungry
- survivor crafts torch before night
- player click speeds up gathering
- monster attack reduces health

### Simulation Tests

For long-run behavior:

- survivor can survive day 1
- survivor can survive first night if resources exist
- survivor dies if no food exists
- player assistance improves survival time

---

# 17. Long Simulation Testing Rule

Idle survival games require long-run tests.

Recommended simulation tests:

```text
1 in-game day
3 in-game days
7 in-game days
30 in-game days
```

These tests should detect:

- resource deadlocks
- AI loops
- starvation bugs
- impossible crafting chains
- runaway resource gain
- threat pacing issues

---

# 18. Balance Workflow

Balance should be adjusted through data, not code.

## Balance Loop

```text
Run simulation
→ Review survival duration
→ Identify bottleneck
→ Adjust data table
→ Re-run simulation
→ Document change
```

## Key Metrics

- average survival time without player
- average survival time with player
- food gathered per day
- wood gathered per day
- tool break frequency
- monster damage per day
- number of emergency moments
- idle progression speed

---

# 19. Documentation Process

Any implemented system must update documentation.

## Required Documentation Updates (Rule of Three)

Whenever a feature is implemented or modified, the agent MUST update:
1.  **`PROJECT_STATUS.md`**: Tick off completed tasks and update accomplishments.
2.  **`docs/design/09_mvp_roadmap.md`**: Ensure the high-level roadmap reflects the current phase.
3.  **Relevant System Design Doc**: Update the specific mechanics, data, or technical specs.

## Cross-Referencing Mandate

- All documentation should use relative links (e.g., `[Roadmap](./09_mvp_roadmap.md)`) to keep the "knowledge graph" navigable.
- If a new system is added, create a new document in `docs/design/` using the `docs/templates/NEW_SYSTEM_TEMPLATE.md`.

## Verification Step

Before finishing a task, the agent should verify:
- All documentation links are valid.
- The `00_MASTER_INDEX.md` status table is up-to-date.
- `CHANGELOG.md` reflects the changes.

---

# 20. Changelog Rule

Every meaningful change should update `CHANGELOG.md`.

## Format

```md
# CHANGELOG

## YYYY-MM-DD

### Added
- Added survivor hunger decay system.

### Changed
- Adjusted berry food value from 10 to 15.

### Fixed
- Fixed survivor ignoring nearby food when hungry.

### Notes
- AI now prioritizes food when hunger is below 35%.
```

---

# 21. Task Size Rule

AI agents should work in small vertical slices.

## Good Task

```text
Implement hunger decay and eating behavior.
```

## Bad Task

```text
Implement full survival game with crafting, AI, combat, worldgen, and UI.
```

## Recommended Task Size

A good AI task should usually touch:

- 1 to 3 systems
- 2 to 6 files
- 1 test group
- 1 documentation update

---

# 22. MVP Development Order

## MVP 1 Foundation

```text
1. Simulation tick
2. Entity model
3. Survivor stats
4. Resource nodes
5. Basic AI task selection
6. Gathering
7. Hunger
8. Eating
9. Day/night
10. Light safety
11. Player click assistance
12. Basic monster
13. Simple combat
14. HUD status display
```

## MVP 2 Expansion

```text
1. Crafting unlocks
2. Tool durability
3. Storage
4. Campfire
5. Crafting station
6. Monster waves
7. Base structures
8. Better AI feedback
```

## MVP 3 Depth

```text
1. Morale/sanity
2. Weather
3. Farming
4. Multiple survivors
5. Personality traits
6. Biomes
7. Longer progression
```

---

# 23. Feature Acceptance Checklist

A feature is accepted only if:

- It fits the project identity.
- It has clear player value.
- It does not break autonomous AI.
- It is testable.
- It has UI/readability if player-facing.
- It updates data tables if tunable.
- It updates documentation.
- It does not create major scope creep.

---

# 24. Bug Fix Process

When fixing a bug:

```text
1. Reproduce the bug.
2. Identify affected system.
3. Add a failing test if possible.
4. Fix the smallest possible cause.
5. Run related tests.
6. Update documentation if behavior changed.
7. Report exact files changed.
```

Do not refactor unrelated systems while fixing bugs.

---

# 25. Refactor Process

Refactor only when:

- current structure blocks progress
- duplicate logic is causing bugs
- tests exist or can be added
- behavior can be preserved

## Refactor Rules

- Preserve behavior first.
- Add tests before risky refactor.
- Refactor in small steps.
- Do not combine refactor with major feature implementation.
- Update architecture docs.

---

# 26. AI Agent Handoff Format

At the end of a task, the agent must report:

```text
Completed:
Files changed:
Tests added/updated:
Docs updated:
Known issues:
Next recommended task:
```

This makes it easier for another AI agent to continue.

---

# 27. Branch / Commit Recommendation

If using Git:

## Branch Naming

```text
feature/mvp1-survivor-hunger
feature/mvp1-basic-gathering
fix/ai-food-priority
docs/update-agent-process
```

## Commit Message Format

```text
feat(ai): add hunger-driven food gathering task
fix(combat): prevent survivor attacking dead monster
docs(process): add agent development workflow
test(sim): add day one survival simulation
```

---

# 28. Common AI Agent Mistakes to Avoid

## Mistake 1 — Building Too Much

Do not implement multiple milestones at once.

## Mistake 2 — Ignoring Existing Files

Always inspect before creating new files.

## Mistake 3 — Mixing Rendering and Simulation

Gameplay logic must not live inside canvas rendering code.

## Mistake 4 — Making Player Too Powerful

Player support should help, not replace survivor.

## Mistake 5 — Making AI Unreadable

AI must explain what it is doing through UI/debug state.

## Mistake 6 — Hardcoding Balance

Use data tables.

## Mistake 7 — Not Updating Docs

Documentation is part of the task.

---

# 29. Recommended First Agent Task

Use this prompt for the first AI coding pass:

```text
Read README.md, GEMINI.md, PROJECT_STATUS.md, docs/design/00_MASTER_INDEX.md, docs/agents/AGENTS.md, and AI_AGENT_DEVELOPMENT_PROCESS.md.
```
Inspect the project structure.

Create a short MVP 1 implementation plan for:
- simulation tick
- single survivor entity
- hunger stat
- basic resource nodes
- basic AI task selection

Do not implement yet.
Report files that should be created or modified.
```

---

# 30. Recommended First Implementation Prompt

Use this after the plan is approved:

```text
Implement MVP 1 foundation:
- simulation tick
- single survivor entity
- hunger stat decay
- basic resource node model
- basic AI task selector

Requirements:
- Keep simulation separate from rendering.
- Use TypeScript types.
- Add minimal tests for hunger decay and AI food priority.
- Update relevant .md documentation.
- Report changed files and next recommended task.
```

---

# 31. Definition of Done

A task is done only when:

```text
Feature works
+ relevant tests pass
+ docs are updated
+ affected systems are listed
+ next task is recommended
```

---

# 32. Final Instruction for AI Agents

Do not optimize for writing a lot of code.

Optimize for:

```text
Stable small steps
Readable systems
Testable simulation
Clear documentation
Preserved game identity
```
