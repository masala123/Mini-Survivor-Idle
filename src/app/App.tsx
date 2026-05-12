import React, { useEffect, useRef, useState } from 'react';
import { Simulation } from '../simulation/Simulation';
import { CanvasRenderer } from '../rendering/CanvasRenderer';
import { Hud } from '../ui/Hud';
import { snapToGrid } from '../game/coords';
import { isPlacementValid } from '../game/placement';

export const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<Simulation>(new Simulation());
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const [, setTick] = useState(0);
  const [selectedSurvivorId, setSelectedSurvivorId] = useState<string>('survivor_1');
  const [placementStructureId, setPlacementStructureId] = useState<string | null>(null);
  const gridSize = 10;

  useEffect(() => {
    // Initialize Simulation
    simRef.current.initMockData();

    // Initialize Renderer
    if (canvasRef.current) {
      rendererRef.current = new CanvasRenderer(canvasRef.current);
    }

    // Game Loop
    const interval = setInterval(() => {
      simRef.current.tick();
      setTick(t => t + 1); // Trigger React re-render for HUD
    }, 100); // 10 ticks per second

    const renderLoop = () => {
      if (rendererRef.current && simRef.current) {
        rendererRef.current.render(simRef.current);
      }
      requestAnimationFrame(renderLoop);
    };
    const animFrame = requestAnimationFrame(renderLoop);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  const handleCanvasClick = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    if (simRef.current.isGameOver) return;
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const screenX = evt.clientX - rect.left;
    const screenY = evt.clientY - rect.top;

    // Renderer draws world at (x + 200, y + 200)
    const worldX = screenX - 200;
    const worldY = screenY - 200;

    const dist2 = (ax: number, ay: number, bx: number, by: number) => {
      const dx = ax - bx;
      const dy = ay - by;
      return dx * dx + dy * dy;
    };

    const snappedWorldX = snapToGrid(worldX, gridSize);
    const snappedWorldY = snapToGrid(worldY, gridSize);

    // Placement mode: click to place structure at world coords
    if (placementStructureId) {
      simRef.current.interaction.pushCommand({
        type: 'PLACE_STRUCTURE',
        survivorId: selectedSurvivorId,
        structureId: placementStructureId,
        x: snappedWorldX,
        y: snappedWorldY
      });
      setPlacementStructureId(null);
      rendererRef.current?.setPlacementPreview(null);
      return;
    }

    // 1) Animals (rect 20x20 centered roughly at x,y via +190..+210)
    const animal = simRef.current.animals.find(a => worldX >= a.x - 10 && worldX <= a.x + 10 && worldY >= a.y - 10 && worldY <= a.y + 10);
    if (animal) {
      simRef.current.interaction.pushCommand({ type: 'ASSIST_ATTACK', targetId: animal.id, survivorId: selectedSurvivorId });
      return;
    }

    // 2) Resources (radius ~10)
    const resource = simRef.current.resources.find(r => dist2(worldX, worldY, r.x, r.y) <= 12 * 12);
    if (resource) {
      simRef.current.interaction.pushCommand({ type: 'ASSIST_GATHER', targetId: resource.id, survivorId: selectedSurvivorId });
    }
  };

  const handleCanvasMove = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    if (!placementStructureId) return;
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const screenX = evt.clientX - rect.left;
    const screenY = evt.clientY - rect.top;
    const worldX = screenX - 200;
    const worldY = screenY - 200;

    const snappedX = snapToGrid(worldX, gridSize);
    const snappedY = snapToGrid(worldY, gridSize);
    const valid = isPlacementValid({
      x: snappedX,
      y: snappedY,
      structures: simRef.current.structures,
      resources: simRef.current.resources,
      survivors: simRef.current.survivors,
      animals: simRef.current.animals,
    });

    rendererRef.current?.setPlacementPreview({
      structureId: placementStructureId,
      x: snappedX,
      y: snappedY,
      isValid: valid,
    });
  };

  const handleAssist = (resourceId: string) => {
    if (resourceId && !simRef.current.isGameOver) {
      simRef.current.interaction.pushCommand({
        type: 'ASSIST_GATHER',
        targetId: resourceId,
        survivorId: selectedSurvivorId
      });
    }
  };

  const handleUnlock = (recipeId: string) => {
    if (!simRef.current.isGameOver) {
      simRef.current.interaction.pushCommand({
        type: 'UNLOCK_RECIPE',
        recipeId: recipeId
      });
    }
  };

  const handleReset = () => {
    const newSim = new Simulation();
    newSim.initMockData();
    simRef.current = newSim;
    setSelectedSurvivorId(newSim.survivors[0]?.id ?? 'survivor_1');
    setPlacementStructureId(null);
    rendererRef.current?.setPlacementPreview(null);
    setTick(t => t + 1);
  };

  return (
    <div style={{ position: 'relative', width: '800px', height: '600px', margin: '20px auto', border: '2px solid #333' }}>
      <canvas 
        ref={canvasRef} 
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMove}
        width={800} 
        height={600}
        style={{ display: 'block' }}
      />
      <Hud
        sim={simRef.current}
        onAssist={handleAssist}
        onUnlock={handleUnlock}
        selectedSurvivorId={selectedSurvivorId}
        onSelectSurvivor={setSelectedSurvivorId}
        onEmergencyFeed={survivorId => simRef.current.interaction.pushCommand({ type: 'EMERGENCY_FEED', survivorId })}
        onEmergencyHeal={survivorId => simRef.current.interaction.pushCommand({ type: 'EMERGENCY_HEAL', survivorId })}
        onGiveItem={(survivorId, itemId) => simRef.current.interaction.pushCommand({ type: 'GIVE_ITEM', survivorId, itemId })}
        placementStructureId={placementStructureId}
        onBeginPlaceStructure={structureId => {
          setPlacementStructureId(structureId);
          const valid = isPlacementValid({
            x: 0,
            y: 0,
            structures: simRef.current.structures,
            resources: simRef.current.resources,
            survivors: simRef.current.survivors,
            animals: simRef.current.animals,
          });
          rendererRef.current?.setPlacementPreview({ structureId, x: 0, y: 0, isValid: valid });
        }}
        onCancelPlaceStructure={() => {
          setPlacementStructureId(null);
          rendererRef.current?.setPlacementPreview(null);
        }}
      />
      {simRef.current.isGameOver && (
          <button 
            onClick={handleReset}
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                padding: '20px 40px',
                fontSize: '20px',
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
            }}
          >
              RESTART GAME
          </button>
      )}
      <div style={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: '5px'
      }}>
          Simulation Tick: {simRef.current.tickCount}
      </div>
    </div>
  );
};
