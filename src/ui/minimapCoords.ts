import { World } from '../game/world';

export interface MinimapRect {
  width: number;
  height: number;
}

export const worldToMinimap = (
  world: World,
  rect: MinimapRect,
  x: number,
  y: number
): { mx: number; my: number } => {
  const { widthTiles, heightTiles, tileSize, originX, originY } = world.config;
  const worldWidth = widthTiles * tileSize;
  const worldHeight = heightTiles * tileSize;

  const nx = (x - originX) / worldWidth; // 0..1
  const ny = (y - originY) / worldHeight; // 0..1

  return {
    mx: nx * rect.width,
    my: ny * rect.height,
  };
};

