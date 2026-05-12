# Gemini CLI Context - Idle Survivor Sandbox

This file provides context for the Gemini CLI agent working on this project.

## Core Mandates

- **Simulation First:** Gameplay logic must be independent of rendering.
- **AI Readability:** Survivor AI decisions must be inspectable (debug strings/states).
- **Data Driven:** Use tables/configs for balancing, not hardcoded values.
- **Surgical Edits:** Follow the `AI_AGENT_DEVELOPMENT_PROCESS.md` for all changes.
- **Documentation Integrity:** Every code change requires a corresponding update to design docs. The documentation is the "Source of Truth" for the AI.

## Development Constraints

- **Language:** TypeScript 5.7+
- **Styling:** Vanilla CSS
- **Framework:** React 19 (UI only), Canvas (World)
- **Icons/Assets:** Use stylized CSS shapes or pixel-art placeholders.

## Project Identity

"The player accelerates survival. The player does NOT replace survival."

## Active Instruction Files

- [./docs/00_project_control/ai_agent_rules.md](./docs/00_project_control/ai_agent_rules.md)
- [./docs/00_project_control/agents/16_agent_collaboration_rules.md](./docs/00_project_control/agents/16_agent_collaboration_rules.md)
- [./AI_AGENT_GENERAL_GAME_PRODUCT_PIPELINE.md](./AI_AGENT_GENERAL_GAME_PRODUCT_PIPELINE.md)
- [./docs/00_project_control/00_MASTER_INDEX.md](./docs/00_project_control/00_MASTER_INDEX.md)

