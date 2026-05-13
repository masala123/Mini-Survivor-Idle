import React, { useEffect, useRef } from 'react';
import { Simulation } from '../simulation/Simulation';
import { BiomeType } from '../game/world';
import { worldToMinimap } from './minimapCoords';

const biomeColor = (biome: BiomeType): string => {
  switch (biome) {
    case 'GRASSLAND':
      return '#2d5a27';
    case 'FOREST':
      return '#1b4b2a';
    case 'SWAMP':
      return '#2b3b2f';
    case 'DESERT':
      return '#7a6b3f';
    case 'VOLCANIC':
      return '#4a1515';
  }
};

export const Minimap: React.FC<{ sim: Simulation; width?: number; height?: number }> = ({ sim, width = 160, height = 120 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (!sim.world) return;

    ctx.clearRect(0, 0, width, height);

    // Background biomes (fogged by discovery)
    const world = sim.world;
    const { widthTiles, heightTiles } = world.config;

    const tileW = width / widthTiles;
    const tileH = height / heightTiles;
    for (let ty = 0; ty < heightTiles; ty++) {
      for (let tx = 0; tx < widthTiles; tx++) {
        const biome = world.biomeAtTile(tx, ty);
        const isKnown = sim.discovered?.[ty]?.[tx] === true;
        ctx.fillStyle = isKnown ? biomeColor(biome) : '#101010';
        ctx.fillRect(tx * tileW, ty * tileH, tileW, tileH);
      }
    }

    // Entities
    const toMM = (x: number, y: number) => worldToMinimap(world, { width, height }, x, y);

    // POIs (cyan dots once discovered, dimensional are purple)
    for (const p of sim.pois || []) {
      if (!sim.discoveredPoiIds?.has(p.id)) continue;
      const wx = world.config.originX + p.tx * world.config.tileSize + world.config.tileSize / 2;
      const wy = world.config.originY + p.ty * world.config.tileSize + world.config.tileSize / 2;
      const { mx, my } = toMM(wx, wy);

      if (p.type === 'CRYSTAL_RUIN' || p.type === 'DIMENSIONAL_ANOMALY') {
        ctx.fillStyle = '#ff00ff'; // Neon purple
        ctx.fillRect(mx - 3, my - 3, 6, 6); // slightly larger
      } else {
        ctx.fillStyle = '#33d6ff';
        ctx.fillRect(mx - 2, my - 2, 4, 4);
      }
    }

    // Resources (red dots)
    ctx.fillStyle = '#ff4444';
    for (const r of sim.resources) {
      const { mx, my } = toMM(r.x, r.y);
      ctx.fillRect(mx - 1, my - 1, 2, 2);
    }

    // Structures (white dots)
    ctx.fillStyle = '#ffffff';
    for (const s of sim.structures) {
      const { mx, my } = toMM(s.x, s.y);
      ctx.fillRect(mx - 1, my - 1, 2, 2);
    }

    // Animals (purple dots)
    ctx.fillStyle = '#b388ff';
    for (const a of sim.animals) {
      const { mx, my } = toMM(a.x, a.y);
      ctx.fillRect(mx - 1, my - 1, 2, 2);
    }

    // Survivors (yellow dots)
    ctx.fillStyle = '#ffcc00';
    for (const s of sim.survivors) {
      const { mx, my } = toMM(s.x, s.y);
      ctx.fillRect(mx - 2, my - 2, 4, 4);
    }

    // Frame
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, width - 1, height - 1);
  }, [sim, width, height, sim.tickCount, sim.resources.length, sim.structures.length, sim.animals.length, sim.survivors.length]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ display: 'block' }} />;
};
