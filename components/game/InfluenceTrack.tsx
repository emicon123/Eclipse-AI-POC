import React from 'react';
import { getDiscStylesTransparent } from '../../utils/theme';

interface InfluenceTrackProps {
  usedDiscs: number;
  totalDiscs: number;
  onDiscChange: (count: number) => void;
  playerColor?: string;
}

const UPKEEP_COSTS = [0, 0, 1, 2, 3, 5, 7, 10, 13, 17, 21, 25, 30];

export const InfluenceTrack: React.FC<InfluenceTrackProps> = ({ usedDiscs, totalDiscs, onDiscChange, playerColor = 'blue' }) => {
  const discStyle = getDiscStylesTransparent(playerColor);

  return (
    <div className="flex items-center gap-2 overflow-x-visible w-full justify-between pt-6 pb-2"> {/* Added top padding for cost badges */}
      
      {/* "Available" Counter Box */}
      <div className="flex items-center bg-slate-800 p-3 lg:p-4 rounded-xl border border-slate-700 shadow-lg flex-shrink-0 mr-4 self-center">
         <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-slate-700 border-2 border-slate-500 flex items-center justify-center font-bold text-lg lg:text-2xl text-slate-300">
            {totalDiscs - usedDiscs}
         </div>
         <span className="ml-3 text-xs lg:text-sm font-bold text-slate-400 uppercase tracking-widest hidden lg:inline-block">Available</span>
      </div>

      {/* Track Slots */}
      <div className="flex-1 flex justify-between items-center relative">
        {/* Connection Line */}
        <div className="absolute left-0 right-0 h-1 bg-slate-800 z-0 top-1/2 -translate-y-1/2"></div>

        {UPKEEP_COSTS.map((cost, index) => {
          // In Eclipse, you take the LEFTMOST disc first. 
          // This means indices 0, 1, 2... become empty as 'usedDiscs' increases.
          // Discs remain on the right side (higher indices).
          const hasDisc = index >= usedDiscs;

          return (
            <div 
              key={index} 
              // Simulation only: clicking a disc effectively sets 'usedDiscs' to match this position
              className="relative flex-shrink-0 cursor-default group z-10"
              style={{ width: 'auto' }} 
            >
               {/* Cost Badge (Floating Above) */}
               <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-orange-500 border border-orange-400 flex items-center justify-center text-[10px] lg:text-xs font-black text-black shadow-md z-30">
                  {cost}
               </div>

              {/* The Disc Slot */}
              <div className="w-10 h-10 lg:w-14 lg:h-14 2xl:w-16 2xl:h-16 rounded-full border border-slate-600 bg-slate-900/80 flex items-center justify-center shadow-inner relative overflow-hidden">
                   {/* Inner ring decoration */}
                   <div className="absolute inset-1 border border-slate-700 rounded-full opacity-50"></div>
                   
                   {/* The Player Disc (Sitting in slot) */}
                   {hasDisc && (
                        <div className={`absolute inset-0 m-1 rounded-full bg-gradient-to-br border shadow-[0_4px_6px_rgba(0,0,0,0.5)] flex items-center justify-center z-20 backdrop-blur-sm opacity-60 ${discStyle}`}>
                            {/* Reflection/Shine for 3D effect */}
                            <div className="w-2/3 h-1/2 rounded-full bg-gradient-to-b from-white/30 to-transparent absolute top-1 left-1/2 -translate-x-1/2"></div>
                        </div>
                   )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};