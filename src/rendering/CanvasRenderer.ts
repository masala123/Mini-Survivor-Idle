import { Simulation } from '../simulation/Simulation';
import { BiomeType } from '../game/world';

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private placementPreview: { structureId: string; x: number; y: number; isValid: boolean } | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  public setPlacementPreview(preview: { structureId: string; x: number; y: number; isValid: boolean } | null): void {
    this.placementPreview = preview;
  }

  public clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    // Background
    this.ctx.fillStyle = '#2d5a27'; // Dark green grass
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  public render(sim: Simulation) {
    this.clear();
    this.renderWorld(sim);

    // Render POIs
    if (sim.world) {
        for (const poi of sim.pois) {
            if (!sim.discoveredPoiIds.has(poi.id)) continue;
            
            const { originX, originY, tileSize } = sim.world.config;
            const px = originX + poi.tx * tileSize + tileSize / 2;
            const py = originY + poi.ty * tileSize + tileSize / 2;

            if (poi.type === 'CRYSTAL_RUIN') {
                this.ctx.fillStyle = '#ff00ff';
                this.ctx.beginPath();
                this.ctx.moveTo(px + 200, py + 200 - 15);
                this.ctx.lineTo(px + 200 + 10, py + 200 + 10);
                this.ctx.lineTo(px + 200 - 10, py + 200 + 10);
                this.ctx.fill();
            } else if (poi.type === 'DIMENSIONAL_ANOMALY') {
                this.ctx.strokeStyle = '#aa00ff';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(px + 200, py + 200, 15, 0, Math.PI * 2);
                this.ctx.stroke();
            } else if (poi.type === 'RUIN') {
                this.ctx.fillStyle = '#666666';
                this.ctx.fillRect(px + 200 - 15, py + 200 - 15, 30, 30);
            } else if (poi.type === 'STONE_RING') {
                this.ctx.strokeStyle = '#aaaaaa';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(px + 200, py + 200, 20, 0, Math.PI * 2);
                this.ctx.stroke();
            } else if (poi.type === 'BONFIRE_SITE') {
                this.ctx.fillStyle = '#442222';
                this.ctx.beginPath();
                this.ctx.arc(px + 200, py + 200, 12, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // POI label
            this.ctx.fillStyle = 'rgba(255,255,255,0.7)';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(poi.type, px + 200 - 20, py + 200 - 20);
        }
    }

    // Render Resources
    for (const res of sim.resources) {
      if (res.type === 'BERRY_BUSH') this.ctx.fillStyle = '#8b0000';
      else if (res.type === 'FERN_BUSH') this.ctx.fillStyle = '#006400'; // Dark green fern
      else if (res.type === 'TREE') this.ctx.fillStyle = '#5d4037';
      else if (res.type === 'STONE') this.ctx.fillStyle = '#757575';
      else if (res.type === 'BONE_PILE') this.ctx.fillStyle = '#e0e0d1'; // Bone color
      else if (res.type === 'FOSSIL_DEPOSIT') this.ctx.fillStyle = '#8b7355'; // Fossil color
      else if (res.type === 'ANCIENT_TECH_NODE') this.ctx.fillStyle = '#00ffff'; // Glowing cyan
      else this.ctx.fillStyle = '#4a4a4a';

      this.ctx.beginPath();
      this.ctx.arc(res.x + 200, res.y + 200, 10, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Amount text
      this.ctx.fillStyle = 'white';
      this.ctx.font = '10px Arial';
      this.ctx.fillText(`${res.amount}`, res.x + 195, res.y + 185);
    }

    // Render Structures
    for (const struct of sim.structures) {
      if (struct.type === 'campfire') this.ctx.fillStyle = '#ff5722';
      else if (struct.type === 'workbench') this.ctx.fillStyle = '#4e342e';
      else if (struct.type === 'chest') this.ctx.fillStyle = '#795548';
      else if (struct.type === 'wood_shed') this.ctx.fillStyle = '#4e342e'; // Darker wood
      else if (struct.type === 'stone_mason') this.ctx.fillStyle = '#424242'; // Dark stone
      else if (struct.type === 'furnace') {
          const isProcessing = (struct.inventory?.['fossil'] || 0) >= 1 && (struct.inventory?.['wood'] || 0) >= 1;
          this.ctx.fillStyle = isProcessing ? '#f4511e' : '#546e7a'; // Orange if hot, Blue-grey if cold
      }
      else if (struct.type === 'farm_plot') this.ctx.fillStyle = '#33691e';
      else if (struct.type === 'wall') this.ctx.fillStyle = '#3e2723';
      else if (struct.type === 'bone_wall') this.ctx.fillStyle = '#f5f5f5';
      else if (struct.type === 'spike_trap') this.ctx.fillStyle = struct.isTriggered ? '#212121' : '#b71c1c';
      else if (struct.type === 'dimensional_beacon') this.ctx.fillStyle = '#9c27b0';
      else this.ctx.fillStyle = '#444';

      if (!struct.isComplete) {
        this.ctx.globalAlpha = 0.4;
      }

      this.ctx.fillRect(struct.x + 190, struct.y + 190, 20, 20);

      // Structure Health Bar (only for relevant buildings)
      if (struct.type === 'wall' || struct.type === 'bone_wall' || struct.type === 'spike_trap' || struct.type === 'wood_shed' || struct.type === 'stone_mason') {
          this.ctx.fillStyle = '#ff0000';
          this.ctx.fillRect(struct.x + 190, struct.y + 185, 20, 2);
          this.ctx.fillStyle = '#ffffff';
          this.ctx.fillRect(struct.x + 190, struct.y + 185, 20 * (struct.health / struct.maxHealth), 2);
      }

      // Process Progress Bar (Furnace)
      if (struct.type === 'furnace' && struct.isComplete && typeof struct.processTimer === 'number') {
          const isProcessing = (struct.inventory?.['fossil'] || 0) >= 1 && (struct.inventory?.['wood'] || 0) >= 1;
          if (isProcessing) {
              this.ctx.fillStyle = '#444';
              this.ctx.fillRect(struct.x + 190, struct.y + 182, 20, 2);
              this.ctx.fillStyle = '#ff9800'; // Processing orange
              this.ctx.fillRect(struct.x + 190, struct.y + 182, 20 * (struct.processTimer / (struct.maxProcessTimer || 200)), 2);
          }
      }
      
      if (struct.type === 'campfire' && struct.isComplete) {
          // Flame effect
          this.ctx.fillStyle = '#ffeb3b';
          this.ctx.beginPath();
          this.ctx.arc(struct.x + 200, struct.y + 195, 5, 0, Math.PI * 2);
          this.ctx.fill();
      } else if (struct.type === 'dimensional_beacon' && struct.isComplete) {
          // Beacon glow
          this.ctx.fillStyle = '#e040fb';
          this.ctx.beginPath();
          this.ctx.arc(struct.x + 200, struct.y + 195, 8, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.strokeStyle = '#ea80fc';
          this.ctx.lineWidth = 2;
          this.ctx.beginPath();
          this.ctx.arc(struct.x + 200, struct.y + 195, 12 + Math.sin(Date.now() / 200) * 3, 0, Math.PI * 2);
          this.ctx.stroke();
      }

      this.ctx.globalAlpha = 1.0;
    }

    // Render Animals
    for (const animal of sim.animals) {
      let color = '#6200ea'; // fallback
      let size = 20;

      if (animal.type === 'Compsognathus') {
        color = '#556b2f'; // Dark olive green
        size = 12;
      } else if (animal.type === 'Velociraptor') {
        color = '#b22222'; // Firebrick red
        size = 20;
      } else if (animal.type === 'T-Rex') {
        color = '#8b4513'; // Saddle brown
        size = 36;
      } else if (animal.type === 'Triceratops') {
        color = '#4682b4'; // Steel blue
        size = 28;
      } else if (animal.type === 'Ankylosaurus') {
        color = '#daa520'; // Goldenrod (armored look)
        size = 24;
      }

      const offset = (size - 20) / 2; // Keep centered around original 20x20 bounding logic

      this.ctx.fillStyle = color;

      // Draw Tamed marker if applicable
      if (animal.faction === 'TAMED') {
          this.ctx.strokeStyle = '#00ff00';
          this.ctx.lineWidth = 2;
          this.ctx.strokeRect(animal.x + 190 - offset - 2, animal.y + 190 - offset - 2, size + 4, size + 4);
      }      this.ctx.fillRect(animal.x + 190 - offset, animal.y + 190 - offset, size, size);

      // Health bar
      this.ctx.fillStyle = '#ff0000';
      this.ctx.fillRect(animal.x + 190, animal.y + 180, 20, 3);
      this.ctx.fillStyle = '#00ff00';
      this.ctx.fillRect(animal.x + 190, animal.y + 180, 20 * (animal.health / animal.maxHealth), 3);

      // Animal Debug State Label
      this.ctx.fillStyle = 'rgba(0,0,0,0.4)';
      this.ctx.fillRect(animal.x + 180, animal.y + 165, 100, 12);
      this.ctx.fillStyle = 'white';
      this.ctx.font = '9px Courier New';
      this.ctx.fillText(animal.debugState, animal.x + 182, animal.y + 174);
    }
    // Render Survivors
    for (const survivor of sim.survivors) {
      this.ctx.fillStyle = '#ffcc00'; // Yellow survivor
      this.ctx.beginPath();
      this.ctx.arc(survivor.x + 200, survivor.y + 200, 15, 0, Math.PI * 2);
      this.ctx.fill();

      // Debug State Label
      this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
      this.ctx.fillRect(survivor.x + 180, survivor.y + 160, 150, 20);
      this.ctx.fillStyle = 'white';
      this.ctx.font = '12px Courier New';
      this.ctx.fillText(survivor.debugState, survivor.x + 185, survivor.y + 175);
    }
    
    // Time Overlay
    this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
    this.ctx.font = '14px Arial';
    this.ctx.fillText(`Day ${sim.time.state.day} - ${sim.time.state.phase} | ${sim.weather.state.type}`, 10, 20);

    // Weather Effects Rendering
    this.renderWeather(sim);

    // Placement preview (drawn last)
    if (this.placementPreview) {
      this.renderPlacementPreview(this.placementPreview);
    }
  }

  private renderPlacementPreview(preview: { structureId: string; x: number; y: number; isValid: boolean }) {
    const screenX = preview.x + 200;
    const screenY = preview.y + 200;

    this.ctx.save();
    this.ctx.globalAlpha = 0.6;
    this.ctx.strokeStyle = preview.isValid ? 'rgba(50,255,120,0.95)' : 'rgba(255,80,80,0.95)';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(screenX - 10, screenY - 10, 20, 20);

    this.ctx.globalAlpha = 0.85;
    this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
    this.ctx.fillRect(screenX - 60, screenY - 34, 120, 18);
    this.ctx.fillStyle = 'white';
    this.ctx.font = '11px Arial';
    this.ctx.fillText(`Place: ${preview.structureId}`, screenX - 55, screenY - 21);

    this.ctx.restore();
  }

  private renderWeather(sim: Simulation) {
    if (sim.weather.state.type === 'RAIN') {
        this.ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x - 5, y + 15);
            this.ctx.stroke();
        }
    } else if (sim.weather.state.type === 'COLD') {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.fillRect(0, 0, this.width, this.height); // Frosty overlay
        
        // Snow flakes
        this.ctx.fillStyle = 'white';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
  }

  private biomeColor(biome: BiomeType): string {
    switch (biome) {
      case 'GRASSLAND':
        return '#2d5a27';
      case 'FOREST':
        return '#1b4b2a';
      case 'SWAMP':
        return '#2b3b2f';
      case 'DESERT':
        return '#7a6b3f';
    }
  }

  private renderWorld(sim: Simulation) {
    const world = sim.world;
    if (!world) return;

    const { widthTiles, heightTiles, tileSize, originX, originY } = world.config;

    for (let ty = 0; ty < heightTiles; ty++) {
      for (let tx = 0; tx < widthTiles; tx++) {
        const biome = world.biomeAtTile(tx, ty);
        this.ctx.fillStyle = this.biomeColor(biome);
        this.ctx.fillRect(originX + tx * tileSize + 200, originY + ty * tileSize + 200, tileSize, tileSize);
      }
    }
  }
}
