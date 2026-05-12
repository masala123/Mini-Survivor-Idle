
# Browser Tech Stack Architecture - Idle Survivor Sandbox

## Core Stack

- React 19
- Vite 6
- TypeScript 5.7+
- HTML5 Canvas
- Vanilla CSS
- Vitest
- ESLint
- Prettier
- pnpm

## Architecture Philosophy

Simulation-driven architecture.

The simulation must exist independently from rendering.

## Core Layers

Input
→ Command System
→ Simulation
→ AI Decision Layer
→ Gameplay Systems
→ Rendering
→ UI

## Recommended Folder Structure

src/
  app/
  game/
  simulation/
  entities/
  ai/
  systems/
  rendering/
  input/
  ui/
  data/
  assets/
  tests/

## AI Recommendation

Use Utility AI + Task System.

Avoid giant monolithic behavior trees early.

## Rendering Recommendation

Use HTML5 Canvas for:
- world rendering
- entities
- lighting
- particles
- animations

Use React only for:
- HUD
- menus
- crafting
- overlays
- debug tools

## Simulation Recommendation

- Fixed simulation tick
- Deterministic simulation
- Command-based interactions
- Data-driven systems

## Recommended Tick Rates

Simulation:
10 ticks/sec

Rendering:
60 FPS

## Required Data Tables

- items
- recipes
- monsters
- resources
- structures
- tasks
- biomes
- threats

## Testing Stack

- Vitest
- simulation tests
- AI behavior tests
- integration tests

## Deployment

Recommended:
- itch.io
- Vercel
- Netlify

## Final Recommendation

Prioritize:
- strong simulation
- readable AI
- survival pressure
- modular systems

NOT graphical complexity.
