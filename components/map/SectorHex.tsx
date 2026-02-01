
import React from 'react';
import { Rocket, Search, Gem } from 'lucide-react';
import { SectorData, ResourceType } from '../../types/index';
import { HEX_WIDTH, HEX_HEIGHT, hexToPixel, toRoman } from '../../utils/hexUtils';
import { GuardianShipIcon, InterceptorIcon, GCDSIcon } from './MapIcons';

const COLOR_STYLES: Record<string, { stroke: string, shadow: string, rocket: string, bg: string, fill: string }> = {
    'white': { stroke: 'stroke-white', shadow: 'rgba(255,255,255,0.6)', rocket: 'text-white', bg: 'bg-white/20', fill: 'fill-white' },
    'black': { stroke: 'stroke-zinc-500', shadow: 'rgba(113,113,122,0.8)', rocket: 'text-zinc-400', bg: 'bg-zinc-500/20', fill: 'fill-zinc-400' },
    'green': { stroke: 'stroke-green-500', shadow: 'rgba(34,197,94,0.6)', rocket: 'text-green-500', bg: 'bg-green-500/20', fill: 'fill-green-500' },
    'blue': { stroke: 'stroke-blue-500', shadow: 'rgba(59,130,246,0.6)', rocket: 'text-blue-500', bg: 'bg-blue-500/20', fill: 'fill-blue-500' },
    'yellow': { stroke: 'stroke-yellow-500', shadow: 'rgba(234,179,8,0.6)', rocket: 'text-yellow-500', bg: 'bg-yellow-500/20', fill: 'fill-yellow-500' },
    'red': { stroke: 'stroke-red-500', shadow: 'rgba(239,68,68,0.6)', rocket: 'text-red-500', bg: 'bg-red-500/20', fill: 'fill-red-500' },
};

export const SectorHex: React.FC<{ 
    data: SectorData; 
    onExplore?: () => void;
    isExploring?: boolean;
    isPending?: boolean;
    isColonizing?: boolean;
    onColonizeSlot?: (slotId: string, type: ResourceType) => void;
}> = ({ data, onExplore, isExploring, isPending, isColonizing, onColonizeSlot }) => {
  const { x, y } = hexToPixel(data.q, data.r);
  
  // Vertices for a flat-topped hexagon
  const w = HEX_WIDTH;
  const h = HEX_HEIGHT;
  const points = `${w*0.25},0 ${w*0.75},0 ${w},${h/2} ${w*0.75},${h} ${w*0.25},${h} 0,${h/2}`;

  // Calculate wormhole rotations
  const rotatedWormholes = data.wormholes ? [...data.wormholes] : [];
  if (data.rotation) {
      for(let i=0; i<data.rotation; i++) {
          rotatedWormholes.unshift(rotatedWormholes.pop()!);
      }
  }

  const getVisuals = () => {
    if (isPending) {
        return {
            polyClass: 'fill-orange-500/20 stroke-orange-400 animate-pulse stroke-[3px]',
            strokeDasharray: "6 4",
            contentClass: 'text-orange-400',
            filter: 'drop-shadow(0 0 10px rgba(249, 115, 22, 0.4))'
        }
    }

    if (data.type === 'EMPTY_ZONE') {
        const isFar = data.ring >= 3;
        
        if (isExploring) {
            return {
                polyClass: `fill-orange-500/10 stroke-orange-500 hover:fill-orange-500/30 cursor-pointer stroke-[3px]`,
                strokeDasharray: "6 4",
                contentClass: 'text-orange-400 group-hover:text-orange-200',
                filter: 'drop-shadow(0 0 5px rgba(249, 115, 22, 0.3))'
            }
        }

        const strokeClass = isFar ? 'stroke-emerald-500/30 group-hover:stroke-emerald-400/60' : 'stroke-yellow-500/30 group-hover:stroke-yellow-400/60';
        const textClass = isFar ? 'text-emerald-500/40 group-hover:text-emerald-400' : 'text-yellow-500/40 group-hover:text-yellow-400';
        
        return {
            polyClass: `fill-slate-900/40 ${strokeClass} hover:fill-slate-800/60 cursor-default stroke-[2px]`,
            strokeDasharray: "6 4",
            contentClass: textClass,
            filter: ''
        };
    }

    if (data.playerColor) {
        const styles = COLOR_STYLES[data.playerColor] || COLOR_STYLES['blue'];
        return {
            polyClass: `fill-slate-800 ${styles.stroke} stroke-[4px]`,
            strokeDasharray: undefined,
            contentClass: 'text-slate-200',
            filter: `drop-shadow(0 0 12px ${styles.shadow})`
        };
    }
    
    return { 
        polyClass: 'fill-slate-800 stroke-slate-600 stroke-[2px]',
        strokeDasharray: undefined,
        contentClass: 'text-slate-400',
        filter: ''
    };
  };

  const visuals = getVisuals();
  const playerStyles = data.playerColor ? (COLOR_STYLES[data.playerColor] || COLOR_STYLES['blue']) : null;

  return (
    <div 
      onClick={isExploring && data.type === 'EMPTY_ZONE' ? onExplore : undefined}
      className={`absolute group flex items-center justify-center transition-all duration-500 ${isPending ? 'z-50' : 'hover:z-10'}`}
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        width: `${HEX_WIDTH}px`,
        height: `${HEX_HEIGHT}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: isPending ? 50 : (data.playerColor ? 20 : 10)
      }}
    >
        {/* Main Hex Polygon */}
        <svg 
            width={HEX_WIDTH} 
            height={HEX_HEIGHT} 
            viewBox={`0 0 ${HEX_WIDTH} ${HEX_HEIGHT}`} 
            className="absolute inset-0 overflow-visible transition-all duration-300"
            style={{ filter: visuals.filter }}
        >
            <polygon 
                points={points}
                className={`transition-all duration-300 ${visuals.polyClass}`}
                strokeDasharray={visuals.strokeDasharray}
            />
            {rotatedWormholes.map((hasWormhole, i) => {
                if (!hasWormhole) return null;
                return (
                    <g key={i} transform={`rotate(${i * 60}, ${w/2}, ${h/2})`} className="pointer-events-none">
                        <g transform={`translate(${w/2}, 0)`}>
                             <path 
                                d="M -12 2 Q 0 16 12 2" 
                                fill="none" 
                                stroke="white" 
                                strokeWidth="3" 
                                strokeLinecap="round"
                                className="drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]" 
                             />
                             <circle cx="0" cy="8" r="2" fill="white" className="animate-pulse" />
                        </g>
                    </g>
                );
            })}
        </svg>

        {/* Content Layer */}
        <div className={`relative z-10 flex flex-col items-center justify-center pointer-events-none ${visuals.contentClass}`}>
            {data.type === 'EMPTY_ZONE' ? (
                <div className={`flex flex-col items-center transition-opacity transform group-hover:scale-110 ${isExploring ? 'opacity-100 scale-110 animate-pulse' : 'opacity-60'}`}>
                    <span className="text-xl font-black opacity-40 select-none">{toRoman(data.ring >= 3 ? 3 : data.ring)}</span>
                    {isExploring && <Search size={24} className="mt-1" />}
                </div>
            ) : (
                <>
                    <div className="absolute -top-10 font-mono text-[9px] text-slate-500/50 font-bold tracking-widest select-none opacity-0 group-hover:opacity-100 transition-opacity">
                        SEC {data.id}
                    </div>
                    
                    <div className="transform transition-transform group-hover:-translate-y-1 flex flex-col items-center">
                        {data.type === 'CENTER' && (
                            <>
                                <GCDSIcon size={40} className="mb-1 drop-shadow-xl" />
                                <span className="text-[9px] font-bold text-slate-500 tracking-wider">GCDS</span>
                            </>
                        )}
                        
                        {/* Hostiles */}
                        {data.type !== 'CENTER' && data.ancients > 0 && (
                            <div className="flex flex-col items-center">
                                <GuardianShipIcon size={28} className="text-pink-500 mb-1 drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]" />
                                {data.ancients > 1 && <span className="text-xs font-bold text-pink-500">x{data.ancients}</span>}
                            </div>
                        )}

                        {/* Player Ships */}
                        {data.ships && data.ships.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-1 mt-1 max-w-[50px]">
                                {data.ships.map((ship, idx) => {
                                    const shipStyle = COLOR_STYLES[ship.owner] || COLOR_STYLES['blue'];
                                    return (
                                        <div key={ship.id || idx} className={`${shipStyle.rocket} drop-shadow-md transform hover:scale-125 transition-transform`}>
                                            <InterceptorIcon size={20} />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        
                        {/* Discovery Tile Icon */}
                        {data.hasDiscoveryTile && !data.claimedDiscovery && (
                            <div className="absolute -right-8 top-0 animate-bounce">
                                <div className="bg-yellow-500 text-black p-1 rounded-full shadow-lg border border-yellow-300">
                                    <Gem size={14} />
                                </div>
                            </div>
                        )}

                        {(data.type === 'START' || data.playerColor) && playerStyles && (
                            <>
                                <div className={`w-8 h-8 rounded-full ${playerStyles.bg} flex items-center justify-center mb-1 border border-current`}>
                                    <Rocket size={16} className={playerStyles.rocket} />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Population Slots - Render for all sectors except Empty Zones */}
                    {data.populationSlots && data.populationSlots.length > 0 && (
                        <div className="flex gap-1 mt-2 pointer-events-auto">
                            {data.populationSlots.map((slot) => {
                                const isMoney = slot.type === 'money';
                                const isScience = slot.type === 'science';
                                const bgClass = isMoney ? 'bg-yellow-500' : isScience ? 'bg-pink-500' : 'bg-orange-500';
                                const isOccupied = slot.status === 'OCCUPIED';
                                const isEmpty = slot.status === 'EMPTY';
                                
                                // Interactive if colonizing and empty and player owns sector
                                const canColonize = isColonizing && isEmpty && data.playerColor;

                                return (
                                    <div 
                                        key={slot.id} 
                                        onClick={() => canColonize && onColonizeSlot && onColonizeSlot(slot.id, slot.type)}
                                        className={`
                                            w-3 h-3 rounded-[2px] border border-black/30 shadow-sm relative
                                            ${bgClass}
                                            ${canColonize ? 'cursor-pointer hover:scale-150 animate-pulse border-white border-2 z-50' : ''}
                                        `} 
                                    >
                                        {isOccupied && (
                                            <div className="absolute inset-0 bg-white/30 rounded-[1px]"></div>
                                        )}
                                        {isEmpty && (
                                            <div className="absolute inset-0 bg-black/60 rounded-[1px]"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    
                    {/* Victory Point / Cost Badge */}
                    {(
                         <div className="absolute top-[40px] right-[-30px] w-5 h-5 bg-black border border-slate-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                            {data.type === 'CENTER' ? 4 : (data.type === 'GUARDIAN' ? 2 : 3)}
                        </div>
                    )}
                </>
            )}
        </div>
    </div>
  );
};
