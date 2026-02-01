
import React from 'react';
import { TechTile, PlayerState } from '../../types/index';
import { TECH_SLOT_DISCOUNTS } from '../../constants/index';
import { Lock, FlaskConical, AlertCircle, Check } from 'lucide-react';

interface RareTechModalProps {
    tech: TechTile;
    player: PlayerState;
    onSelect: (category: 'military' | 'grid' | 'nano') => void;
    onCancel: () => void;
}

export const RareTechModal: React.FC<RareTechModalProps> = ({ tech, player, onSelect, onCancel }) => {
    
    const getOptionState = (category: 'military' | 'grid' | 'nano') => {
        const count = player.techs[category].length;
        const isFull = count >= TECH_SLOT_DISCOUNTS.length;
        
        // If full, we can't place it, cost doesn't strictly matter for the 'disabled' check, but we calculate it for display
        const discount = isFull ? 0 : TECH_SLOT_DISCOUNTS[count];
        const cost = Math.max(tech.minCost, tech.baseCost - discount);
        const canAfford = player.resources.current.science >= cost;

        let reason = null;
        if (isFull) reason = "Track Full";
        else if (!canAfford) reason = "Insufficient Science";

        return { cost, disabled: isFull || !canAfford, reason };
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 p-8 rounded-3xl border-2 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.4)] max-w-2xl w-full relative flex flex-col gap-6">
                
                {/* Header Section */}
                <div className="text-center border-b border-white/10 pb-6">
                    <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-2">{tech.name}</h2>
                    <p className="text-purple-300 text-lg">{tech.description}</p>
                </div>

                <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">Select Research Track</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['military', 'grid', 'nano'] as const).map(cat => {
                        const { cost, disabled, reason } = getOptionState(cat);
                        
                        // Style Config
                        const config = {
                            military: { color: 'pink', label: 'Military' },
                            grid: { color: 'green', label: 'Grid' },
                            nano: { color: 'yellow', label: 'Nano' }
                        }[cat];

                        const baseClass = `
                            relative p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 group
                        `;
                        
                        const activeClass = disabled 
                            ? 'bg-slate-950 border-slate-800 opacity-50 cursor-not-allowed'
                            : `bg-${config.color}-950/20 border-${config.color}-500/50 hover:bg-${config.color}-900/40 hover:border-${config.color}-400 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-${config.color}-500/20`;

                        const textClass = disabled ? 'text-slate-500' : `text-${config.color}-400 group-hover:text-white`;

                        return (
                            <button 
                                key={cat}
                                onClick={() => !disabled && onSelect(cat)} 
                                disabled={disabled}
                                className={`${baseClass} ${activeClass}`}
                            >
                                <div className={`text-lg font-bold uppercase tracking-wider ${textClass}`}>
                                    {config.label}
                                </div>

                                <div className={`flex items-center gap-2 text-xl font-mono font-bold ${disabled ? 'text-slate-600' : 'text-white'}`}>
                                    <FlaskConical size={18} />
                                    <span>{cost}</span>
                                </div>

                                {/* Status Indicator */}
                                {disabled ? (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl backdrop-blur-[1px]">
                                        <div className="bg-red-900/80 text-red-200 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 border border-red-500">
                                            {reason === "Track Full" ? <Lock size={12} /> : <AlertCircle size={12} />}
                                            {reason}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`text-[10px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity text-${config.color}-300`}>
                                        Click to Research
                                    </div>
                                )}
                            </button>
                        );
                    })}
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-center">
                    <button 
                        onClick={onCancel} 
                        className="px-8 py-3 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white font-bold transition-colors"
                    >
                        Cancel Research
                    </button>
                </div>
            </div>
        </div>
    );
};
