import React from 'react';
import { Simulation } from '../simulation/Simulation';
import { Minimap } from './Minimap';

import { Survivor, SurvivorRole } from '../entities/Survivor';

interface HudProps {
  sim: Simulation;
  onAssist: (resourceId: string) => void;
  onUnlock: (recipeId: string) => void;
  selectedSurvivorId: string;
  onSelectSurvivor: (survivorId: string) => void;
  onEmergencyFeed: (survivorId: string) => void;
  onEmergencyHeal: (survivorId: string) => void;
  onGiveItem: (survivorId: string, itemId: string) => void;
  onSetRole: (survivorId: string, role: SurvivorRole) => void;
  placementStructureId: string | null;
  onBeginPlaceStructure: (structureId: string) => void;
  onCancelPlaceStructure: () => void;
  onMount: (survivorId: string, animalId: string) => void;
  onDismount: (survivorId: string) => void;
}

export const Hud: React.FC<HudProps> = ({
  sim,
  onAssist,
  onUnlock,
  selectedSurvivorId,
  onSelectSurvivor,
  onEmergencyFeed,
  onEmergencyHeal,
  onGiveItem,
  onSetRole,
  placementStructureId,
  onBeginPlaceStructure,
  onCancelPlaceStructure,
  onMount,
  onDismount,
}) => {
  const survivors = sim.survivors;

  if (survivors.length === 0) return null;

  const axeUnlocked = sim.progression.isRecipeUnlocked('craft_axe');
  const selected = survivors.find(s => s.id === selectedSurvivorId) ?? survivors[0];

  return (
    <div style={{
      position: 'absolute',
      top: 10,
      right: 10,
      padding: '10px',
      backgroundColor: 'rgba(0,0,0,0.85)',
      color: 'white',
      borderRadius: '10px',
      fontFamily: 'monospace',
      width: '240px',
      maxHeight: 'calc(100vh - 40px)',
      overflowY: 'auto',
      pointerEvents: 'none',
      boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      {/* 1. Global Status & Minimap */}
      <div style={{ borderBottom: '1px solid #444', paddingBottom: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#44ff44' }}>DINO IDLE</span>
          <span style={{ fontSize: '10px', color: '#aaa' }}>Day {sim.time.state.day}</span>
        </div>
        <div style={{ transform: 'scale(0.85)', transformOrigin: 'top left', marginBottom: '-15px' }}>
          <Minimap sim={sim} width={160} height={100} />
        </div>
        <div style={{ fontSize: '10px', color: '#ccc', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
          <span>POI: {sim.discoveredPoiIds?.size ?? 0}/{sim.pois?.length ?? 0}</span>
          <span>{sim.weather.state.type}</span>
        </div>
      </div>

      {/* 1.5 Base Power */}
      <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '6px', fontSize: '9px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontWeight: 'bold', color: '#ffeb3b', display: 'flex', justifyContent: 'space-between' }}>
            <span>BASE POWER</span>
            <span>{sim.power.state.currentOutput}W / -{sim.power.state.currentConsumption}W</span>
        </div>
        <div style={{ width: '100%', height: '6px', backgroundColor: '#333', borderRadius: '3px', position: 'relative' }}>
            <div style={{ 
                width: `${(sim.power.state.batteryLevel / sim.power.state.maxBatteryCapacity) * 100}%`, 
                height: '100%', 
                backgroundColor: '#ffeb3b',
                borderRadius: '3px',
                transition: 'width 0.3s'
            }} />
        </div>
        <div style={{ color: '#aaa', textAlign: 'right' }}>
            Stored: {Math.floor(sim.power.state.batteryLevel)} / {sim.power.state.maxBatteryCapacity}Wh
        </div>
      </div>

      {/* 1.7 Colony Governance */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#00bcd4', borderBottom: '1px solid #333', paddingBottom: '2px' }}>
          COLONY FOCUS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', pointerEvents: 'auto' }}>
          {['BALANCED', 'SURVIVAL', 'EXPANSION', 'LOGISTICS', 'EXPLORATION'].map(f => (
            <button 
                key={f}
                onClick={() => sim.interaction.pushCommand({ type: 'SET_GOVERNANCE_FOCUS', focus: f as ColonyFocus })}
                style={{ 
                    padding: '3px', 
                    fontSize: '8px', 
                    cursor: 'pointer',
                    backgroundColor: sim.governance.state.globalFocus === f ? '#00bcd4' : '#333',
                    color: sim.governance.state.globalFocus === f ? 'black' : 'white',
                    border: 'none',
                    borderRadius: '2px'
                }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {sim.isGameOver && (
        <div style={{ color: '#ff4444', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', padding: '4px', backgroundColor: 'rgba(255,0,0,0.1)', borderRadius: '4px' }}>
          GAME OVER
        </div>
      )}
      {sim.isVictory && (
        <div style={{ color: '#44ff44', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', padding: '4px', backgroundColor: 'rgba(0,255,0,0.1)', borderRadius: '4px' }}>
          VICTORY!
        </div>
      )}

      {/* 2. Survivors Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {survivors.map(survivor => (
            <div 
              key={survivor.id} 
              onClick={() => onSelectSurvivor(survivor.id)}
              style={{ 
                padding: '6px', 
                backgroundColor: survivor.id === selectedSurvivorId ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderRadius: '4px',
                border: survivor.id === selectedSurvivorId ? '1px solid #44ff44' : '1px solid transparent',
                cursor: 'pointer',
                pointerEvents: 'auto'
              }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '11px' }}>{survivor.id}</span>
                  <span style={{ fontSize: '9px', color: '#44ff44' }}>{survivor.debugState.substring(0, 15)}</span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '3px', fontSize: '9px', alignItems: 'center' }}>
                  <span>HP</span>
                  <div style={{ width: '100%', height: '3px', backgroundColor: '#333' }}>
                    <div style={{ width: `${(survivor.stats.health / survivor.stats.maxHealth) * 100}%`, height: '100%', backgroundColor: '#ff4444' }} />
                  </div>
                  
                  <span>Food</span>
                  <div style={{ width: '100%', height: '3px', backgroundColor: '#333' }}>
                    <div style={{ width: `${(survivor.stats.hunger / survivor.stats.maxHunger) * 100}%`, height: '100%', backgroundColor: '#ffcc00' }} />
                  </div>
                </div>
            </div>
        ))}
      </div>

      {/* 3. Selected Survivor Actions */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '6px', pointerEvents: 'auto' }}>
        <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#44ff44', borderBottom: '1px solid #333', paddingBottom: '2px' }}>
          ACTIONS: {selected.id}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
          <button onClick={() => onEmergencyFeed(selected.id)} style={{ padding: '4px', cursor: 'pointer', fontSize: '10px' }}>Feed</button>
          <button onClick={() => onEmergencyHeal(selected.id)} style={{ padding: '4px', cursor: 'pointer', fontSize: '10px' }}>Heal</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3px' }}>
          <button onClick={() => onGiveItem(selected.id, 'torch')} style={{ padding: '3px', cursor: 'pointer', fontSize: '9px' }}>+Torch</button>
          <button onClick={() => onGiveItem(selected.id, 'axe')} style={{ padding: '3px', cursor: 'pointer', fontSize: '9px' }}>+Axe</button>
          <button onClick={() => onGiveItem(selected.id, 'vegetable')} style={{ padding: '3px', cursor: 'pointer', fontSize: '9px' }}>+Food</button>
        </div>

        <div style={{ fontSize: '9px', color: '#ccc', marginBottom: '2px' }}>Assigned Job:</div>
        <select 
          value={selected.role} 
          onChange={(e) => onSetRole(selected.id, e.target.value as SurvivorRole)}
          style={{ width: '100%', padding: '4px', fontSize: '10px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: '1px solid #444', borderRadius: '4px' }}
        >
          <option value="GENERALIST">Generalist</option>
          <option value="GATHERER">Gatherer</option>
          <option value="BUILDER">Builder</option>
          <option value="LOGISTICS">Logistics</option>
        </select>

        <button 
          onClick={() => {
            const tamed = sim.animals.find(a => a.faction === 'TAMED');
            if (selected.mountedAnimalId) onDismount(selected.id);
            else if (tamed) onMount(selected.id, tamed.id);
          }} 
          style={{ 
            padding: '6px', 
            cursor: 'pointer', 
            width: '100%', 
            backgroundColor: selected.mountedAnimalId ? '#ff9800' : '#4caf50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            fontSize: '10px',
            fontWeight: 'bold'
          }}
        >
          {selected.mountedAnimalId ? 'Dismount' : 'Mount Tamed'}
        </button>
      </div>

      {/* 4. Construction */}
      <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '6px', pointerEvents: 'auto' }}>
        <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#ffcc00', borderBottom: '1px solid #333', paddingBottom: '2px' }}>CONSTRUCTION</div>
        
        {placementStructureId ? (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <div style={{ flex: 1, fontSize: '9px', color: '#44ff44' }}>{placementStructureId}</div>
            <button onClick={onCancelPlaceStructure} style={{ padding: '3px 6px', cursor: 'pointer', fontSize: '9px' }}>X</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
            <button onClick={() => onBeginPlaceStructure('campfire')} style={{ padding: '4px', fontSize: '9px', cursor: 'pointer' }}>Fire</button>
            <button onClick={() => onBeginPlaceStructure('chest')} style={{ padding: '4px', fontSize: '9px', cursor: 'pointer' }}>Chest</button>
            <button onClick={() => onBeginPlaceStructure('workbench')} style={{ padding: '4px', fontSize: '9px', cursor: 'pointer' }}>Bench</button>
            <button onClick={() => onBeginPlaceStructure('farm_plot')} style={{ padding: '4px', fontSize: '9px', cursor: 'pointer' }}>Farm</button>
            <button onClick={() => onBeginPlaceStructure('furnace')} style={{ padding: '4px', fontSize: '9px', cursor: 'pointer' }}>Furnace</button>
            <button onClick={() => onBeginPlaceStructure('dimensional_beacon')} style={{ padding: '4px', fontSize: '9px', cursor: 'pointer', backgroundColor: '#9c27b0', color: 'white', border: 'none' }}>Portal</button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3px' }}>
          <button onClick={() => onBeginPlaceStructure('wall')} style={{ padding: '3px', fontSize: '8px', cursor: 'pointer' }}>Wall</button>
          <button onClick={() => onBeginPlaceStructure('bone_wall')} style={{ padding: '3px', fontSize: '8px', cursor: 'pointer' }}>B-Wall</button>
          <button onClick={() => onBeginPlaceStructure('spike_trap')} style={{ padding: '3px', fontSize: '8px', cursor: 'pointer' }}>Trap</button>
        </div>

        <div style={{ borderTop: '1px solid #333', marginTop: '2px', paddingTop: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {!axeUnlocked && (
             <button onClick={() => onUnlock('craft_axe')} style={{ padding: '4px', fontSize: '9px', cursor: 'pointer', width: '100%' }}>Unlock Axe</button>
          )}
          {!sim.progression.isRecipeUnlocked('craft_crystal_spear') && (
             <button onClick={() => onUnlock('craft_crystal_spear')} style={{ padding: '4px', fontSize: '9px', cursor: 'pointer', width: '100%' }}>Unlock Spear</button>
          )}
        </div>
      </div>

      <div style={{ fontSize: '9px', color: '#888', textAlign: 'center' }}>
        Click resources/monsters to assist.
      </div>
    </div>
  );
};
