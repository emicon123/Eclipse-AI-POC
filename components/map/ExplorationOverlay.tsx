
import React from 'react';
import { Skull, Rocket, Search, Check, X, CircleDot, RotateCw, Gem, Trophy, Lock, Unplug, RefreshCw, Coins, FlaskConical, Pickaxe, Crosshair, Zap } from 'lucide-react';
import { SectorData, PlayerState } from '../../types/index';

interface ExplorationOverlayProps {
    pendingSector: SectorData;
    currentDiscovery: any;
    showInfluencePrompt: boolean;
    showDiscoveryPrompt: boolean;
    showColonizePrompt: boolean;
    isColonizing: boolean;
    isConnected: boolean;
    isPlacementValid: boolean;
    availableDiscs: number;
    colonyShips: PlayerState['colonyShips'];
    
    // Handlers
    onRotate: () => void;
    onDiscard: () => void;
    onKeep: () => void;
    onInfluence: (bool: boolean) => void;
    onColonize: (bool: boolean) => void;
    onFinishColonizing: () => void;
    onDiscovery: (bool: boolean) => void;
}

const getDiscoveryIcon = (currentDiscovery: any) => {
      if(!currentDiscovery) return <Gem size={20} />;
      switch(currentDiscovery.id) {
          case 'money_3': return <Coins size={24} className="text-yellow-400" />;
          case 'science_3': return <FlaskConical size={24} className="text-pink-400" />;
          case 'materials_3': return <Pickaxe size={24} className="text-orange-400" />;
          case 'ion_turret': return <Crosshair size={24} className="text-yellow-500" />;
          case 'hyper_grid': return <Zap size={24} className="text-pink-500" />;
          default: return <RefreshCw size={24} />;
      }
};

export const ExplorationOverlay: React.FC<ExplorationOverlayProps> = ({
    pendingSector,
    currentDiscovery,
    showInfluencePrompt,
    showDiscoveryPrompt,
    showColonizePrompt,
    isColonizing,
    isConnected,
    isPlacementValid,
    availableDiscs,
    colonyShips,
    onRotate,
    onDiscard,
    onKeep,
    onInfluence,
    onColonize,
    onFinishColonizing,
    onDiscovery
}) => {
    return (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900/95 border-2 border-orange-500 rounded-2xl p-6 shadow-2xl backdrop-blur-xl z-50 flex flex-col items-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-300 w-full max-w-lg">
                
                {/* STATE 1: KEEP / DISCARD + ROTATION (Only shows if NOT asking for Influence/Discovery yet) */}
                {!showInfluencePrompt && !showDiscoveryPrompt && !showColonizePrompt && !isColonizing && (
                    <>
                        <div className="text-center w-full">
                            <h3 className="text-xl font-bold text-orange-400 uppercase tracking-widest flex items-center justify-center gap-2">
                                <Search size={20}/> New Sector Discovered
                            </h3>
                            <div className="flex items-center justify-between bg-slate-800/50 p-2 rounded-lg mt-2">
                                <div className="text-sm text-slate-400 font-mono">ID: {pendingSector.id}</div>
                                {pendingSector.ancients > 0 && <div className="text-xs font-bold text-pink-500 flex items-center gap-1"><Skull size={12}/> HOSTILES DETECTED</div>}
                            </div>
                        </div>

                        {/* Rotation Control */}
                        <div className="w-full flex items-center gap-2">
                            <button 
                                onClick={onRotate}
                                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl flex items-center justify-center gap-2 font-bold text-white transition-all"
                            >
                                <RotateCw size={20} /> ROTATE
                            </button>
                            {/* Validation Status */}
                            <div className={`p-3 rounded-xl border flex items-center justify-center ${isPlacementValid ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400'}`}>
                                {isPlacementValid ? <Check size={20} /> : <Lock size={20} />}
                            </div>
                        </div>

                        <div className="flex gap-4 w-full">
                            <button onClick={onDiscard} className="flex-1 bg-red-900/50 hover:bg-red-900/80 border border-red-500/50 text-red-200 py-3 rounded-xl flex items-center justify-center gap-2 font-bold group">
                                <X size={20} className="group-hover:scale-110" /> DISCARD
                            </button>
                            <button 
                                onClick={onKeep} 
                                disabled={!isPlacementValid}
                                className="flex-1 bg-emerald-900/50 hover:bg-emerald-900/80 border border-emerald-500/50 text-emerald-200 py-3 rounded-xl flex items-center justify-center gap-2 font-bold group disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
                            >
                                <Check size={20} className="group-hover:scale-110" /> PLACE
                            </button>
                        </div>
                        {!isPlacementValid && (
                            <div className="text-xs text-red-400 font-bold bg-red-900/20 p-2 rounded">
                                Wormhole connection invalid. Rotate sector to align with source.
                            </div>
                        )}
                    </>
                )}

                {/* STATE 2: INFLUENCE */}
                {showInfluencePrompt && (
                    <>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-blue-400 uppercase tracking-widest">Influence Sector?</h3>
                            <div className="flex items-center justify-center gap-2 mb-2 mt-2">
                              {isConnected ? (
                                  <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wider bg-green-900/30 px-3 py-1 rounded-full border border-green-600/50">
                                      <Check size={14} /> Wormhole Connected
                                  </div>
                              ) : (
                                  <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider bg-red-900/30 px-3 py-1 rounded-full border border-red-600/50">
                                      <Unplug size={14} /> Disconnected
                                  </div>
                              )}
                            </div>
                            <div className="text-sm text-slate-400 font-mono mt-1">Available Discs: {availableDiscs}</div>
                        </div>

                        <div className="flex gap-4 w-full">
                            <button onClick={() => onInfluence(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 py-3 rounded-xl flex items-center justify-center gap-2 font-bold">
                                <CircleDot size={20} className="text-slate-500" /> NEUTRAL
                            </button>
                            <button 
                                onClick={() => onInfluence(true)}
                                disabled={availableDiscs <= 0 || !isConnected}
                                className="flex-1 bg-blue-900/50 hover:bg-blue-900/80 border border-blue-500/50 text-blue-200 py-3 rounded-xl flex items-center justify-center gap-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <CircleDot size={20} /> INFLUENCE
                            </button>
                        </div>
                    </>
                )}

                {/* STATE 3: COLONIZATION PROMPT */}
                {showColonizePrompt && (
                    <>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-emerald-400 uppercase tracking-widest">Deploy Colony Ships?</h3>
                            <div className="text-sm text-slate-400 font-mono mt-2">
                                Available Ships: {colonyShips.total - colonyShips.used}
                            </div>
                        </div>

                        <div className="flex gap-4 w-full">
                            <button onClick={() => onColonize(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 py-3 rounded-xl flex items-center justify-center gap-2 font-bold">
                                <X size={20} className="text-slate-500" /> SKIP
                            </button>
                            <button 
                                onClick={() => onColonize(true)}
                                disabled={colonyShips.total - colonyShips.used <= 0}
                                className="flex-1 bg-emerald-900/50 hover:bg-emerald-900/80 border border-emerald-500/50 text-emerald-200 py-3 rounded-xl flex items-center justify-center gap-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Rocket size={20} /> COLONIZE
                            </button>
                        </div>
                    </>
                )}

                {/* STATE 3.5: ACTIVE COLONIZATION */}
                {isColonizing && pendingSector && (
                    <>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-emerald-400 uppercase tracking-widest animate-pulse">Colonization In Progress</h3>
                            <p className="text-sm text-slate-400 mt-1">Select population slots on the map.</p>
                        </div>
                        <button 
                            onClick={onFinishColonizing}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 border border-emerald-400 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-emerald-500/20"
                        >
                            <Check size={20} /> FINISH COLONIZING
                        </button>
                    </>
                )}

                {/* STATE 4: DISCOVERY REWARD */}
                {showDiscoveryPrompt && currentDiscovery && (
                    <>
                         <div className="text-center w-full">
                            <h3 className="text-xl font-bold text-yellow-400 uppercase tracking-widest flex items-center justify-center gap-2">
                                <Gem size={20}/> Ancient Technology Found
                            </h3>
                            <p className="text-sm text-slate-400 mt-1">Choose your discovery reward:</p>
                        </div>
                        <div className="flex gap-4 w-full">
                             <button onClick={() => onDiscovery(true)} className="flex-1 bg-yellow-900/20 hover:bg-yellow-900/40 border-2 border-yellow-500/50 text-yellow-100 py-6 rounded-xl flex flex-col items-center justify-center gap-2 font-bold transition-all group">
                                <div className="p-3 bg-yellow-500/20 rounded-full border border-yellow-500/50 group-hover:scale-110 transition-transform">
                                    {getDiscoveryIcon(currentDiscovery)}
                                </div>
                                <div className="text-sm uppercase tracking-wider">{currentDiscovery.label}</div>
                                <div className="text-[10px] text-yellow-200/60 font-normal px-2">{currentDiscovery.description}</div>
                            </button>
                            <button onClick={() => onDiscovery(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-500 text-white py-6 rounded-xl flex flex-col items-center justify-center gap-2 font-bold">
                                <Trophy size={28} className="text-slate-400" />
                                <span>2 VP</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
    )
}
