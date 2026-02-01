
import React, { useState, useEffect } from 'react';
import { Blueprint, ShipPart, ShipStats, PartType } from '../../types/index';
import { SHIP_PARTS, DEFAULT_INTERCEPTOR, DEFAULT_CRUISER, DEFAULT_DREADNOUGHT, DEFAULT_STARBASE } from '../../constants/index';
import { hasRequiredTech, canEquipPartOnShip } from '../../utils/gameLogic';
import { Zap, Shield, Crosshair, Hexagon, MoveUp, Cpu, Rocket, Castle, Heart, Lock, Trash2, Undo2, Check, RotateCcw, Gem } from 'lucide-react';
import { TechIcon } from '../tech/TechVisuals';

interface ShipDesignerProps {
  blueprint: Blueprint;
  onUpdate: (blueprint: Blueprint, activationCost: number) => void;
  stats: ShipStats;
  playerColor?: string;
  availableTechIds: string[]; 
  activationsRemaining: number;
  pendingPart?: ShipPart | null;
}

const DEFAULT_BLUEPRINTS: Record<string, Blueprint> = {
    'Interceptor': DEFAULT_INTERCEPTOR,
    'Cruiser': DEFAULT_CRUISER,
    'Dreadnought': DEFAULT_DREADNOUGHT,
    'Starbase': DEFAULT_STARBASE
};

export const ShipDesigner: React.FC<ShipDesignerProps> = ({ 
    blueprint, onUpdate, stats, playerColor = 'blue', availableTechIds, 
    activationsRemaining, pendingPart
}) => {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const handlePartSelect = (part: ShipPart | null) => {
    if (selectedSlot === null) return;
    
    let newPart = part;
    let cost = 1; 

    // Special Case: Equipping the pending discovery part is generally considered free or part of the discovery action
    if (pendingPart && part?.id === pendingPart.id) {
        cost = 0; 
    }

    if (part === null) {
        const defaultBp = DEFAULT_BLUEPRINTS[blueprint.shipType];
        const defaultPart = defaultBp?.equipped[selectedSlot] || null;
        if (blueprint.equipped[selectedSlot]?.id === defaultPart?.id) {
             setSelectedSlot(null);
             return;
        }
        newPart = defaultPart;
        cost = newPart === null ? 0 : 1;
    }

    // Validation: If picking a discovery part, bypass activation check if cost is 0.
    if (cost > activationsRemaining) {
        alert("Not enough Upgrade Activations remaining!");
        return;
    }

    const newEquipped = [...blueprint.equipped];
    newEquipped[selectedSlot] = newPart;
    
    onUpdate({
      ...blueprint,
      equipped: newEquipped
    }, cost);
    
    setSelectedSlot(null);
  };

  const categories = Array.from(new Set(SHIP_PARTS.map(p => p.type)));

  const getGridConfig = () => {
    switch(blueprint.shipType) {
      case 'Interceptor': return 'grid-cols-2 max-w-[400px] lg:max-w-[500px] 2xl:max-w-[600px]'; 
      case 'Cruiser': return 'grid-cols-3 max-w-[600px] lg:max-w-[750px] 2xl:max-w-[900px]';     
      case 'Dreadnought': return 'grid-cols-4 max-w-[800px] lg:max-w-[1000px] 2xl:max-w-[1200px]'; 
      case 'Starbase': return 'grid-cols-2 max-w-[400px] lg:max-w-[500px] 2xl:max-w-[600px]'; 
      default: return 'grid-cols-4';
    }
  };

  const getPartIcon = (type: PartType) => {
    switch (type) {
        case PartType.CANNON: return <Crosshair size={80} strokeWidth={1.5} />;
        case PartType.MISSILE: return <Rocket size={80} strokeWidth={1.5} />;
        case PartType.COMPUTER: return <Cpu size={80} strokeWidth={1.5} />;
        case PartType.SHIELD: return <Shield size={80} strokeWidth={1.5} />;
        case PartType.HULL: return <Heart size={80} strokeWidth={1.5} />;
        case PartType.DRIVE: return <Hexagon size={80} strokeWidth={1.5} />;
        case PartType.SOURCE: return <Zap size={80} strokeWidth={1.5} />;
        case PartType.INITIATIVE: return <MoveUp size={80} strokeWidth={1.5} />;
        default: return <Hexagon size={80} />;
    }
  };

  const renderMainStat = (part: ShipPart, isPicker = false) => {
      const textClass = isPicker ? "text-lg lg:text-xl font-bold" : "text-2xl lg:text-3xl font-bold";
      const iconSize = isPicker ? 18 : 24;

      if (part.type === PartType.DRIVE) {
          return (
              <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1 text-purple-400 ${textClass}`}>
                      <MoveUp size={iconSize} /><span>+{part.initiative}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-emerald-400 ${textClass}`}>
                      <Hexagon size={iconSize} /><span>+{part.initiative}</span>
                  </div>
              </div>
          );
      }

      if (part.damage > 0) return <div className={`flex items-center gap-1 text-red-400 ${textClass}`}><Crosshair size={iconSize} /><span>{part.damage}</span></div>;
      if (part.shield > 0) return <div className={`flex items-center gap-1 text-cyan-400 ${textClass}`}><Shield size={iconSize} /><span>-{part.shield}</span></div>;
      if (part.computer > 0) return <div className={`flex items-center gap-1 text-blue-400 ${textClass}`}><Cpu size={iconSize} /><span>+{part.computer}</span></div>;
      if (part.hull > 0) return <div className={`flex items-center gap-1 text-green-500 ${textClass}`}><Heart size={iconSize} /><span>{part.hull}</span></div>;
      if (part.powerGeneration > 0) return <div className={`flex items-center gap-1 text-yellow-400 ${textClass}`}><Zap size={iconSize} /><span>+{part.powerGeneration}</span></div>;
      
      if (part.initiative > 0) return <div className={`flex items-center gap-1 text-purple-400 ${textClass}`}><MoveUp size={iconSize} /><span>+{part.initiative}</span></div>;
      return null;
  };

  const getHeaderIconColor = () => {
       switch(playerColor) {
        case 'white': return 'text-white';
        case 'black': return 'text-zinc-400';
        case 'green': return 'text-green-500';
        case 'blue': return 'text-blue-500';
        case 'yellow': return 'text-yellow-500';
        case 'red': return 'text-red-500';
        default: return 'text-blue-500';
    }
  }

  const getShipIcon = () => {
      return blueprint.shipType === 'Starbase' ? <Castle className={getHeaderIconColor()} size={32} /> : <Hexagon className={getHeaderIconColor()} size={32} />;
  }

  return (
    <div className="bg-slate-800/50 p-6 lg:p-10 rounded-3xl border border-slate-700 backdrop-blur-md h-full flex flex-col relative">
      
      {/* PENDING DISCOVERY PART BANNER */}
      {pendingPart && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce">
               <div className="bg-yellow-500 text-black px-6 py-2 rounded-full font-bold shadow-[0_0_20px_rgba(234,179,8,0.5)] border-2 border-yellow-300 flex items-center gap-2">
                   <Gem size={20} />
                   ANCIENT TECHNOLOGY DISCOVERED!
               </div>
          </div>
      )}

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 flex-none">
        <div className="flex items-center gap-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-white flex items-center gap-3">
            {getShipIcon()}
            {blueprint.shipType}
            </h2>
        </div>

        <div className="flex gap-4">
             {/* Errors display */}
             {!stats.isValid && stats.errors.length > 0 && (
                 <div className="flex flex-col items-end justify-center mr-4">
                     {stats.errors.map((err, i) => (
                         <span key={i} className="text-xs font-bold text-red-400 animate-pulse">{err}</span>
                     ))}
                 </div>
             )}
        </div>
      </div>

      {/* Slots Grid */}
      <div className="flex-1 flex flex-col items-center justify-center mb-8 min-h-0 overflow-y-auto">
          <div className={`grid gap-4 lg:gap-6 w-full transition-all duration-300 ${getGridConfig()}`}>
            {blueprint.equipped.map((part, index) => (
              <div 
                key={index}
                onClick={() => setSelectedSlot(index)}
                className={`
                  relative aspect-square rounded-2xl border-[3px] cursor-pointer transition-all hover:scale-[1.02] group overflow-hidden
                  flex flex-col
                  ${selectedSlot === index ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.5)] bg-slate-800' : 'border-slate-600 hover:border-slate-400 bg-slate-900'}
                  ${!part ? 'bg-slate-900/40 border-dashed' : ''}
                `}
              >
                {part ? (
                  <>
                    <div className={`absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none ${part.color} scale-125 group-hover:scale-150 transition-transform duration-500`}>
                        {getPartIcon(part.type)}
                    </div>

                    <div className="relative z-10 h-full flex flex-col justify-between p-4 lg:p-5">
                        <div className={`font-black text-lg lg:text-2xl leading-tight text-center ${part.color} drop-shadow-md`}>
                            {part.name}
                        </div>

                        <div className="flex items-end justify-between mt-auto">
                            <div className="flex flex-col items-center">
                                {(part.powerUsage > 0 || part.powerGeneration > 0) && (
                                    <div className="flex items-center gap-1 font-bold text-3xl lg:text-4xl drop-shadow-md">
                                        <Zap size={28} className={part.powerGeneration > 0 ? "text-yellow-400 fill-yellow-400/20" : "text-pink-400"} />
                                        <span className={part.powerGeneration > 0 ? "text-yellow-100" : "text-pink-200"}>
                                            {part.powerGeneration > 0 ? `+${part.powerGeneration}` : `-${part.powerUsage}`}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="drop-shadow-md">
                                {renderMainStat(part)}
                            </div>
                        </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center flex-col gap-2">
                     <div className="w-12 h-12 rounded-full border-2 border-slate-700 flex items-center justify-center text-slate-700 group-hover:border-slate-500 group-hover:text-slate-500 transition-colors">
                         <Hexagon size={24} />
                     </div>
                     <span className="text-slate-600 font-mono text-sm uppercase tracking-[0.2em] group-hover:text-slate-400 transition-colors">Empty</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
           {/* Fixed Base Power Display for Starbases */}
           {blueprint.basePowerGeneration && blueprint.basePowerGeneration > 0 && (
              <div className="mt-8 bg-yellow-900/20 border border-yellow-600/50 px-8 py-3 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5">
                  <div className="bg-yellow-500/20 p-2 rounded-full border border-yellow-500 text-yellow-500">
                      <Zap size={24} />
                  </div>
                  <div>
                      <div className="text-sm font-bold text-yellow-500 uppercase tracking-widest">Base Reactor Core</div>
                      <div className="text-2xl font-black text-white">+{blueprint.basePowerGeneration} Energy (Permanent)</div>
                  </div>
              </div>
          )}
      </div>

      {/* Part Picker Modal */}
      {selectedSlot !== null && (
        <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-xl p-8 lg:p-12 animate-in fade-in zoom-in-95 flex flex-col">
          <div className="flex justify-between items-center mb-8 flex-none">
            <div>
                <h3 className="text-3xl font-bold text-white">Select Component</h3>
                {pendingPart ? (
                    <p className="text-yellow-400 text-sm mt-1 flex items-center gap-2"><Gem size={14}/> Discovery Part Available</p>
                ) : (
                    <p className="text-slate-400 text-sm mt-1">Cost: <strong className="text-white">1 Activation</strong></p>
                )}
            </div>
            
            <button 
                onClick={() => handlePartSelect(null)} 
                className="px-6 py-3 bg-blue-500/10 border border-blue-500/50 text-blue-400 hover:bg-blue-500/20 rounded-xl text-lg transition-colors flex items-center gap-2 font-bold group"
            >
                <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" /> Revert to Default
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 pr-2">
            
            {/* PENDING PART CARD */}
            {pendingPart && (
                <button
                    onClick={() => handlePartSelect(pendingPart)}
                    className="h-32 lg:h-40 p-4 lg:p-5 text-left rounded-xl border-2 transition-all relative overflow-hidden group hover:border-yellow-400 hover:bg-yellow-900/20 border-yellow-600 bg-yellow-900/10 animate-pulse"
                >
                    <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12 scale-150 text-yellow-500">
                        {getPartIcon(pendingPart.type)}
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="font-bold text-lg lg:text-xl truncate pr-2 text-yellow-400">{pendingPart.name}</div>
                        <div className="absolute top-2 right-2 text-yellow-500"><Gem size={16} /></div>
                        <div className="flex items-end justify-between w-full mt-2">
                             <div className="text-xs text-yellow-500/80 uppercase font-bold">Free Equip</div>
                             <div className="flex flex-col items-end">{renderMainStat(pendingPart, true)}</div>
                        </div>
                    </div>
                </button>
            )}

            {categories.map(cat => {
               const partsInCat = SHIP_PARTS.filter(p => p.type === cat && !p.isRare); // Don't show rare parts in normal picker
               if (partsInCat.length === 0) return null;
               
               return (
                 <React.Fragment key={cat}>
                     {partsInCat.map(part => {
                         // Validation Logic
                         const isUnlocked = hasRequiredTech(part, availableTechIds);
                         const isAllowedOnShip = canEquipPartOnShip(part, blueprint.shipType);
                         const isSelectable = isUnlocked && isAllowedOnShip;
                         const isTooExpensive = activationsRemaining <= 0;

                         return (
                           <button
                             key={part.id}
                             disabled={!isSelectable || isTooExpensive}
                             onClick={() => handlePartSelect(part)}
                             className={`
                                h-32 lg:h-40 p-4 lg:p-5 text-left rounded-xl border-2 transition-all relative overflow-hidden group
                                ${isSelectable 
                                    ? `hover:border-white hover:bg-slate-800 ${part.color} border-slate-700 bg-slate-800/50` 
                                    : 'border-slate-800 bg-slate-900/50 opacity-50 cursor-not-allowed grayscale'}
                                ${isSelectable && isTooExpensive ? 'opacity-50 cursor-not-allowed' : ''}
                             `}
                           >
                             <div className="absolute -right-4 -bottom-4 opacity-10 transform rotate-12 scale-150">
                                {getPartIcon(part.type)}
                             </div>
                             
                             {!isSelectable && (
                                 <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40">
                                     <div className="bg-slate-900/90 rounded-full p-2 border border-slate-600">
                                         <Lock size={24} className="text-slate-400" />
                                     </div>
                                 </div>
                             )}

                             <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="font-bold text-lg lg:text-xl truncate pr-2">{part.name}</div>
                                
                                <div className="flex items-end justify-between w-full mt-2">
                                    <div className="text-sm lg:text-base text-slate-400 font-mono flex flex-col gap-1">
                                        {part.powerUsage > 0 && <span className="flex items-center text-pink-300"><Zap size={14} className="mr-1"/> -{part.powerUsage}</span>}
                                        {part.cost > 0 && <span className="bg-slate-900 px-2 rounded text-slate-300 border border-slate-700 text-xs">${part.cost}</span>}
                                    </div>
                                    <div className="flex flex-col items-end">
                                        {renderMainStat(part, true)}
                                    </div>
                                </div>
                             </div>
                           </button>
                         )
                     })}
                 </React.Fragment>
               )
            })}
          </div>
          <button 
            onClick={() => setSelectedSlot(null)}
            className="mt-8 flex-none w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xl rounded-xl border border-slate-600 hover:border-slate-500 transition-all flex items-center justify-center gap-2"
          >
            <Undo2 /> Cancel Selection
          </button>
        </div>
      )}
    </div>
  );
};
