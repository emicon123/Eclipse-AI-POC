
import React, { useState, useMemo, useRef } from 'react';
import { Rocket } from 'lucide-react';
import { SectorData, DiscoveryReward, PlayerState, ResourceType } from '../../types/index';
import { generateSector, drawDiscoveryTile } from '../../utils/gameLogic';
import { NEIGHBOR_DIRS, getRing, getOppositeEdge } from '../../utils/hexUtils';
import { SectorHex } from './SectorHex';
import { ExplorationOverlay } from './ExplorationOverlay';

interface GalaxyMapProps {
    sectors: SectorData[];
    isExploring: boolean;
    activePlayerColor: string;
    onSectorAdded: (sector: SectorData, withInfluence: boolean) => void;
    onClaimDiscovery?: (reward: DiscoveryReward) => void; 
    onExploreComplete: () => void;
    availableDiscs: number;
    colonyShips: PlayerState['colonyShips'];
    onColonize: (sectorId: string | number, slotId: string, type: ResourceType) => void;
}

export const GalaxyMap: React.FC<GalaxyMapProps> = ({ 
    sectors, 
    isExploring, 
    activePlayerColor, 
    onSectorAdded, 
    onExploreComplete, 
    onClaimDiscovery,
    availableDiscs,
    colonyShips,
    onColonize
}) => {
  // --- STATE ---
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number, y: number } | null>(null);
  
  // Exploration Flow State
  const [pendingSector, setPendingSector] = useState<SectorData | null>(null);
  const [currentDiscovery, setCurrentDiscovery] = useState<any>(null);
  const [exploringFrom, setExploringFrom] = useState<{q: number, r: number, edge: number} | null>(null);
  
  const [showInfluencePrompt, setShowInfluencePrompt] = useState(false);
  const [showDiscoveryPrompt, setShowDiscoveryPrompt] = useState(false);
  const [showColonizePrompt, setShowColonizePrompt] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Colonization State
  const [isColonizing, setIsColonizing] = useState(false);

  // --- PAN & ZOOM HANDLERS ---
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const zoomIntensity = 0.1;
    const direction = e.deltaY > 0 ? -1 : 1;
    const newScale = Math.min(Math.max(0.2, transform.scale + direction * zoomIntensity), 4);
    
    setTransform(prev => ({ ...prev, scale: newScale }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if(e.button !== 0) return;
    setIsDragging(false); 
    dragStartRef.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStartRef.current) return;
    
    const startX = dragStartRef.current.x;
    const startY = dragStartRef.current.y;

    setIsDragging(true);
    setTransform(prev => ({
        ...prev,
        x: e.clientX - startX,
        y: e.clientY - startY
    }));
  };

  const handleMouseUp = () => { dragStartRef.current = null; };

  // --- LOGIC ---

  const emptyZones = useMemo(() => {
    const occupiedCoords = new Set(sectors.map(s => `${s.q},${s.r}`));
    const mySectors = sectors.filter(s => s.playerColor === activePlayerColor);
    
    const validZoneSources = new Map<string, {sourceQ: number, sourceR: number, sourceEdge: number}[]>();

    mySectors.forEach(sector => {
        const rotatedWormholes = [...sector.wormholes];
        if (sector.rotation) {
             for(let i=0; i<sector.rotation; i++) rotatedWormholes.unshift(rotatedWormholes.pop()!);
        }

        NEIGHBOR_DIRS.forEach((dir, edgeIndex) => {
            if (!rotatedWormholes[edgeIndex]) return; 

            const nQ = sector.q + dir.q;
            const nR = sector.r + dir.r;
            const key = `${nQ},${nR}`;

            if (!occupiedCoords.has(key)) {
                if (pendingSector && pendingSector.q === nQ && pendingSector.r === nR) return; 

                if (!validZoneSources.has(key)) {
                    validZoneSources.set(key, []);
                }
                validZoneSources.get(key)!.push({
                    sourceQ: sector.q,
                    sourceR: sector.r,
                    sourceEdge: edgeIndex
                });
            }
        });
    });
    
    const zones: SectorData[] = [];
    validZoneSources.forEach((sources, key) => {
        const [qStr, rStr] = key.split(',');
        const q = parseInt(qStr);
        const r = parseInt(rStr);

        zones.push({
            id: `empty_${q}_${r}`,
            q, r,
            type: 'EMPTY_ZONE',
            ring: getRing(q, r),
            isExplored: false,
            rotation: 0,
            wormholes: [],
            ancients: 0,
            hasDiscoveryTile: false,
            populationSlots: [],
            ships: []
        });
    });

    return zones;
  }, [sectors, pendingSector, activePlayerColor]);

  const isPlacementValid = useMemo(() => {
      if (!pendingSector || !exploringFrom) return false;
      
      const incomingEdge = getOppositeEdge(exploringFrom.edge);
      const rotatedWormholes = [...pendingSector.wormholes];
      if (pendingSector.rotation) {
          for(let i=0; i<pendingSector.rotation; i++) rotatedWormholes.unshift(rotatedWormholes.pop()!);
      }

      return rotatedWormholes[incomingEdge];
  }, [pendingSector, exploringFrom]);


  const handleZoneClick = (q: number, r: number, ring: number) => {
      if (isDragging) return;
      if (!isExploring || pendingSector) return;

      const occupiedCoords = new Map(sectors.filter(s => s.playerColor === activePlayerColor).map(s => [`${s.q},${s.r}`, s]));
      
      let validSource = null;

      for (let i = 0; i < 6; i++) {
          const dir = NEIGHBOR_DIRS[i];
          const nQ = q - dir.q; 
          const nR = r - dir.r;
          
          const neighbor = occupiedCoords.get(`${nQ},${nR}`);
          if (neighbor) {
              const dq = q - neighbor.q;
              const dr = r - neighbor.r;
              const edgeIndex = NEIGHBOR_DIRS.findIndex(d => d.q === dq && d.r === dr);
              
              if (edgeIndex !== -1) {
                  const neighborWormholes = [...neighbor.wormholes];
                  if (neighbor.rotation) {
                      for(let k=0; k<neighbor.rotation; k++) neighborWormholes.unshift(neighborWormholes.pop()!);
                  }
                  
                  if (neighborWormholes[edgeIndex]) {
                      validSource = { q: neighbor.q, r: neighbor.r, edge: edgeIndex };
                      break;
                  }
              }
          }
      }

      if (!validSource) {
          return;
      }

      setExploringFrom(validSource);
      const newSector = generateSector(ring, q, r);
      setPendingSector(newSector);
      setCurrentDiscovery(null);
      setShowInfluencePrompt(false);
      setShowDiscoveryPrompt(false);
      setShowColonizePrompt(false);
      setIsConnected(false);
  };

  const handleRotate = () => {
      if (!pendingSector) return;
      setPendingSector(prev => prev ? { ...prev, rotation: (prev.rotation + 1) % 6 } : null);
  };

  const checkConnectivity = (target: SectorData) => {
        let connected = false;
        sectors.forEach(existing => {
            const dq = existing.q - target.q;
            const dr = existing.r - target.r;
            const dirIndex = NEIGHBOR_DIRS.findIndex(d => d.q === dq && d.r === dr);
            
            if (dirIndex !== -1) {
                const oppositeIndex = getOppositeEdge(dirIndex);
                
                // Rotated target wormholes
                const targetWormholes = [...target.wormholes];
                if(target.rotation) for(let i=0; i<target.rotation; i++) targetWormholes.unshift(targetWormholes.pop()!);

                // Rotated existing wormholes
                const existingWormholes = [...existing.wormholes];
                if(existing.rotation) for(let i=0; i<existing.rotation; i++) existingWormholes.unshift(existingWormholes.pop()!);

                if (targetWormholes[dirIndex] && existingWormholes[oppositeIndex]) {
                    connected = true;
                }
            }
        });
        return connected;
    };

  const confirmKeep = () => {
      if (!pendingSector) return;
      if (!isPlacementValid) return; 
      
      const connected = checkConnectivity(pendingSector);
      setIsConnected(connected);

      onSectorAdded(pendingSector, false);
      
      if (pendingSector.ancients > 0) {
          if (pendingSector.hasDiscoveryTile) {
               const drawnTile = drawDiscoveryTile();
               setCurrentDiscovery(drawnTile);
               setShowDiscoveryPrompt(true);
          } else {
               finishExploration();
          }
      } else {
          if (connected && availableDiscs > 0) {
              setShowInfluencePrompt(true);
          } else {
              setShowColonizePrompt(true);
          }
      }
  };

  const checkDiscoveryAndFinish = () => {
      if (pendingSector && pendingSector.hasDiscoveryTile && !pendingSector.claimedDiscovery) {
          const drawnTile = drawDiscoveryTile();
          setCurrentDiscovery(drawnTile);
          setShowDiscoveryPrompt(true);
      } else {
          finishExploration();
      }
  };

  const finishExploration = () => {
      setPendingSector(null);
      setCurrentDiscovery(null);
      setShowInfluencePrompt(false);
      setShowDiscoveryPrompt(false);
      setShowColonizePrompt(false);
      setIsColonizing(false);
      onExploreComplete();
  };

  const handleInfluenceDecision = (shouldInfluence: boolean) => {
      if (shouldInfluence && pendingSector) {
          onSectorAdded(pendingSector, true);
      }
      setShowInfluencePrompt(false);
      setShowColonizePrompt(true);
  };

  const handleColonizeDecision = (shouldColonize: boolean) => {
      setShowColonizePrompt(false);
      if (shouldColonize) {
          setIsColonizing(true);
      } else {
          checkDiscoveryAndFinish();
      }
  };

  const handleFinishColonizing = () => {
      setIsColonizing(false);
      checkDiscoveryAndFinish();
  };

  const handleDiscoveryDecision = (takeReward: boolean) => {
      if (pendingSector) {
          const updated = { ...pendingSector, claimedDiscovery: true };
          onSectorAdded(updated, pendingSector.playerColor === activePlayerColor); 
          
          if (takeReward && onClaimDiscovery) {
              onClaimDiscovery(currentDiscovery);
          } else {
              finishExploration();
          }
      }
      setPendingSector(null);
      setShowDiscoveryPrompt(false);
  };

  const confirmDiscard = () => {
      finishExploration();
  };

  const handleColonyShipClick = () => {
      if (colonyShips.total - colonyShips.used > 0) {
          setIsColonizing(!isColonizing);
      }
  };

  const handleSlotClick = (sectorId: string | number, slotId: string, type: ResourceType) => {
      onColonize(sectorId, slotId, type);
  };

  return (
    <div className="w-full h-full relative">
        <div 
            className="w-full h-full relative bg-[#050510] overflow-hidden rounded-3xl border border-slate-700/50 shadow-2xl cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
        >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-[#0a0f1e]/80 to-[#000000] pointer-events-none"></div>
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        
        <div className="absolute top-6 left-8 z-10 pointer-events-none select-none">
            <h2 className="text-3xl font-bold text-white tracking-widest flex items-center gap-3">
                TACTICAL <span className="text-blue-500">MAP</span>
            </h2>
            {isExploring ? (
                 <div className="mt-2 bg-orange-500/20 border border-orange-500 text-orange-400 px-4 py-2 rounded-lg font-bold animate-pulse">
                     EXPLORATION ACTIVE: Select a Zone
                 </div>
            ) : isColonizing ? (
                <div className="mt-2 bg-emerald-500/20 border border-emerald-500 text-emerald-400 px-4 py-2 rounded-lg font-bold animate-pulse">
                     COLONIZATION: Select an Empty Square
                 </div>
            ) : (
                <div className="mt-2 text-[10px] text-slate-500">
                    DRAG TO PAN • SCROLL TO ZOOM
                </div>
            )}
        </div>

        {/* COLONY SHIP HUD */}
        <div className="absolute top-6 right-8 z-40 flex flex-col items-end gap-2">
            <div className="bg-slate-900/90 border border-slate-700 p-2 rounded-xl flex items-center gap-2 shadow-lg backdrop-blur">
                <button 
                    onClick={handleColonyShipClick}
                    disabled={colonyShips.total - colonyShips.used <= 0}
                    className={`
                        relative w-14 h-14 rounded-lg border-2 flex items-center justify-center transition-all
                        ${isColonizing 
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]' 
                            : colonyShips.total - colonyShips.used > 0 
                                ? 'bg-slate-800 border-slate-600 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400' 
                                : 'bg-slate-900 border-slate-800 text-slate-700 opacity-50 cursor-not-allowed'}
                    `}
                >
                    <Rocket size={24} className={isColonizing ? 'animate-bounce' : ''} />
                    <div className="absolute -bottom-2 -right-2 bg-slate-950 border border-current rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {colonyShips.total - colonyShips.used}
                    </div>
                </button>
                <div className="flex flex-col mr-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Colony Ships</span>
                    <span className="text-[10px] text-slate-500">Click to Colonize</span>
                </div>
            </div>
        </div>

        <div 
            className="w-full h-full relative flex items-center justify-center transition-transform duration-75 ease-out"
            style={{
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`
            }}
        >
            <div className="relative w-0 h-0">
                {emptyZones.map((zone) => (
                    <SectorHex 
                        key={zone.id} 
                        data={zone} 
                        onExplore={() => handleZoneClick(zone.q, zone.r, zone.ring)}
                        isExploring={isExploring && !pendingSector}
                    />
                ))}
                {sectors.map((sector) => (
                    <SectorHex 
                        key={sector.id} 
                        data={sector} 
                        isColonizing={isColonizing && sector.playerColor === activePlayerColor}
                        onColonizeSlot={(slotId, type) => handleSlotClick(sector.id, slotId, type)}
                    />
                ))}
                {pendingSector && !sectors.find(s => s.id === pendingSector.id) && (
                    <SectorHex data={pendingSector} isPending={true} />
                )}
            </div>
        </div>
        </div>

        {/* EXPLORATION CONTROL OVERLAY */}
        {pendingSector && (
            <ExplorationOverlay 
                pendingSector={pendingSector}
                currentDiscovery={currentDiscovery}
                showInfluencePrompt={showInfluencePrompt}
                showDiscoveryPrompt={showDiscoveryPrompt}
                showColonizePrompt={showColonizePrompt}
                isColonizing={isColonizing}
                isConnected={isConnected}
                isPlacementValid={isPlacementValid}
                availableDiscs={availableDiscs}
                colonyShips={colonyShips}
                onRotate={handleRotate}
                onDiscard={confirmDiscard}
                onKeep={confirmKeep}
                onInfluence={handleInfluenceDecision}
                onColonize={handleColonizeDecision}
                onFinishColonizing={handleFinishColonizing}
                onDiscovery={handleDiscoveryDecision}
            />
        )}
    </div>
  );
};
