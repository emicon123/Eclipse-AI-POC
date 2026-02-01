
import React, { useState } from 'react';
import { Blueprint, ShipPart, ShipStats, PartType } from '../../types/index';
import { DEFAULT_INTERCEPTOR, DEFAULT_CRUISER, DEFAULT_DREADNOUGHT, DEFAULT_STARBASE } from '../../constants/index';
import { Zap, Hexagon, Castle, Gem } from 'lucide-react';
import { ShipPartIcon, ShipPartStats } from './ShipPartIcons';
import { PartPicker } from './PartPicker';

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

  const getGridConfig = () => {
    switch(blueprint.shipType) {
      case 'Interceptor': return 'grid-cols-2 max-w-[400px] lg:max-w-[500px] 2xl:max-w-[600px]'; 
      case 'Cruiser': return 'grid-cols-3 max-w-[600px] lg:max-w-[750px] 2xl:max-w-[900px]';     
      case 'Dreadnought': return 'grid-cols-4 max-w-[800px] lg:max-w-[1000px] 2xl:max-w-[1200px]'; 
      case 'Starbase': return 'grid-cols-2 max-w-[400px] lg:max-w-[500px] 2xl:max-w-[600px]'; 
      default: return 'grid-cols-4';
    }
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
                        <ShipPartIcon type={part.type} size={80} />
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
                                <ShipPartStats part={part} />
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
        <PartPicker 
            pendingPart={pendingPart}
            availableTechIds={availableTechIds}
            shipType={blueprint.shipType}
            activationsRemaining={activationsRemaining}
            onPartSelect={handlePartSelect}
            onClose={() => setSelectedSlot(null)}
        />
      )}
    </div>
  );
};
