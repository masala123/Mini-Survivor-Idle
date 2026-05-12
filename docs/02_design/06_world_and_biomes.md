# World and Biomes

## World Structure

- Procedural generation
- Deterministic seedable biome grid (MVP 4 groundwork)
- Initial resources spawn based on biome (MVP 4 groundwork)
- Resource nodes
- Monster spawning
- Day/night cycle
- Biome distribution

## UI

- A minimap can visualize biome tiles and entity positions (survivors/resources/structures/monsters).
- Fog-of-war discovery can hide undiscovered tiles until survivors explore nearby.
- Points of interest can be discovered via exploration and shown on the minimap.
- Discovered POIs can grant one-time rewards (e.g., items or morale boosts).
- Some POIs can spawn world changes (e.g., a bonfire site becomes a campfire structure).

## Example Biomes

| Biome | Resources | Threat |
|---|---|---|
| Forest | Wood | Spiders |
| Grassland | Food | Hounds |
| Swamp | Rare materials | Tentacles |
| Desert | Advanced resources | Heat |

## Biome Formula

```text
Reward + Danger
```
