# World and Biomes

## World Structure

- **Procedural Generation**: Grid-based world with deterministic seeding.
- **Biome Grid**: Tile-based biomes affecting resource spawning and environmental hazards.
- **Resource Nodes**: `BERRY_BUSH`, `TREE`, `STONE`, `FERN_BUSH`, `BONE_PILE`, `FOSSIL_DEPOSIT`, `ANCIENT_TECH_NODE`.
- **Ecosystem**: Dynamic animal life with predator/prey relationships and player interaction.
- **Day/Night Cycle**: Affects visibility, temperature, and animal behavior (Night monsters).

## UI & Exploration

- **Minimap**: Visualizes discovered biome tiles and entity positions.
- **Fog-of-War**: Tiles remain hidden until explored by a survivor (Scout task).
- **Points of Interest (POIs)**: 
  - `CRYSTAL_RUIN`: Grant ancient materials or tech.
  - `DIMENSIONAL_ANOMALY`: End-game resource nodes.
  - `RUIN` / `STONE_RING`: Morale boosts or history.
  - `BONFIRE_SITE`: Spawns a pre-built campfire.

## Biomes & Hazards

| Biome | Description | Resources | Hazard |
|---|---|---|---|
| **GRASSLAND** | Open plains | Berries, Ferns | Low |
| **FOREST** | Dense trees | Wood, Ferns | Mid (Raptors) |
| **SWAMP** | Murky wetlands | Ferns, Ancient Tech | Mid (Slow movement) |
| **DESERT** | Dry sands | Bones, Fossils | Mid (Heat) |
| **VOLCANIC** | Magma & Ash | Refined Fossils | **High (Heat Damage)** |

## Dinosaur Ecosystem (Animals)

Animals belong to one of three factions:
- **NEUTRAL**: Wander and graze (e.g., Triceratops, Ankylosaurus). Can be tamed.
- **HOSTILE**: Hunt survivors and neutral dinosaurs (e.g., Compsognathus, Velociraptor, T-Rex).
- **TAMED**: Follow survivors, defend the base, and can be mounted for transport.
