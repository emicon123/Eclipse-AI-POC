
import React, { useState, useMemo } from 'react';
import { ShipDesigner } from './components/ship/ShipDesigner';
import { ShipSummaryCard } from './components/ship/ShipSummaryCard';
import { InfluenceTrack } from './components/game/InfluenceTrack';
import { ActionPanel } from './components/game/ActionPanel';
import { TechTray } from './components/tech/TechTray';
import { ResearchBoard } from './components/tech/ResearchBoard';
import { GalaxyMap } from './components/map/GalaxyMap';
import { ControlBoard } from './components/game/ControlBoard';
import { INITIAL_BLUEPRINTS } from './constants/index'; 
import { Blueprint, PlayerAction, SectorData, PlayerState, TechTile, DiscoveryReward, ShipPart, PlayerResources, ResourceType } from './types/index';
import { calculateStats } from './utils/gameLogic';
import { useGameEngine } from './hooks/useGameEngine';
import { SHIP_PARTS } from './constants/index';
import { Rocket, BrainCircuit, ChevronLeft, Coins, FlaskConical, Pickaxe, Map as MapIcon, Users, Play, Check, Cpu, User, LayoutDashboard, Zap } from 'lucide-react';
import { getDiscStyles } from './utils/theme';

type ViewMode = 'START' | 'BOARD' | 'UPGRADE' | 'FACTION_AI' | 'MAP' | 'RESEARCH' | 'CONTROL_BOARD';

const PLAYER_COLORS = ['white', 'black', 'green', 'blue', 'yellow', 'red'];

const COLOR_BUTTON_STYLES: Record<string, string> = {
    white: 'bg-slate-200 text-slate-900 border-white',
    black: 'bg-slate-950 text-slate-200 border-slate-700',
    green: 'bg-green-600 text-white border-green-400',
    blue: 'bg-blue-600 text-white border-blue-400',
    yellow: 'bg-yellow-500 text-black border-yellow-300',
    red: 'bg-red-600 text-white border-red-400'
};

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('START');
  
  // Use Custom Hook for Logic
  const { 
      selectedPlayerColors, activePlayerColor, activePlayer, sectors, playerStates, researchTray,
      setSectors, setPlayerStates, setResearchTray, togglePlayerColor, startGame, advanceTurn, 
      colonizeSector, commitResearch, updateControlBoardPopulation
  } = useGameEngine();

  // Local UI State
  const [selectedRareTech, setSelectedRareTech] = useState<TechTile | null>(null);
  const [draftBlueprints, setDraftBlueprints] = useState<Record<string, Blueprint> | null>(null);
  const [upgradeActivations, setUpgradeActivations] = useState(0);
  const [activeDiscoveryPart, setActiveDiscoveryPart] = useState<ShipPart | null>(null);
  const [activeBlueprintType, setActiveBlueprintType] = useState<keyof typeof INITIAL_BLUEPRINTS>('Interceptor');
  const [isExploring, setIsExploring] = useState(false);
  
  // Computed
  const totalActionDiscs = activePlayer ? Object.values(activePlayer.discs.actions).reduce((a, b) => a + b, 0) : 0;
  const usedDiscs = activePlayer ? activePlayer.discs.map + totalActionDiscs : 0;
  const availableDiscs = activePlayer ? Math.max(0, activePlayer.discs.total - usedDiscs) : 0;

  const displayedBlueprint = (viewMode === 'UPGRADE' && draftBlueprints)
     ? draftBlueprints[activeBlueprintType] 
     : (activePlayer ? activePlayer.blueprints[activeBlueprintType] : INITIAL_BLUEPRINTS['Interceptor']);

  const currentStats = useMemo(() => calculateStats(displayedBlueprint), [displayedBlueprint]);

  const availableTechIds = useMemo(() => {
      if (!activePlayer) return [];
      const allTechs = [...activePlayer.techs.military, ...activePlayer.techs.grid, ...activePlayer.techs.nano];
      return allTechs.map(t => t.id);
  }, [activePlayer]);

  // --- HANDLERS ---

  const handleStartGame = () => {
      startGame();
      setViewMode('BOARD');
  };

  const handleBlueprintUpdate = (newBp: Blueprint, cost: number) => {
      setDraftBlueprints(prev => {
          if (!prev) return null;
          return { ...prev, [newBp.shipType]: newBp };
      });
      setUpgradeActivations(prev => prev - cost);
  };

  const handleCommitUpgrade = () => {
      if (!draftBlueprints) return;
      
      let isValid = true;
      Object.values(draftBlueprints).forEach(bp => {
          if (!calculateStats(bp).isValid) isValid = false;
      });

      if (!isValid) {
          alert("Cannot finish upgrades: One or more ships have negative power balance or invalid configurations.");
          return;
      }
      
      setPlayerStates(prev => ({
        ...prev,
        [activePlayerColor]: {
            ...prev[activePlayerColor],
            blueprints: { ...prev[activePlayerColor].blueprints, ...draftBlueprints }
        }
      }));
      setDraftBlueprints(null); 
      setActiveDiscoveryPart(null); 
      setViewMode('BOARD');
      // Only advance turn if we were doing a standard upgrade action, not part of discovery
      // Assuming discovery integration handles its own flow, but Upgrade Action usually ends turn.
      // However, if we came here from Discovery, we usually don't consume the "Upgrade Action" disc, 
      // but we do finish the "Explore Action".
      if (!isExploring) {
          advanceTurn();
      } else {
          // If we were exploring and equipped a part, finish the exploration flow now.
          setIsExploring(false);
          advanceTurn();
      }
  };

  const handleCancelUpgrade = () => {
      setDraftBlueprints(null); 
      setActiveDiscoveryPart(null);
      
      // If we are cancelling a normal upgrade, revert discs
      if (!isExploring) {
          setPlayerStates(prev => ({
            ...prev,
            [activePlayerColor]: {
                ...prev[activePlayerColor],
                discs: {
                    ...prev[activePlayerColor].discs,
                    actions: { ...prev[activePlayerColor].discs.actions, UPGRADE: Math.max(0, prev[activePlayerColor].discs.actions.UPGRADE - 1) }
                }
            }
          }));
      } else {
          // If cancelling a discovery part equip, we just go back to board/finish explore
          setIsExploring(false);
          advanceTurn();
      }
      setViewMode('BOARD');
  };

  const handleActionClick = (action: PlayerAction) => {
    if (!activePlayer) return;
    if (availableDiscs > 0) {
        setPlayerStates(prev => ({
            ...prev,
            [activePlayerColor]: {
                ...prev[activePlayerColor],
                discs: {
                    ...prev[activePlayerColor].discs,
                    actions: { ...prev[activePlayerColor].discs.actions, [action]: prev[activePlayerColor].discs.actions[action] + 1 }
                }
            }
        }));
        
        if (action === 'UPGRADE') {
            setDraftBlueprints(JSON.parse(JSON.stringify(activePlayer.blueprints)));
            setUpgradeActivations(2); 
            setViewMode('UPGRADE');
        } else if (action === 'EXPLORE') {
            setViewMode('MAP');
            setIsExploring(true);
        } else if (action === 'RESEARCH') {
            setViewMode('RESEARCH');
        }
    } else {
        alert("No Influence Discs available!");
    }
  };

  const handleRareTechSelect = (category: 'military' | 'grid' | 'nano') => {
      if (selectedRareTech) {
          const success = commitResearch(selectedRareTech, category);
          if (success) {
              setSelectedRareTech(null);
              advanceTurn();
              setViewMode('BOARD');
          }
      }
  };

  const handleResearchTech = (tech: TechTile) => {
      if (tech.category === 'RARE') {
          setSelectedRareTech(tech);
      } else {
          const success = commitResearch(tech, tech.category.toLowerCase() as any);
          if (success) {
              advanceTurn();
              setViewMode('BOARD');
          }
      }
  };

  const handleSectorAdded = (newSector: SectorData, withInfluence: boolean) => {
      setSectors(prev => {
          const exists = prev.findIndex(s => s.id === newSector.id);
          const updatedSector = { ...newSector };
          
          if (withInfluence) {
              updatedSector.playerColor = activePlayerColor;
          }

          if (exists !== -1) {
              const newList = [...prev];
              newList[exists] = updatedSector;
              return newList;
          } else {
              return [...prev, updatedSector];
          }
      });

      if (withInfluence) {
          setPlayerStates(prev => ({
            ...prev,
            [activePlayerColor]: {
                ...prev[activePlayerColor],
                discs: { ...prev[activePlayerColor].discs, map: prev[activePlayerColor].discs.map + 1 }
            }
          }));
      }
      
      // Note: We do NOT finish exploration here anymore. 
      // GalaxyMap controls the flow (Place -> Influence -> Discovery -> Finish).
  };

  const handleExplorationComplete = () => {
      setIsExploring(false);
      advanceTurn();
      setViewMode('BOARD');
  };

  const handleClaimDiscovery = (reward: DiscoveryReward) => {
      if (reward.type === 'PART') {
          const foundPart = SHIP_PARTS.find(p => p.id === reward.id);
          if (foundPart) {
              setActiveDiscoveryPart({ ...foundPart, isRare: true });
              setDraftBlueprints(JSON.parse(JSON.stringify(activePlayer.blueprints)));
              
              // CRITICAL: When discovering a part, it's not a normal Upgrade action. 
              // You get 0 "activations" but can place the specific part for free.
              setUpgradeActivations(0); 
              
              setViewMode('UPGRADE');
              // We do NOT set isExploring(false) here, we use it to track that we are in a special upgrade mode
          } else {
              handleExplorationComplete();
          }
      } else {
          // Resource Reward Logic
          if (reward.type === 'RESOURCE') {
              const [resType, amount] = reward.id.split('_'); 
              const numAmount = parseInt(amount);
              setPlayerStates(prev => ({
                  ...prev,
                  [activePlayerColor]: {
                      ...prev[activePlayerColor],
                      resources: {
                          ...prev[activePlayerColor].resources,
                          current: {
                              ...prev[activePlayerColor].resources.current,
                              [resType]: prev[activePlayerColor].resources.current[resType as keyof typeof prev[typeof activePlayerColor]['resources']['current']] + numAmount
                          }
                      }
                  }
              }));
          }
          handleExplorationComplete();
      }
  };

  const handleControlBoardUpdate = {
      resource: (type: keyof PlayerResources, value: number) => {
          setPlayerStates(prev => ({
              ...prev,
              [activePlayerColor]: {
                  ...prev[activePlayerColor],
                  resources: {
                      ...prev[activePlayerColor].resources,
                      current: { ...prev[activePlayerColor].resources.current, [type]: value }
                  }
              }
          }));
      },
      population: updateControlBoardPopulation
  };

  return (
    <div className="h-screen w-screen bg-[#0f172a] text-slate-200 font-sans overflow-hidden flex flex-col bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-[#020617]">
      <div className="h-1 flex-none bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>

      {viewMode === 'START' && (
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
                            onClick={() => togglePlayerColor(color)} 
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
              <button onClick={handleStartGame} disabled={selectedPlayerColors.length < 1} className="px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl font-black text-2xl tracking-wide shadow-xl flex items-center gap-3 hover:scale-105 transition-transform"><Play fill="currentColor" /> INITIALIZE GAME</button>
          </main>
      )}

      {/* RARE TECH MODAL - Fixed Z-Index and interaction */}
      {selectedRareTech && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 p-8 rounded-2xl border-2 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.5)] max-w-lg w-full">
                  <h3 className="text-2xl font-bold mb-2 text-white">{selectedRareTech.name}</h3>
                  <p className="text-slate-400 mb-6">{selectedRareTech.description}</p>
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Select Slot Category:</p>
                  <div className="grid grid-cols-3 gap-3">
                    <button onClick={() => handleRareTechSelect('military')} className="p-4 bg-pink-900/30 border border-pink-500 hover:bg-pink-500 hover:text-white text-pink-300 rounded-xl font-bold transition-all">Military</button>
                    <button onClick={() => handleRareTechSelect('grid')} className="p-4 bg-green-900/30 border border-green-500 hover:bg-green-500 hover:text-white text-green-300 rounded-xl font-bold transition-all">Grid</button>
                    <button onClick={() => handleRareTechSelect('nano')} className="p-4 bg-yellow-900/30 border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-300 rounded-xl font-bold transition-all">Nano</button>
                  </div>
                  <button onClick={() => setSelectedRareTech(null)} className="w-full mt-6 py-3 text-slate-500 font-bold hover:text-white">Cancel</button>
              </div>
          </div>
      )}

      {viewMode === 'BOARD' && activePlayer && (
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
                   <button onClick={() => setViewMode('CONTROL_BOARD')} className="flex items-center gap-2 px-4 py-2 bg-slate-500/10 hover:bg-slate-500/20 border border-slate-500/50 text-slate-300 rounded-xl font-bold"><LayoutDashboard size={18} /> BOARD</button>
                   <button onClick={() => setViewMode('MAP')} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-xl font-bold"><MapIcon size={18} /> MAP</button>
                   <button onClick={() => setViewMode('RESEARCH')} className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/50 text-pink-400 rounded-xl font-bold"><Cpu size={18} /> TECH</button>
               </div>
          </header>
          <section className="h-[25vh]">
              <div className="flex-1 grid grid-cols-4 gap-4 h-full">
                  {(['Interceptor', 'Cruiser', 'Dreadnought', 'Starbase'] as const).map(type => (
                      <ShipSummaryCard key={type} blueprint={activePlayer.blueprints[type]} stats={calculateStats(activePlayer.blueprints[type])} playerColor={activePlayerColor} onClick={() => { setActiveBlueprintType(type); setViewMode('UPGRADE'); setUpgradeActivations(0); }} />
                  ))}
              </div>
          </section>
          <section className="flex-1"><TechTray playerTechs={activePlayer.techs} /></section>
          <section className="flex-none grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
              <div className="lg:col-span-5 relative"><ActionPanel onActionClick={handleActionClick} actionCounts={activePlayer.discs.actions} playerColor={activePlayerColor} /></div>
              <div className="lg:col-span-7 bg-slate-950/40 p-4 rounded-xl border border-slate-800"><InfluenceTrack usedDiscs={usedDiscs} totalDiscs={activePlayer.discs.total} onDiscChange={() => {}} playerColor={activePlayerColor} /></div>
          </section>
        </main>
      )}

      {viewMode === 'MAP' && activePlayer && (
        <main className="flex-1 relative">
            <button onClick={() => setViewMode('BOARD')} className="absolute top-4 left-4 z-50 bg-slate-900 p-2 rounded"><ChevronLeft/></button>
            <GalaxyMap sectors={sectors} isExploring={isExploring} activePlayerColor={activePlayerColor} onSectorAdded={handleSectorAdded} onClaimDiscovery={handleClaimDiscovery} onExploreComplete={handleExplorationComplete} availableDiscs={availableDiscs} colonyShips={activePlayer.colonyShips} onColonize={colonizeSector} />
        </main>
      )}

      {viewMode === 'RESEARCH' && activePlayer && (
          <main className="flex-1 relative z-50 p-6">
               <ResearchBoard onClose={() => setViewMode('BOARD')} playerColor={activePlayerColor} availableTechs={researchTray} onTechSelect={handleResearchTech} />
          </main>
      )}

      {viewMode === 'CONTROL_BOARD' && activePlayer && (
          <main className="flex-1 relative z-50">
              <ControlBoard playerState={activePlayer} onUpdateResource={handleControlBoardUpdate.resource} onUpdatePopulation={handleControlBoardUpdate.population} onClose={() => setViewMode('BOARD')} />
          </main>
      )}

      {viewMode === 'UPGRADE' && activePlayer && (
           <main className="flex-1 flex flex-col p-6 lg:p-10 overflow-y-auto">
              <div className="flex items-center justify-between mb-4 flex-none">
                  <div className="flex items-center gap-6"><button onClick={handleCancelUpgrade} className="p-3 bg-slate-800 rounded-full"><ChevronLeft /></button><h2 className="text-4xl font-bold">Ship Design</h2></div>
                  <div className="flex gap-4">
                      {!currentStats.isValid && <div className="px-4 py-2 rounded-xl border bg-red-500/20 border-red-500 text-red-400 flex items-center gap-2 font-bold animate-pulse"><Zap size={20} /><span className="uppercase">Power Negative</span></div>}
                      <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${upgradeActivations > 0 ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400'}`}><span className="text-sm font-bold uppercase tracking-wider">Activations Left:</span><span className="text-xl font-black">{upgradeActivations}</span></div>
                      <button onClick={handleCancelUpgrade} className="px-6 py-2 rounded-xl border border-slate-600 hover:bg-slate-700 text-slate-300 font-bold transition-all">Cancel Changes</button>
                      <button onClick={handleCommitUpgrade} disabled={!currentStats.isValid} className="px-8 py-2 rounded-xl border font-bold flex items-center gap-2 transition-all bg-blue-600 border-blue-500 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"><Check size={20} /> Finish Upgrades</button>
                  </div>
              </div>
              <div className="flex gap-4 mb-4 flex-none">{(['Interceptor', 'Cruiser', 'Dreadnought', 'Starbase'] as const).map((type) => (<button key={type} onClick={() => setActiveBlueprintType(type)} className={`px-8 py-4 rounded-2xl border-2 font-bold text-xl uppercase transition-colors ${activeBlueprintType === type ? 'bg-slate-800 border-white text-white' : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'}`}>{type}</button>))}</div>
              <div className="flex-1 grid lg:grid-cols-3 gap-8 min-h-0">
                   <div className="lg:col-span-2 flex flex-col min-h-0"><ShipDesigner blueprint={displayedBlueprint} onUpdate={handleBlueprintUpdate} stats={currentStats} playerColor={activePlayerColor} availableTechIds={availableTechIds} activationsRemaining={upgradeActivations} pendingPart={activeDiscoveryPart} /></div>
                   <div className="space-y-6 flex-none"><div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700"><h3 className="font-bold flex gap-2 items-center"><BrainCircuit className="text-blue-400"/> AI Assistant</h3><p className="text-sm text-slate-400 mt-2">Analyze your ship's combat efficiency against current threats.</p></div></div>
              </div>
           </main>
      )}
    </div>
  );
}
