import React from 'react';
import { 
    Crosshair, Shield, Cpu
} from 'lucide-react';
import { TechTile, PlayerState } from '../../types/index';
import { TECH_SLOT_DISCOUNTS } from '../../constants/index';
import { TechIcon, TechStats } from './TechVisuals';

interface TechTrayProps {
    playerTechs?: PlayerState['techs'];
}

export const TechTray: React.FC<TechTrayProps> = ({ playerTechs }) => {
  const categories = [
    { 
      id: 'MILITARY', 
      label: 'Military', 
      key: 'military' as const,
      icon: <Crosshair className="text-pink-500" />, 
      color: 'border-pink-500/30 bg-pink-900/10 text-pink-500',
      slotBorder: 'border-pink-500/20 hover:border-pink-500/50',
      badgeColor: 'text-pink-500',
      iconColor: 'text-pink-400'
    },
    { 
      id: 'GRID', 
      label: 'Grid', 
      key: 'grid' as const,
      icon: <Shield className="text-green-500" />, 
      color: 'border-green-500/30 bg-green-900/10 text-green-500',
      slotBorder: 'border-green-500/20 hover:border-green-500/50',
      badgeColor: 'text-green-500',
      iconColor: 'text-green-400'
    },
    { 
      id: 'NANO', 
      label: 'Nano', 
      key: 'nano' as const,
      icon: <Cpu className="text-yellow-500" />, 
      color: 'border-yellow-500/30 bg-yellow-900/10 text-yellow-500',
      slotBorder: 'border-yellow-500/20 hover:border-yellow-500/50',
      badgeColor: 'text-yellow-500',
      iconColor: 'text-yellow-400'
    }
  ];

  const slots = TECH_SLOT_DISCOUNTS.map((discount, idx) => ({
      discount: discount > 0 ? `-${discount}` : "",
      vp: idx === 3 ? 0 : idx === 4 ? 1 : idx === 5 ? 2 : idx === 6 ? 3 : null
  }));

  const TechTileFull = ({ tech, defaultIconColor }: { tech: TechTile, defaultIconColor: string }) => {
      const isRare = tech.category === 'RARE';
      const iconColor = isRare ? 'text-purple-400' : defaultIconColor;
      const borderColor = isRare ? 'border-purple-500/50' : 'border-transparent';
      
      return (
        <div className={`
            w-full h-full flex flex-col justify-between p-2 rounded-lg relative overflow-hidden bg-slate-800 
            ${isRare ? 'border-2' : 'border'} ${borderColor}
            shadow-lg hover:-translate-y-0.5 transition-transform group
        `}>
            {/* Header */}
            <div className="flex justify-between items-start z-20 relative">
                <div className="text-[9px] lg:text-[10px] font-black leading-tight uppercase text-white tracking-wide max-w-[80%] truncate">{tech.name}</div>
            </div>
            
            {/* Central Icon */}
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-transform group-hover:scale-110 duration-500 ${iconColor}`}>
                <TechIcon iconId={tech.iconId} size={36} />
            </div>

            <div className="flex justify-between items-end mt-1 relative z-20 w-full">
                {/* Description Box REPLACED WITH ICONS */}
                <div className="bg-slate-900/80 p-1 rounded backdrop-blur-sm shadow-md border border-slate-700/50">
                    <TechStats techId={tech.id} />
                </div>
                
                {/* COST BUBBLES */}
                <div className="flex items-center relative h-8 w-10 scale-90 origin-bottom-right flex-none">
                    {/* Base Cost (White Square) */}
                    <div className="absolute right-0 bottom-0 w-8 h-8 bg-white rounded flex items-center justify-center shadow-lg z-10 border border-slate-300">
                        <span className="text-black font-black text-lg">{tech.baseCost}</span>
                    </div>
                    {/* Min Cost (Colored Circle) */}
                    <div className={`absolute right-6 bottom-[-4px] w-5 h-5 rounded-full border border-slate-800 flex items-center justify-center shadow-lg z-20 ${
                        tech.category === 'MILITARY' ? 'bg-pink-500 text-white' :
                        tech.category === 'GRID' ? 'bg-green-500 text-black' :
                        tech.category === 'NANO' ? 'bg-yellow-400 text-black' : 'bg-purple-500 text-white'
                    }`}>
                        <span className="font-black text-[9px]">{tech.minCost}</span>
                    </div>
                </div>
            </div>

            {/* Category stripe - ALWAYS reflects the tech's true category (Purple if Rare), not the slot */}
            <div className={`absolute top-0 left-0 w-1 h-full opacity-100 ${
                tech.category === 'MILITARY' ? 'bg-pink-500' :
                tech.category === 'GRID' ? 'bg-green-500' :
                tech.category === 'NANO' ? 'bg-yellow-500' : 'bg-purple-500'
            }`}></div>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-full gap-2 lg:gap-3 w-full">
       <div className="flex items-center gap-2 text-slate-500 font-bold tracking-[0.2em] uppercase text-xs lg:text-sm mb-1">
          <Cpu size={16} /> Technology Grid
       </div>
       
       <div className="flex-1 flex flex-col justify-between gap-2 lg:gap-4 bg-slate-900/40 border border-slate-700/50 rounded-2xl p-4 lg:p-6 backdrop-blur-sm shadow-inner overflow-x-auto">
          {categories.map((cat) => {
            const acquiredTechs = playerTechs ? playerTechs[cat.key] : [];
            
            return (
            <div key={cat.id} className="flex-1 flex items-center gap-2 lg:gap-4 min-w-[800px]">
                {/* Category Header (Left) */}
                <div className={`w-24 lg:w-32 flex-none flex flex-col items-center justify-center p-2 rounded-xl border ${cat.color} h-full min-h-[70px]`}>
                    <div className="mb-1 transform scale-125">{cat.icon}</div>
                    <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest opacity-80">{cat.label}</span>
                </div>

                {/* Slots (Center) */}
                <div className="flex-1 grid grid-cols-7 gap-2 h-full">
                    {slots.map((slot, idx) => {
                        const tech = acquiredTechs[idx]; // Get tech for this slot if exists

                        return (
                        <div 
                            key={idx}
                            className={`
                                relative rounded-lg border-2 ${cat.slotBorder} bg-slate-800/30 
                                flex items-center justify-center transition-colors group p-1
                                min-h-[100px]
                            `}
                        >
                            {/* Render Acquired Tech */}
                            {tech ? (
                                <TechTileFull tech={tech} defaultIconColor={cat.iconColor} />
                            ) : (
                                <>
                                    {/* VP Badge (Top Left) - Only show if empty */}
                                    {slot.vp !== null && (
                                        <div className={`
                                            absolute -top-[2px] -left-[2px] z-10 
                                            w-6 h-7 
                                            flex items-center justify-center 
                                            font-bold text-xs lg:text-sm
                                            shadow-md
                                            rounded-br-lg rounded-tl-md
                                            ${slot.vp === 0 ? 'bg-slate-600 text-slate-300' : 'bg-yellow-500 text-black border border-yellow-600'}
                                        `}>
                                            {slot.vp === 0 ? (
                                                <Shield size={10} className="fill-slate-400 text-slate-400" />
                                            ) : (
                                                <div className="flex flex-col items-center leading-none">
                                                    <Shield size={8} className="fill-black/20 text-transparent absolute opacity-20" />
                                                    <span className="relative z-10">{slot.vp}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Visual Placeholder for Tech Tile */}
                                    <div className="absolute inset-1 border border-dashed border-slate-600/30 rounded opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    {/* Cost Discount Label */}
                                    {slot.discount && (
                                        <span className={`font-mono font-bold text-lg lg:text-2xl opacity-60 group-hover:opacity-100 select-none ${cat.badgeColor}`}>
                                            {slot.discount}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    )})}
                </div>

                {/* Off-Board 5 VP (Right) */}
                <div className="flex-none flex items-center pl-2 border-l-2 border-slate-700/50 border-dashed h-full">
                    <div className="relative w-14 h-full bg-slate-800/50 rounded-lg border border-yellow-500/30 flex items-center justify-center group cursor-pointer hover:bg-yellow-900/20 transition-colors">
                        <div className="absolute -top-3 bg-yellow-500 text-black font-black text-xs px-2 py-0.5 rounded shadow-lg border border-yellow-400">
                             MAX
                        </div>
                        <div className="w-10 h-12 bg-yellow-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.2)] border-2 border-yellow-400 relative">
                             <Shield className="absolute text-yellow-600/30 w-full h-full p-1" />
                             <span className="text-2xl font-black text-black relative z-10">5</span>
                        </div>
                    </div>
                </div>
            </div>
          )})}
       </div>
    </div>
  );
};