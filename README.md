# Idle Survivor Sandbox

An autonomous survivor tries to survive in a dangerous prehistoric world. The player assists indirectly through world interaction, infrastructure building, and emergency support.

## Project Vision

- **Autonomous Survival:** The survivor acts on their own using Utility AI.
- **Indirect Assistance:** The player "nudges" the simulation rather than controlling the survivor directly.
- **Dinosaur Prehistoric Theme:** Set in a world of dinosaurs and dimensional mysteries.
- **Browser-Based:** Built with React 19, Vite 6, and HTML5 Canvas.

## 🚀 Getting Started for AI Agents

If you are an AI agent tasked with developing this project, follow this order:

1.  **Process:** Read [AI_AGENT_DEVELOPMENT_PROCESS.md](./AI_AGENT_DEVELOPMENT_PROCESS.md) to understand the workflow and architecture.
2.  **Context:** Read [GEMINI.md](./GEMINI.md) for CLI-specific instructions.
3.  **Design:** Explore [docs/design/](./docs/design/00_MASTER_INDEX.md) for game systems.
4.  **Roles:** Check [docs/agents/](./docs/agents/00_AGENT_ROLE_INDEX.md) to identify your current role.
5.  **Status:** Review [PROJECT_STATUS.md](./PROJECT_STATUS.md) for the current development phase.

## 🛠 Tech Stack

- **Frontend:** React 19, Vite 6, TypeScript
- **Rendering:** HTML5 Canvas (2D/Isometric)
- **State Management:** Custom Simulation Logic (Independent of React)
- **AI:** Utility-based Task Selection
- **Testing:** Vitest

## Dev Commands

- `npm run dev` — start dev server
- `npm test` — run tests once (non-watch)
- `npm run test:watch` — watch mode
- `npm run build` — typecheck + production build
- `npm run lint` — eslint (flat config via `eslint.config.js`)

## 📂 Project Structure

- `src/`: Source code (to be implemented)
- `docs/`:
    - `design/`: Game design documents
    - `agents/`: AI agent role definitions
    - `research/`: Reference materials and analysis
- `AI_AGENT_DEVELOPMENT_PROCESS.md`: Core development workflow rules.
- `PROJECT_STATUS.md`: Current milestone and task tracking.
