
import React from 'react';
import { User, Coins, FlaskConical, Pickaxe, LayoutDashboard, Map as MapIcon, Cpu } from 'lucide-react';
import { PlayerState, PlayerAction, Blueprint, ShipStats } from '../../types/index';
import { getDiscStyles } from '../../utils/theme';
import { calculateStats } from '../../utils/gameLogic';
import { ShipSummaryCard } from '../ship/ShipSummaryCard';
import { TechTray } from '../tech/TechTray';
import { ActionPanel } from '../game/ActionPanel';
import { InfluenceTrack } from '../game/InfluenceTrack';

interface MainGameBoardProps {
    activePlayer: PlayerState;
    activePlayerColor: string;
    onViewChange: (mode: 'CONTROL_BOARD' | 'MAP' | 'RESEARCH' | 'UPGRADE') => void;
    onShipSelect: (type: Blueprint['shipType']) => void;
    onActionClick: (action: PlayerAction) => void;
    usedDiscs: number;
    totalDiscs: number;
}

export const MainGameBoard: React.FC<MainGameBoardProps> = ({ 
    activePlayer, 
    activePlayerColor, 
    onViewChange, 
    onShipSelect, 
    onActionClick,
    usedDiscs,
    totalDiscs
}) => {
    return (
        <main className="flex-1 flex flex-col p-4 lg:p-6 gap-4">
          <header className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700 flex flex-col md:flex-row justify-between items-center backdrop-blur-md shadow-xl gap-4">
               <div className="flex items-center gap-3">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${getDiscStyles(activePlayerColor)} shadow-lg`}>
                       <User className="text-white" size={24} />
                   </div>
                   <div>
                       <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Commander</div>
                       <div className="text-xl font-black capitalize text-white">{activePlayerColor}</div>
                   </div>
               </div>
               <div className="flex items-center gap-6 bg-slate-950/50 p-2 px-6 rounded-full border border-slate-800">
                   <div className="flex items-center gap-2"><div className="p-1.5 rounded-full bg-yellow-500/10 border border-yellow-500 text-yellow-400"><Coins size={16} /></div><div className="flex flex-col leading-none"><span className="text-lg font-bold text-white">{activePlayer.resources.current.money}</span><span className="text-[10px] text-yellow-400 font-bold">+{activePlayer.resources.income.money}</span></div></div>
                   <div className="w-px h-8 bg-slate-800"></div>
                   <div className="flex items-center gap-2"><div className="p-1.5 rounded-full bg-pink-500/10 border border-pink-500 text-pink-400"><FlaskConical size={16} /></div><div className="flex flex-col leading-none"><span className="text-lg font-bold text-white">{activePlayer.resources.current.science}</span><span className="text-[10px] text-pink-400 font-bold">+{activePlayer.resources.income.science}</span></div></div>
                   <div className="w-px h-8 bg-slate-800"></div>
                   <div className="flex items-center gap-2"><div className="p-1.5 rounded-full bg-orange-950/40 border border-orange-800 text-orange-400"><Pickaxe size={16} /></div><div className="flex flex-col leading-none"><span className="text-lg font-bold text-white">{activePlayer.resources.current.materials}</span><span className="text-[10px] text-orange-400 font-bold">+{activePlayer.resources.income.materials}</span></div></div>
               </div>
               <div className="flex gap-3">
                   <button onClick={() => onViewChange('CONTROL_BOARD')} className="flex items-center gap-2 px-4 py-2 bg-slate-500/10 hover:bg-slate-500/20 border border-slate-500/50 text-slate-300 rounded-xl font-bold"><LayoutDashboard size={18} /> BOARD</button>
                   <button onClick={() => onViewChange('MAP')} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-xl font-bold"><MapIcon size={18} /> MAP</button>
                   <button onClick={() => onViewChange('RESEARCH')} className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/50 text-pink-400 rounded-xl font-bold"><Cpu size={18} /> TECH</button>
               </div>
          </header>
          <section className="h-[25vh]">
              <div className="flex-1 grid grid-cols-4 gap-4 h-full">
                  {(['Interceptor', 'Cruiser', 'Dreadnought', 'Starbase'] as const).map(type => (
                      <ShipSummaryCard 
                          key={type} 
                          blueprint={activePlayer.blueprints[type]} 
                          stats={calculateStats(activePlayer.blueprints[type])} 
                          playerColor={activePlayerColor} 
                          onClick={() => { onShipSelect(type); }} 
                      />
                  ))}
              </div>
          </section>
          <section className="flex-1"><TechTray playerTechs={activePlayer.techs} /></section>
          <section className="flex-none grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
              <div className="lg:col-span-5 relative"><ActionPanel onActionClick={onActionClick} actionCounts={activePlayer.discs.actions} playerColor={activePlayerColor} /></div>
              <div className="lg:col-span-7 bg-slate-950/40 p-4 rounded-xl border border-slate-800"><InfluenceTrack usedDiscs={usedDiscs} totalDiscs={totalDiscs} onDiscChange={() => {}} playerColor={activePlayerColor} /></div>
          </section>
        </main>
    );
}
