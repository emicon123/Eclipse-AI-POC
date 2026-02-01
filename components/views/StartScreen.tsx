
import React from 'react';
import { Users, Check, Play } from 'lucide-react';

interface StartScreenProps {
    selectedPlayerColors: string[];
    onToggleColor: (color: string) => void;
    onStartGame: () => void;
}

const PLAYER_COLORS = ['white', 'black', 'green', 'blue', 'yellow', 'red'];

const COLOR_BUTTON_STYLES: Record<string, string> = {
    white: 'bg-slate-200 text-slate-900 border-white',
    black: 'bg-slate-950 text-slate-200 border-slate-700',
    green: 'bg-green-600 text-white border-green-400',
    blue: 'bg-blue-600 text-white border-blue-400',
    yellow: 'bg-yellow-500 text-black border-yellow-300',
    red: 'bg-red-600 text-white border-red-400'
};

export const StartScreen: React.FC<StartScreenProps> = ({ selectedPlayerColors, onToggleColor, onStartGame }) => {
    return (
        <main className="flex-1 flex flex-col items-center justify-center p-6 relative gap-10">
            <div className="text-center space-y-2">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">ECLIPSE</h1>
                <p className="text-slate-400 text-lg tracking-widest uppercase">Second Dawn Companion</p>
            </div>
            <div className="flex flex-col items-center gap-6 bg-slate-900/50 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-sm animate-in slide-in-from-bottom-5 fade-in duration-500">
                <h3 className="text-slate-300 font-bold uppercase tracking-wider text-sm flex items-center gap-2"><Users size={16} /> Select Factions</h3>
                <div className="flex gap-4">
                    {PLAYER_COLORS.map(color => (
                        <button 
                          key={color} 
                          onClick={() => onToggleColor(color)} 
                          className={`
                              w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 relative border-2
                              ${COLOR_BUTTON_STYLES[color]}
                              ${selectedPlayerColors.includes(color) ? 'scale-110 shadow-[0_0_20px_currentColor]' : 'opacity-40 hover:opacity-100 hover:scale-105 border-transparent'}
                          `}
                        >
                            {selectedPlayerColors.includes(color) && <Check size={28} strokeWidth={4} className="drop-shadow-md" />}
                        </button>
                    ))}
                </div>
            </div>
            <button onClick={onStartGame} disabled={selectedPlayerColors.length < 1} className="px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl font-black text-2xl tracking-wide shadow-xl flex items-center gap-3 hover:scale-105 transition-transform"><Play fill="currentColor" /> INITIALIZE GAME</button>
        </main>
    );
};
