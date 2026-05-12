# Player Interaction System

## Player Actions

| Action | Function |
|---|---|
| Click Tree | Help chop faster |
| Click Rock | Help mine |
| Click Monster | Assist combat |
| Throw Item | Give equipment |
| Place Structure | Build infrastructure |
| Unlock Tech | Expand civilization |

## Core Rule

```text
Player accelerates survival
NOT replaces survival
```

## Current Implementation (MVP)

- Clicking **resources** on the canvas issues `ASSIST_GATHER` for that node.
- Clicking **monsters** on the canvas issues `ASSIST_ATTACK` for that monster.
- Player can **select a survivor** in the HUD; assist commands route to that survivor when possible.
- HUD exposes **Emergency Feed/Heal** per survivor.
- HUD supports **Throw Item** (give equipment/food) to the selected survivor.
- HUD supports **Place Structure**: choose a structure, then click on the canvas to place a blueprint at that location (consumes materials from the selected survivor).
  - Placement shows a simple ghost preview and snaps to a small grid.
  - Placement is blocked if the target tile overlaps existing entities.
