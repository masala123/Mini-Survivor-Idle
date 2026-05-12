import { describe, it, expect } from 'vitest';
import { createWorld } from '../game/world';
import { worldToMinimap } from '../ui/minimapCoords';

describe('minimapCoords', () => {
  it('should map world corners into minimap rect', () => {
    const world = createWorld(1, 10, 10, 20);
    const rect = { width: 100, height: 80 };
    const { originX, originY, widthTiles, heightTiles, tileSize } = world.config;

    const topLeft = worldToMinimap(world, rect, originX, originY);
    expect(topLeft.mx).toBe(0);
    expect(topLeft.my).toBe(0);

    const bottomRight = worldToMinimap(world, rect, originX + widthTiles * tileSize, originY + heightTiles * tileSize);
    expect(bottomRight.mx).toBe(rect.width);
    expect(bottomRight.my).toBe(rect.height);
  });
});

