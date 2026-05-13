# Advanced Farming (MVP 7)

## Overview

The Advanced Farming system introduces irrigation to automate and accelerate food production. It requires both water sources and electrical power.

## Core Concepts

- **Water Source**: `SWAMP` biomes act as natural water sources.
- **Water Pump**: A powered structure that extracts water from a nearby source.
- **Irrigation Range**: Farm plots within a certain radius of a Water Pump receive the "Irrigated" status.
- **Growth Bonus**: Irrigated farm plots grow 2x faster (stackable with Rain).

## Structures

### 1. Water Pump
| Attribute | Value |
|---|---|
| Type | UTILITY |
| Ingredients | Stone (5), Refined Fossil (2), Ancient Tech (1) |
| Power Req | 10W |
| Requirement | Must be placed within 100 units of a `SWAMP` tile. |

## Technical Implementation

### Simulation
- `FarmingSystem.ts` will check for nearby active `WaterPump` structures during the growth tick.
- Farm plots will have an `isIrrigated` boolean state for rendering.

### AI Integration
- `GATHERER` survivors will still prioritize harvesting, but the increased speed will make them more efficient.

## UI/UX
- Irrigated farm plots will show a "blue droplet" icon or a darker soil color.
- Water pumps will show a "pumping" animation (pulsing scale).
