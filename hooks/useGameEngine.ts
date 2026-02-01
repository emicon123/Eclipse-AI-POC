
import { useState } from 'react';
import { 
    PlayerState, SectorData, TechTile, DiscoveryReward, PlayerResources, PlayerAction, ResourceType 
} from '../types/index';
import { TECH_SLOT_DISCOUNTS, POPULATION_TRACK } from '../constants/index';
import { generateMapLayout, calculateIncome } from '../utils/gameLogic';
import { createInitialPlayerStates } from '../utils/initialization';
import { usePlayerManagement } from './game/usePlayerManagement';
import { useTechManager } from './game/useTechManager';

export const useGameEngine = () => {
    // --- Sub-Hooks for State Management ---
    const playerManager = usePlayerManagement();
    const techManager = useTechManager();
    
    // --- Local Map State ---
    const [sectors, setSectors] = useState<SectorData[]>([]);

    // --- Actions ---

    const startGame = () => {
        const generatedSectors = generateMapLayout(playerManager.selectedPlayerColors);
        const newPlayerStates = createInitialPlayerStates(playerManager.selectedPlayerColors, generatedSectors);
        
        setSectors(generatedSectors);
        playerManager.setPlayerStates(newPlayerStates);
        techManager.drawTechs();
        playerManager.setActivePlayerColor(playerManager.selectedPlayerColors[0]);
    };

    const updateControlBoardPopulation = (type: keyof PlayerResources, count: number) => {
        const newIncome = calculateIncome(count);
        playerManager.setPlayerStates(prev => ({
            ...prev,
            [playerManager.activePlayerColor]: {
                ...prev[playerManager.activePlayerColor],
                population: {
                    ...prev[playerManager.activePlayerColor].population,
                    [type]: Math.max(0, Math.min(POPULATION_TRACK.length, count))
                },
                resources: {
                    ...prev[playerManager.activePlayerColor].resources,
                    income: {
                        ...prev[playerManager.activePlayerColor].resources.income,
                        [type]: newIncome
                    }
                }
            }
        }));
    };

    const colonizeSector = (sectorId: string | number, slotId: string, type: ResourceType) => {
        const activePlayer = playerManager.activePlayer;
        const popOnTrack = activePlayer.population[type];
        
        if (popOnTrack <= 0) { alert(`No ${type} population cubes available on track!`); return; }
        if (activePlayer.colonyShips.total - activePlayer.colonyShips.used <= 0) { alert("No Colony Ships available!"); return; }

        // Update Ships
        playerManager.setPlayerStates(prev => ({
            ...prev,
            [playerManager.activePlayerColor]: {
                ...prev[playerManager.activePlayerColor],
                colonyShips: {
                    ...prev[playerManager.activePlayerColor].colonyShips,
                    used: prev[playerManager.activePlayerColor].colonyShips.used + 1
                }
            }
        }));

        // Update Population Track
        updateControlBoardPopulation(type, popOnTrack - 1);

        // Update Map
        setSectors(prev => prev.map(s => {
            if (s.id === sectorId) {
                return {
                    ...s,
                    populationSlots: s.populationSlots.map(slot => 
                        slot.id === slotId ? { ...slot, status: 'OCCUPIED' } : slot
                    )
                };
            }
            return s;
        }));
    };

    const commitResearch = (tech: TechTile, targetCategory: 'military' | 'grid' | 'nano'): boolean => {
        const activePlayer = playerManager.activePlayer;
        const currentTechCount = activePlayer.techs[targetCategory].length;
        if (currentTechCount >= TECH_SLOT_DISCOUNTS.length) { 
            alert("Track Full! Cannot research more technologies in this category."); 
            return false; 
        }
        
        const discount = TECH_SLOT_DISCOUNTS[currentTechCount];
        const finalCost = Math.max(tech.baseCost - discount, tech.minCost);
        
        if (activePlayer.resources.current.science < finalCost) { 
            alert(`Not enough Science! Need ${finalCost}, have ${activePlayer.resources.current.science}.`); 
            return false; 
        }
  
        // Update Research Tray
        techManager.removeTechFromTray(tech.id, tech.category);
  
        // Update Player State (Cost & Tech Add)
        playerManager.setPlayerStates(prev => ({
            ...prev,
            [playerManager.activePlayerColor]: {
                ...prev[playerManager.activePlayerColor],
                resources: {
                    ...prev[playerManager.activePlayerColor].resources,
                    current: { ...prev[playerManager.activePlayerColor].resources.current, science: prev[playerManager.activePlayerColor].resources.current.science - finalCost }
                },
                techs: {
                    ...prev[playerManager.activePlayerColor].techs,
                    [targetCategory]: [...prev[playerManager.activePlayerColor].techs[targetCategory], tech]
                }
            }
        }));
        
        return true;
    };

    const refundActionDisc = (action: PlayerAction) => {
        playerManager.setPlayerStates(prev => ({
            ...prev,
            [playerManager.activePlayerColor]: {
                ...prev[playerManager.activePlayerColor],
                discs: {
                    ...prev[playerManager.activePlayerColor].discs,
                    actions: { 
                        ...prev[playerManager.activePlayerColor].discs.actions, 
                        [action]: Math.max(0, prev[playerManager.activePlayerColor].discs.actions[action] - 1) 
                    }
                }
            }
        }));
    };

    const addSector = (newSector: SectorData, withInfluence: boolean) => {
         setSectors(prev => {
            const exists = prev.findIndex(s => s.id === newSector.id);
            const updatedSector = { ...newSector };
            if (withInfluence) updatedSector.playerColor = playerManager.activePlayerColor;

            if (exists !== -1) {
                const newList = [...prev];
                newList[exists] = updatedSector;
                return newList;
            } else {
                return [...prev, updatedSector];
            }
        });

        if (withInfluence) {
            playerManager.setPlayerStates(prev => ({
                ...prev,
                [playerManager.activePlayerColor]: {
                    ...prev[playerManager.activePlayerColor],
                    discs: { ...prev[playerManager.activePlayerColor].discs, map: prev[playerManager.activePlayerColor].discs.map + 1 }
                }
            }));
        }
    };

    const processResourceReward = (reward: DiscoveryReward) => {
        if (reward.type === 'RESOURCE') {
            const [resType, amount] = reward.id.split('_'); 
            const numAmount = parseInt(amount);
            
            playerManager.setPlayerStates(prev => ({
                ...prev,
                [playerManager.activePlayerColor]: {
                    ...prev[playerManager.activePlayerColor],
                    resources: {
                        ...prev[playerManager.activePlayerColor].resources,
                        current: {
                            ...prev[playerManager.activePlayerColor].resources.current,
                            [resType]: prev[playerManager.activePlayerColor].resources.current[resType as keyof typeof prev[typeof playerManager.activePlayerColor]['resources']['current']] + numAmount
                        }
                    }
                }
            }));
        }
    };

    return {
        // Player State
        selectedPlayerColors: playerManager.selectedPlayerColors,
        activePlayerColor: playerManager.activePlayerColor,
        activePlayer: playerManager.activePlayer,
        playerStates: playerManager.playerStates,
        setPlayerStates: playerManager.setPlayerStates,
        togglePlayerColor: playerManager.togglePlayerColor,
        advanceTurn: playerManager.advanceTurn,

        // Map State
        sectors,
        setSectors,
        addSector,
        colonizeSector,

        // Tech State
        researchTray: techManager.researchTray,
        setResearchTray: techManager.setResearchTray,
        
        // Game Logic
        startGame,
        commitResearch,
        updateControlBoardPopulation,
        refundActionDisc,
        processResourceReward
    };
};
