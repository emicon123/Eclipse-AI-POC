import React from 'react';
import { PlayerAction } from '../types';
import { Search, FlaskConical, Wrench, Hammer, Move, CircleDot } from 'lucide-react';
import { getDiscStyles } from '../utils/theme';

interface ActionPanelProps {
  onActionClick: (action: PlayerAction) => void;
  actionCounts?: Record<PlayerAction, number>;
  playerColor?: string;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ onActionClick, actionCounts, playerColor = 'blue' }) => {
  const actions: { id: PlayerAction; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'EXPLORE', label: 'EXP', icon: <Search className="w-6 h-6 lg:w-8 lg:h-8" />, color: 'border-orange-500 text-orange-400' },
    { id: 'RESEARCH', label: 'RES', icon: <FlaskConical className="w-6 h-6 lg:w-8 lg:h-8" />, color: 'border-pink-500 text-pink-400' },
    { id: 'UPGRADE', label: 'UPG', icon: <Wrench className="w-6 h-6 lg:w-8 lg:h-8" />, color: 'border-green-500 text-green-400' },
    { id: 'BUILD', label: 'BUI', icon: <Hammer className="w-6 h-6 lg:w-8 lg:h-8" />, color: 'border-yellow-500 text-yellow-400' },
    { id: 'MOVE', label: 'MOV', icon: <Move className="w-6 h-6 lg:w-8 lg:h-8" />, color: 'border-cyan-500 text-cyan-400' },
    { id: 'INFLUENCE', label: 'INF', icon: <CircleDot className="w-6 h-6 lg:w-8 lg:h-8" />, color: 'border-purple-500 text-purple-400' },
  ];
  
  const discStyle = getDiscStyles(playerColor);

  return (
    <div className="flex items-end gap-3 lg:gap-5">
      {actions.map((action) => {
        const count = actionCounts ? actionCounts[action.id] : 0;
        
        // Logic for action activation count badge
        // Explore and Research are 1 activation. Build, Upgrade, Move, Influence are typically 2 (or variable).
        const activationCount = (action.id === 'EXPLORE' || action.id === 'RESEARCH') ? '1' : '2';

        return (
            <button
            key={action.id}
            onClick={() => onActionClick(action.id)}
            className={`
                relative w-16 h-28 lg:w-20 lg:h-36 2xl:w-24 2xl:h-44 rounded-full border-[3px] bg-slate-900 hover:bg-slate-800 transition-all hover:-translate-y-3 shadow-lg hover:shadow-2xl
                flex flex-col items-center justify-between py-5 lg:py-6 group
                ${action.color}
            `}
            >
            {/* STACKED DISCS RENDERING */}
            {count > 0 && (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                     {/* Create an array of size 'count' to map through */}
                     {Array.from({ length: count }).map((_, i) => (
                        <div 
                            key={i}
                            className={`absolute rounded-full bg-gradient-to-br border shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center ${discStyle}`}
                            style={{
                                width: '60%',
                                height: 'auto',
                                aspectRatio: '1/1',
                                bottom: `${35 + (i * 8)}%`, // Stack vertically
                                zIndex: 50 + i,
                                transform: `translateY(${i * -2}px) scale(${1 + (i * 0.02)})` // Slight visual shift
                            }}
                        >
                            <div className="w-2/3 h-2/3 rounded-full border border-white/20 opacity-50 bg-white/10"></div>
                        </div>
                     ))}
                </div>
            )}

            {/* Top Label */}
            <span className="font-bold font-mono text-xl lg:text-2xl tracking-tighter leading-none relative z-10 bg-slate-900/50 px-1 rounded">{action.label}</span>
            
            {/* Bottom Icon Area */}
            <div className="w-12 h-12 lg:w-14 lg:h-14 2xl:w-16 2xl:h-16 rounded-full border-2 border-current flex items-center justify-center opacity-80 group-hover:opacity-100 bg-slate-950/50 shadow-inner relative z-10">
                {action.icon}
            </div>

            {/* Cost indicator */}
            <div className="absolute -bottom-4 lg:-bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 border-2 border-slate-600 rounded-full w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center text-sm lg:text-base text-white font-bold shadow-md z-20">
                {activationCount}
            </div>
            </button>
        );
      })}
    </div>
  );
};