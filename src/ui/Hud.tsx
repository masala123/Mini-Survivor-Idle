import React from 'react';
import { Simulation } from '../simulation/Simulation';
import { Minimap } from './Minimap';

interface HudProps {
  sim: Simulation;
  onAssist: (resourceId: string) => void;
  onUnlock: (recipeId: string) => void;
  selectedSurvivorId: string;
  onSelectSurvivor: (survivorId: string) => void;
  onEmergencyFeed: (survivorId: string) => void;
  onEmergencyHeal: (survivorId: string) => void;
  onGiveItem: (survivorId: string, itemId: string) => void;
  placementStructureId: string | null;
  onBeginPlaceStructure: (structureId: string) => void;
  onCancelPlaceStructure: () => void;
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
  placementStructureId,
  onBeginPlaceStructure,
  onCancelPlaceStructure,
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
      padding: '15px',
      backgroundColor: 'rgba(0,0,0,0.7)',
      color: 'white',
      borderRadius: '8px',
      fontFamily: 'monospace',
      maxHeight: '90vh',
      overflowY: 'auto',
      pointerEvents: 'none'
    }}>
      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontSize: '11px', color: '#ccc', marginBottom: '4px' }}>Minimap</div>
        <Minimap sim={sim} />
        <div style={{ fontSize: '11px', color: '#ccc', marginTop: '4px' }}>
          Discoveries: {sim.discoveredPoiIds?.size ?? 0} / {sim.pois?.length ?? 0}
        </div>
      </div>
      {sim.isGameOver && (
        <div style={{ color: '#ff4444', fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
          GAME OVER - Everyone Died
        </div>
      )}

      {survivors.map(survivor => (
          <div key={survivor.id} style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #444' }}>
              <h3 style={{ margin: '0 0 5px 0' }}>{survivor.id}</h3>
              <div style={{ fontSize: '12px', color: '#44ff44', marginBottom: '5px' }}>{survivor.debugState}</div>
              
              <div>HP: {Math.floor(survivor.stats.health)} / {survivor.stats.maxHealth}</div>
              <div style={{ width: '100%', height: '4px', backgroundColor: '#333', marginBottom: '5px' }}>
                 <div style={{ width: `${(survivor.stats.health / survivor.stats.maxHealth) * 100}%`, height: '100%', backgroundColor: '#ff4444' }} />
              </div>

              <div>Hunger: {Math.floor(survivor.stats.hunger)} / {survivor.stats.maxHunger}</div>
              <div style={{ width: '100%', height: '4px', backgroundColor: '#333', marginBottom: '5px' }}>
                 <div style={{ width: `${(survivor.stats.hunger / survivor.stats.maxHunger) * 100}%`, height: '100%', backgroundColor: '#ffcc00' }} />
              </div>

              <div>Morale: {Math.floor(survivor.stats.morale)} / {survivor.stats.maxMorale}</div>
              <div style={{ width: '100%', height: '4px', backgroundColor: '#333', marginBottom: '10px' }}>
                 <div style={{ width: `${(survivor.stats.morale / survivor.stats.maxMorale) * 100}%`, height: '100%', backgroundColor: '#44aaff' }} />
              </div>

              <div style={{ fontSize: '11px' }}>
                Inv: {Object.entries(survivor.inventory).filter(([, amount]) => amount > 0).map(([id, amount]) => `${id}(${amount})`).join(', ') || 'empty'}
              </div>
              
              {survivor.equippedTool && (
                  <div style={{ fontSize: '11px', color: '#aaa', marginTop: '3px' }}>
                      Tool: {survivor.equippedTool.id} ({Math.floor(survivor.equippedTool.durability)}%)
                  </div>
              )}

              <div style={{ marginTop: '6px', pointerEvents: 'auto', display: 'flex', gap: '6px' }}>
                <button onClick={() => onEmergencyFeed(survivor.id)} style={{ padding: '4px 6px', cursor: 'pointer', flex: 1 }}>
                  Feed
                </button>
                <button onClick={() => onEmergencyHeal(survivor.id)} style={{ padding: '4px 6px', cursor: 'pointer', flex: 1 }}>
                  Heal
                </button>
              </div>
          </div>
      ))}

      <div style={{ fontSize: '11px', color: '#aaa', marginTop: '8px' }}>
        Tip: Click resources to assist gathering; click monsters to assist attack.
      </div>

      <div style={{ marginTop: '15px', pointerEvents: 'auto' }}>
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', marginBottom: '4px', color: '#ccc' }}>Selected Survivor</div>
          <select
            value={selected?.id}
            onChange={e => onSelectSurvivor(e.target.value)}
            style={{ width: '100%', padding: '4px', cursor: 'pointer' }}
          >
            {survivors.map(s => (
              <option key={s.id} value={s.id}>
                {s.id}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', marginBottom: '4px', color: '#ccc' }}>Throw Item</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => onGiveItem(selected.id, 'torch')} style={{ padding: '5px 8px', cursor: 'pointer', flex: 1 }}>
              Torch
            </button>
            <button onClick={() => onGiveItem(selected.id, 'axe')} style={{ padding: '5px 8px', cursor: 'pointer', flex: 1 }}>
              Axe
            </button>
            <button onClick={() => onGiveItem(selected.id, 'vegetable')} style={{ padding: '5px 8px', cursor: 'pointer', flex: 1 }}>
              Food
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', marginBottom: '4px', color: '#ccc' }}>Place Structure</div>
          {placementStructureId ? (
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ flex: 1, fontSize: '11px', padding: '6px 8px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}>
                Click to place: {placementStructureId}
              </div>
              <button onClick={onCancelPlaceStructure} style={{ padding: '6px 10px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <button onClick={() => onBeginPlaceStructure('campfire')} style={{ padding: '6px 10px', cursor: 'pointer' }}>
                Campfire
              </button>
              <button onClick={() => onBeginPlaceStructure('chest')} style={{ padding: '6px 10px', cursor: 'pointer' }}>
                Chest
              </button>
              <button onClick={() => onBeginPlaceStructure('workbench')} style={{ padding: '6px 10px', cursor: 'pointer' }}>
                Workbench
              </button>
              <button onClick={() => onBeginPlaceStructure('farm_plot')} style={{ padding: '6px 10px', cursor: 'pointer' }}>
                Farm Plot
              </button>
              <button onClick={() => onBeginPlaceStructure('dimensional_beacon')} style={{ padding: '6px 10px', cursor: 'pointer', gridColumn: 'span 2' }}>
                Dimensional Beacon
              </button>
            </div>
          )}
        </div>

        <button 
            onClick={() => onAssist(sim.resources[0]?.id)}
            style={{ padding: '5px 10px', cursor: 'pointer', marginRight: '5px', marginBottom: '5px', width: '100%' }}
        >
            Assist Gathering
        </button>

        {!axeUnlocked && (
           <button 
               onClick={() => onUnlock('craft_axe')}
               style={{ padding: '5px 10px', cursor: 'pointer', width: '100%', marginBottom: '5px' }}
           >
               Unlock Axe (Free)
           </button>
        )}
        {!sim.progression.isRecipeUnlocked('craft_bone_club') && (
           <button 
               onClick={() => onUnlock('craft_bone_club')}
               style={{ padding: '5px 10px', cursor: 'pointer', width: '100%', marginBottom: '5px' }}
           >
               Unlock Bone Club
           </button>
        )}
        {!sim.progression.isRecipeUnlocked('craft_crystal_spear') && (
           <button 
               onClick={() => onUnlock('craft_crystal_spear')}
               style={{ padding: '5px 10px', cursor: 'pointer', width: '100%' }}
           >
               Unlock Crystal Spear
           </button>
        )}
      </div>
    </div>
  );
};
