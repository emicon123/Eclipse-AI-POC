
import React, { useState, useMemo } from 'react';
import { ResearchBoard } from './components/tech/ResearchBoard';
import { GalaxyMap } from './components/map/GalaxyMap';
import { ControlBoard } from './components/game/ControlBoard';
import { RareTechModal } from './components/tech/RareTechModal';
import { StartScreen } from './components/views/StartScreen';
import { MainGameBoard } from './components/views/MainGameBoard';
import { UpgradeView } from './components/views/UpgradeView';
import { Blueprint, PlayerAction, SectorData, TechTile, DiscoveryReward, ShipPart, PlayerResources } from './types/index';
import { useGameEngine } from './hooks/useGameEngine';
import { useShipDesign } from './hooks/useShipDesign';
import { SHIP_PARTS } from './constants/index';
import { ChevronLeft } from 'lucide-react';

type ViewMode = 'START' | 'BOARD' | 'UPGRADE' | 'MAP' | 'RESEARCH' | 'CONTROL_BOARD';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('START');
  
  // --- CUSTOM HOOKS (Separation of Concerns) ---
  const { 
      selectedPlayerColors, activePlayerColor, activePlayer, sectors, playerStates, researchTray,
      setPlayerStates, togglePlayerColor, startGame, advanceTurn, 
      colonizeSector, commitResearch, updateControlBoardPopulation, 
      refundActionDisc, addSector, processResourceReward
  } = useGameEngine();

  const shipDesign = useShipDesign(activePlayer);

  // --- LOCAL UI STATE (View-specific) ---
  const [selectedRareTech, setSelectedRareTech] = useState<TechTile | null>(null);
  const [isExploring, setIsExploring] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  
  // --- COMPUTED ---
  const totalActionDiscs = activePlayer ? Object.values(activePlayer.discs.actions).reduce((a, b) => a + b, 0) : 0;
  const usedDiscs = activePlayer ? activePlayer.discs.map + totalActionDiscs : 0;
  const availableDiscs = activePlayer ? Math.max(0, activePlayer.discs.total - usedDiscs) : 0;

  const availableTechIds = useMemo(() => {
      if (!activePlayer) return [];
      return [...activePlayer.techs.military, ...activePlayer.techs.grid, ...activePlayer.techs.nano].map(t => t.id);
  }, [activePlayer]);

  // --- HANDLERS ---

  const handleStartGame = () => {
      startGame();
      setViewMode('BOARD');
  };

  const handleActionClick = (action: PlayerAction) => {
    if (!activePlayer) return;
    if (availableDiscs <= 0) {
        alert("No Influence Discs available!");
        return;
    }

    // Place Disc
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
    
    // Switch Context
    if (action === 'UPGRADE') {
        shipDesign.startUpgrade(activePlayer.blueprints, 2, null, 'Interceptor');
        setViewMode('UPGRADE');
    } else if (action === 'EXPLORE') {
        setIsExploring(true);
        setViewMode('MAP');
    } else if (action === 'RESEARCH') {
        setIsResearching(true);
        setViewMode('RESEARCH');
    }
  };

  // --- UPGRADE FLOW ---
  const handleCommitUpgrade = () => {
      const success = shipDesign.commitDraft(setPlayerStates, activePlayerColor);
      if (!success) {
          alert("Cannot finish upgrades: Invalid configuration.");
          return;
      }
      
      setViewMode('BOARD');
      if (!isExploring) advanceTurn(); 
      else {
          // If triggered via discovery, we return to map/finish exploration
          setIsExploring(false);
          advanceTurn();
      }
  };

  const handleCancelUpgrade = () => {
      shipDesign.cancelUpgrade();
      if (!isExploring) {
          refundActionDisc('UPGRADE');
      } else {
          setIsExploring(false);
          advanceTurn();
      }
      setViewMode('BOARD');
  };

  // --- RESEARCH FLOW ---
  const handleTechSelect = (tech: TechTile, category?: 'military' | 'grid' | 'nano') => {
      if (tech.category === 'RARE') {
          setSelectedRareTech(tech);
      } else {
          const success = commitResearch(tech, category || tech.category.toLowerCase() as any);
          if (success) {
              setIsResearching(false);
              advanceTurn();
              setViewMode('BOARD');
          }
      }
  };

  const handleRareTechConfirm = (category: 'military' | 'grid' | 'nano') => {
      if (selectedRareTech) {
          const success = commitResearch(selectedRareTech, category);
          if (success) {
              setSelectedRareTech(null);
              setIsResearching(false);
              advanceTurn();
              setViewMode('BOARD');
          }
      }
  };

  const handleCancelResearch = () => {
      if (isResearching) {
          refundActionDisc('RESEARCH');
          setIsResearching(false);
      }
      setViewMode('BOARD');
  };

  // --- EXPLORATION FLOW ---
  const handleCancelExplore = () => {
      if (isExploring) {
          refundActionDisc('EXPLORE');
          setIsExploring(false);
      }
      setViewMode('BOARD');
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
              shipDesign.startUpgrade(activePlayer.blueprints, 0, { ...foundPart, isRare: true }, 'Interceptor');
              setViewMode('UPGRADE');
          } else {
              handleExplorationComplete();
          }
      } else {
          processResourceReward(reward);
          handleExplorationComplete();
      }
  };

  // --- RENDER ---
  return (
    <div className="h-screen w-screen bg-[#0f172a] text-slate-200 font-sans overflow-hidden flex flex-col bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-[#020617]">
      <div className="h-1 flex-none bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>

      {viewMode === 'START' && (
          <StartScreen 
              selectedPlayerColors={selectedPlayerColors}
              onToggleColor={togglePlayerColor}
              onStartGame={handleStartGame}
          />
      )}

      {viewMode === 'BOARD' && activePlayer && (
        <MainGameBoard 
            activePlayer={activePlayer}
            activePlayerColor={activePlayerColor}
            onViewChange={setViewMode}
            onShipSelect={(type) => {
                shipDesign.startUpgrade(activePlayer.blueprints, 0, null, type);
                setViewMode('UPGRADE');
            }}
            onActionClick={handleActionClick}
            usedDiscs={usedDiscs}
            totalDiscs={activePlayer.discs.total}
        />
      )}

      {viewMode === 'MAP' && activePlayer && (
        <main className="flex-1 relative">
            <button onClick={handleCancelExplore} className="absolute top-4 left-4 z-50 bg-slate-900 p-2 rounded"><ChevronLeft/></button>
            <GalaxyMap 
                sectors={sectors} 
                isExploring={isExploring} 
                activePlayerColor={activePlayerColor} 
                onSectorAdded={addSector} 
                onClaimDiscovery={handleClaimDiscovery} 
                onExploreComplete={handleExplorationComplete} 
                availableDiscs={availableDiscs} 
                colonyShips={activePlayer.colonyShips} 
                onColonize={colonizeSector} 
            />
        </main>
      )}

      {viewMode === 'RESEARCH' && activePlayer && (
          <main className="flex-1 relative z-50 p-6">
               <ResearchBoard onClose={handleCancelResearch} playerColor={activePlayerColor} availableTechs={researchTray} onTechSelect={handleTechSelect} />
          </main>
      )}

      {viewMode === 'CONTROL_BOARD' && activePlayer && (
          <main className="flex-1 relative z-50">
              <ControlBoard 
                playerState={activePlayer} 
                onUpdateResource={(type, val) => setPlayerStates(prev => ({...prev, [activePlayerColor]: {...prev[activePlayerColor], resources: {...prev[activePlayerColor].resources, current: {...prev[activePlayerColor].resources.current, [type]: val}}}}))}
                onUpdatePopulation={updateControlBoardPopulation} 
                onClose={() => setViewMode('BOARD')} 
              />
          </main>
      )}

      {viewMode === 'UPGRADE' && activePlayer && shipDesign.draftBlueprints && (
          <UpgradeView 
              displayedBlueprint={shipDesign.displayedBlueprint}
              currentStats={shipDesign.currentStats}
              activePlayerColor={activePlayerColor}
              activeBlueprintType={shipDesign.activeBlueprintType}
              availableTechIds={availableTechIds}
              upgradeActivations={shipDesign.upgradeActivations}
              activeDiscoveryPart={shipDesign.activeDiscoveryPart}
              onBlueprintUpdate={shipDesign.updateBlueprint}
              onCancel={handleCancelUpgrade}
              onCommit={handleCommitUpgrade}
              onTypeSelect={shipDesign.setActiveBlueprintType}
          />
      )}

      {selectedRareTech && activePlayer && (
          <RareTechModal 
              tech={selectedRareTech}
              player={activePlayer}
              onSelect={handleRareTechConfirm}
              onCancel={() => setSelectedRareTech(null)}
          />
      )}
    </div>
  );
}
