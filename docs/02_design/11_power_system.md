# Power System (MVP 7)

## Overview

The Power System introduces electricity as a second-tier resource required to operate advanced machinery and automated defenses. It transitions the base from prehistoric/medieval tech to "Anomalous Industrial" tech.

## Core Concepts

- **Generation**: Structures that produce power (Watts).
- **Consumption**: Structures that require power to function or gain efficiency bonuses.
- **Storage**: Structures that store excess power for night or peak demand.
- **Grid**: All power structures within a certain radius of each other are automatically connected (Simplified Grid).

## Power Structures

### 1. Generation
| Structure | Type | Output | Requirement |
|---|---|---|---|
| **Solar Panel** | Sustainable | 20W (Day) | Sunlight (No rain) |
| **Coal Generator** | Fuel-based | 50W | Wood or Refined Fossils |

### 2. Storage
| Structure | Capacity | Discharge |
|---|---|---|
| **Battery Bank** | 1000Wh | 50W max |

### 3. Consumption
| Structure | Power Req | Effect |
|---|---|---|
| **Electric Smelter** | 15W | Processes materials 2x faster than Furnace |
| **Searchlight** | 5W | Keeps night monsters further away from base |
| **Auto-Turret** | 10W | Automatically attacks hostiles in range |

## Technical Implementation

### Simulation
- `PowerSystem.ts` will manage the global energy balance of the base.
- Each `Structure` will have `powerOutput` and `powerConsumption` properties.
- `batteryLevel` will track stored energy.

### AI Integration
- `LOGISTICS` survivors will prioritize fueling Coal Generators if the battery is low.
- `BUILDER` survivors will prioritize building power infrastructure.

## UI/UX
- HUD will show a "Base Power" status bar (Current Output vs Consumption).
- Powered structures will have a visual indicator (e.g., a small spark or green light).
