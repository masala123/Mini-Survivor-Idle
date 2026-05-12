# Survivor AI System

## AI Priority Stack

```text
1. Avoid death
2. Maintain light
3. Eat food
4. Escape danger
5. Gather critical resources
6. Maintain tools
7. Expand capabilities
8. Explore
```

## Autonomous Behaviors

- Gathering
- Eating
- Crafting known recipes
- Equipping tools
- Basic combat
- Returning to camp

## AI Design Goal

The AI must be:

- Competent
- Readable
- Imperfect
- Assistable

## Exploration (MVP 4)

- When there are no urgent needs (no immediate hunger, morale crisis, or danger), survivors can choose a `SCOUT` task to move toward the nearest frontier tile (unknown adjacent to known) to reveal fog-of-war.
- After starting `SCOUT`, survivors enter a short cooldown before they will scout again.
