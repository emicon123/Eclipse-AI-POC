
import React from 'react';
import { PlayerState, PlayerResources } from '../../types/index';
import { POPULATION_TRACK } from '../../constants/index';
import { Coins, FlaskConical, Pickaxe, Skull, LayoutDashboard } from 'lucide-react';

interface ControlBoardProps {
    playerState: PlayerState;
    onUpdateResource: (type: keyof PlayerResources, value: number) => void;
    onUpdatePopulation: (type: keyof PlayerResources, count: number) => void;
    onClose: () => void;
}

export const ControlBoard: React.FC<ControlBoardProps> = ({ 
    playerState, 
    onUpdateResource, 
    onUpdatePopulation,
    onClose
}) => {
    
    const renderTrack = (type: keyof PlayerResources, color: string, icon: React.ReactNode, graveyards: number) => {
        // countOnTrack: Number of cubes currently ON the track (covering numbers)
        // If 12 (max), all numbers 2..28 are covered.
        // If 11, the first one (2) is uncovered? 
        // Standard Eclipse: You remove from the "bottom" (lowest cost/value?).
        // Actually, you usually fill the track from top (28) down to (2).
        // When you colonize, you take the "cheapest" cube? No, you take the one that exposes the next number.
        // Array: [2, 3, 4, 6... 28]
        // If I have 11 cubes, I leave '2' exposed.
        // If I have 0 cubes, I leave all exposed (Income 28).
        const countOnTrack = playerState.population[type];
        
        return (
            <div className={`flex-1 flex flex-col bg-slate-900/50 rounded-2xl border-2 ${color} p-4 relative overflow-hidden`}>
                {/* Header / Current Storage */}
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl border bg-slate-950 ${color}`}>
                            {icon}
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-widest opacity-70">{type}</div>
                            <div className="text-4xl font-black text-white leading-none flex items-baseline gap-2">
                                {playerState.resources.current[type]}
                                <span className={`text-sm font-bold opacity-50 ${playerState.resources.current[type] > 40 ? 'text-yellow-400 animate-pulse' : ''}`}>
                                    {playerState.resources.current[type] >= 40 ? '(40+)' : '/ 40'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Income Badge */}
                    <div className="flex flex-col items-end">
                        <div className="text-[10px] uppercase font-bold opacity-50">Income</div>
                        <div className={`text-3xl font-bold ${color.replace('border-', 'text-').replace('/30', '')}`}>
                            +{playerState.resources.income[type]}
                        </div>
                    </div>
                </div>

                {/* Storage Slider (Simple Visual) */}
                <div className="mb-8 relative h-4 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                        className={`absolute top-0 left-0 h-full transition-all duration-500 ${color.includes('pink') ? 'bg-pink-500' : color.includes('orange') ? 'bg-orange-500' : 'bg-yellow-500'}`}
                        style={{ width: `${Math.min(100, (playerState.resources.current[type] / 40) * 100)}%` }}
                    ></div>
                </div>

                {/* Population Track Grid */}
                <div className="flex-1 grid grid-cols-6 lg:grid-cols-12 gap-2 lg:gap-3">
                    {POPULATION_TRACK.map((val, idx) => {
                        // idx 0 is value '2'. idx 11 is value '28'.
                        // If countOnTrack is 12, all are covered.
                        // If countOnTrack is 11, idx 0 is exposed (2).
                        // If countOnTrack is 0, all are exposed.
                        
                        // We map from left (2) to right (28).
                        // We want the cubes to disappear from left to right as we colonize.
                        // So if we have 11 cubes, we keep indices 1..11. Index 0 is empty.
                        // So isCovered if index >= (totalSlots - countOnTrack)?
                        // Let's trace:
                        // Total 12. Count 12. All covered.
                        // Count 11. 1 removed. We want '2' (index 0) to be empty. '3'..28 covered.
                        // So indices 1 to 11 are covered.
                        // isCovered = idx >= (12 - 11) = 1? Yes.
                        // Count 0. isCovered = idx >= 12 (Never). Correct.
                        
                        const totalSlots = POPULATION_TRACK.length;
                        const revealedCount = totalSlots - countOnTrack; 
                        const isCovered = idx >= revealedCount; 
                        
                        return (
                            <div
                                key={idx}
                                className={`
                                    relative aspect-square rounded-lg border flex items-center justify-center
                                    transition-all duration-200 group
                                    ${isCovered 
                                        ? `bg-slate-800 border-slate-600 shadow-inner` 
                                        : `${color.replace('border-', 'bg-').replace('/30', '/10')} border-white/20`}
                                `}
                            >
                                <span className={`text-lg font-bold z-0 ${isCovered ? 'opacity-20' : 'opacity-100'}`}>{val}</span>
                                
                                {/* The Cube */}
                                {isCovered && (
                                    <div className={`
                                        absolute inset-1 rounded bg-gradient-to-br 
                                        shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-10
                                        ${type === 'money' ? 'from-yellow-400 to-yellow-700 border-yellow-300' : 
                                          type === 'science' ? 'from-pink-400 to-pink-700 border-pink-300' : 
                                          'from-orange-400 to-orange-700 border-orange-300'}
                                        border
                                    `}>
                                        <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/30"></div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Graveyard */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-50 flex items-center gap-2">
                        <Skull size={14} /> Graveyard
                    </span>
                    <div className="flex gap-2">
                        {Array.from({ length: Math.max(3, graveyards + 1) }).map((_, i) => (
                            <div key={i} className={`w-8 h-8 rounded border border-slate-700 bg-slate-950 flex items-center justify-center ${i < graveyards ? '' : 'opacity-30'}`}>
                                {i < graveyards && (
                                    <div className={`w-5 h-5 rounded bg-gradient-to-br ${type === 'money' ? 'from-yellow-500 to-yellow-800' : type === 'science' ? 'from-pink-500 to-pink-800' : 'from-orange-500 to-orange-800'} opacity-50 grayscale`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-[#0f172a] overflow-y-auto">
            {/* Top Bar */}
            <div className="flex-none p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700">
                        <LayoutDashboard size={24} className="text-white" />
                    </button>
                    <h1 className="text-3xl font-black text-white uppercase tracking-widest">Control Board</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 lg:p-10 flex flex-col gap-6">
                {renderTrack('money', 'border-yellow-500/30 text-yellow-500', <Coins size={28} className="text-yellow-400" />, playerState.population.graveyard.money)}
                {renderTrack('science', 'border-pink-500/30 text-pink-500', <FlaskConical size={28} className="text-pink-400" />, playerState.population.graveyard.science)}
                {renderTrack('materials', 'border-orange-500/30 text-orange-500', <Pickaxe size={28} className="text-orange-400" />, playerState.population.graveyard.materials)}
            </div>
        </div>
    );
};
