import React from 'react';
import { ShipStats, Blueprint } from '../../types/index';
import { Crosshair, Shield, MoveUp, Zap, Hexagon, Cpu, Pickaxe, Castle, Heart } from 'lucide-react';
import { THEME_STYLES } from '../../utils/theme';

interface ShipSummaryCardProps {
  blueprint: Blueprint;
  stats: ShipStats;
  onClick: () => void;
  playerColor?: string;
}

export const ShipSummaryCard: React.FC<ShipSummaryCardProps> = ({ blueprint, stats, onClick, playerColor = 'blue' }) => {
  const styles = THEME_STYLES[playerColor] || THEME_STYLES['blue'];
  const isStarbase = blueprint.shipType === 'Starbase';

  return (
    <div 
      onClick={onClick}
      className={`h-full bg-slate-800/80 border-2 border-slate-600 ${styles.hoverBorder} rounded-2xl p-5 lg:p-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-current/10 group relative overflow-hidden flex flex-col justify-between`}
    >
      <div className="flex justify-between items-start mb-2 relative z-10">
        <h3 className="text-lg lg:text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            {isStarbase ? <Castle size={20} className={styles.text} /> : <Hexagon size={20} className={styles.text} />}
            {blueprint.shipType}
        </h3>
        <div className="text-xs lg:text-sm font-bold text-amber-400 bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-800/50 flex items-center gap-1">
            <Pickaxe size={14} />
            {stats.cost}
        </div>
      </div>

      {/* Stats Grid - 2 Columns */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-4 relative z-10">
         
         {/* Initiative (Purple Arrow) */}
         <div className="flex items-center gap-2" title="Initiative">
            <MoveUp size={18} className="text-purple-400" />
            <span className="text-base lg:text-xl font-bold text-white">{stats.initiative}</span>
         </div>

         {/* Hull (Green Heart) */}
         <div className="flex items-center gap-2" title="Hull">
            <Heart size={18} className="text-green-500 fill-green-500/20" />
            <span className="text-base lg:text-xl font-bold text-white">{stats.hull}</span>
         </div>

         {/* Computer (Blue CPU) */}
         <div className="flex items-center gap-2" title="Computers">
            <Cpu size={18} className="text-blue-400" />
            <span className="text-base lg:text-xl font-bold text-white">+{stats.computer}</span>
         </div>

         {/* Shield (Cyan Shield) */}
         <div className="flex items-center gap-2" title="Shields">
            <Shield size={18} className="text-cyan-400" />
            <span className="text-base lg:text-xl font-bold text-white">-{stats.shield}</span>
         </div>

         {/* Movement (Drive) - HEXAGON ICON */}
         <div className="flex items-center gap-2" title="Movement Range">
            <Hexagon size={18} className="text-emerald-300 fill-emerald-300/20 stroke-[2px]" />
            <span className="text-base lg:text-xl font-bold text-white">{stats.movement}</span>
         </div>

         {/* Damage (Red Crosshair) */}
         <div className="flex items-center gap-2" title="Total Damage">
            <Crosshair size={18} className="text-red-500" />
            <span className="text-base lg:text-xl font-black text-white">{stats.damage}</span>
         </div>

      </div>

      {/* Power Warning */}
      {!stats.isValid && (
          <div className="absolute bottom-2 right-2 bg-red-900/80 px-2 py-1 rounded text-red-200 text-[10px] font-bold flex items-center gap-1 animate-pulse">
              <Zap size={12} /> POWER LOW
          </div>
      )}
      
      {/* Background Decor */}
      {isStarbase ? 
        <Castle className="absolute -right-8 -bottom-8 text-slate-700/20 rotate-0 transition-transform group-hover:scale-110 duration-700" size={120} />
        :
        <Hexagon className="absolute -right-8 -bottom-8 text-slate-700/20 rotate-12 transition-transform group-hover:rotate-45 duration-700" size={120} />
      }
    </div>
  );
};