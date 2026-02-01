
import React from 'react';
import { ShipPart } from '../../types/index';
import { SHIP_PARTS } from '../../constants/index';
import { hasRequiredTech, canEquipPartOnShip } from '../../utils/gameLogic';
import { Lock, Zap, RotateCcw, Gem, Undo2 } from 'lucide-react';
import { ShipPartIcon, ShipPartStats } from './ShipPartIcons';

interface PartPickerProps {
    pendingPart?: ShipPart | null;
    availableTechIds: string[];
    shipType: string;
    activationsRemaining: number;
    onPartSelect: (part: ShipPart | null) => void;
    onClose: () => void;
}

export const PartPicker: React.FC<PartPickerProps> = ({ 
    pendingPart, availableTechIds, shipType, activationsRemaining, onPartSelect, onClose 
}) => {
    const categories = Array.from(new Set(SHIP_PARTS.map(p => p.type)));

    return (
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
                onClick={() => onPartSelect(null)} 
                className="px-6 py-3 bg-blue-500/10 border border-blue-500/50 text-blue-400 hover:bg-blue-500/20 rounded-xl text-lg transition-colors flex items-center gap-2 font-bold group"
            >
                <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" /> Revert to Default
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 pr-2">
            
            {/* PENDING PART CARD */}
            {pendingPart && (
                <button
                    onClick={() => onPartSelect(pendingPart)}
                    className="h-32 lg:h-40 p-4 lg:p-5 text-left rounded-xl border-2 transition-all relative overflow-hidden group hover:border-yellow-400 hover:bg-yellow-900/20 border-yellow-600 bg-yellow-900/10 animate-pulse"
                >
                    <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12 scale-150 text-yellow-500">
                        <ShipPartIcon type={pendingPart.type} size={80} />
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="font-bold text-lg lg:text-xl truncate pr-2 text-yellow-400">{pendingPart.name}</div>
                        <div className="absolute top-2 right-2 text-yellow-500"><Gem size={16} /></div>
                        <div className="flex items-end justify-between w-full mt-2">
                             <div className="text-xs text-yellow-500/80 uppercase font-bold">Free Equip</div>
                             <div className="flex flex-col items-end"><ShipPartStats part={pendingPart} isPicker={true} /></div>
                        </div>
                    </div>
                </button>
            )}

            {categories.map(cat => {
               const partsInCat = SHIP_PARTS.filter(p => p.type === cat && !p.isRare); 
               if (partsInCat.length === 0) return null;
               
               return (
                 <React.Fragment key={cat}>
                     {partsInCat.map(part => {
                         const isUnlocked = hasRequiredTech(part, availableTechIds);
                         const isAllowedOnShip = canEquipPartOnShip(part, shipType);
                         const isSelectable = isUnlocked && isAllowedOnShip;
                         const isTooExpensive = activationsRemaining <= 0;

                         return (
                           <button
                             key={part.id}
                             disabled={!isSelectable || isTooExpensive}
                             onClick={() => onPartSelect(part)}
                             className={`
                                h-32 lg:h-40 p-4 lg:p-5 text-left rounded-xl border-2 transition-all relative overflow-hidden group
                                ${isSelectable 
                                    ? `hover:border-white hover:bg-slate-800 ${part.color} border-slate-700 bg-slate-800/50` 
                                    : 'border-slate-800 bg-slate-900/50 opacity-50 cursor-not-allowed grayscale'}
                                ${isSelectable && isTooExpensive ? 'opacity-50 cursor-not-allowed' : ''}
                             `}
                           >
                             <div className="absolute -right-4 -bottom-4 opacity-10 transform rotate-12 scale-150">
                                <ShipPartIcon type={part.type} size={80} />
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
                                        <ShipPartStats part={part} isPicker={true} />
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
            onClick={onClose}
            className="mt-8 flex-none w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xl rounded-xl border border-slate-600 hover:border-slate-500 transition-all flex items-center justify-center gap-2"
          >
            <Undo2 /> Cancel Selection
          </button>
        </div>
    );
};
