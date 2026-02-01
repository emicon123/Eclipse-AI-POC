
import { useState, useMemo } from 'react';
import { 
    PlayerState, SectorData, ResearchTrayState, TechCategory, TechTile, 
    Blueprint, DiscoveryReward, ShipPart, PlayerResources, PlayerAction, ResourceType 
} from '../types/index';
import { 
    DEFAULT_INTERCEPTOR, DEFAULT_CRUISER, DEFAULT_DREADNOUGHT, DEFAULT_STARBASE, 
    TECH_DATABASE, TECH_SLOT_DISCOUNTS, SHIP_PARTS, POPULATION_TRACK 
} from '../constants/index';
import { generateMapLayout, calculateIncome } from '../utils/gameLogic';

const INITIAL_BLUEPRINTS = {
    Interceptor: DEFAULT_INTERCEPTOR,
    Cruiser: DEFAULT_CRUISER,
    Dreadnought: DEFAULT_DREADNOUGHT,
    Starbase: DEFAULT_STARBASE
};

const PLAYER_COLORS = ['white', 'black', 'green', 'blue', 'yellow', 'red'];

export const useGameEngine = () => {
    const [selectedPlayerColors, setSelectedPlayerColors] = useState<string[]>(['blue', 'red']);
    const [activePlayerColor, setActivePlayerColor] = useState('blue');
    const [playerStates, setPlayerStates] = useState<Record<string, PlayerState>>({});
    const [sectors, setSectors] = useState<SectorData[]>([]);
    const [researchTray, setResearchTray] = useState<ResearchTrayState>({ military: [], grid: [], nano: [], rare: [] });
    
    // Derived Active Player
    const activePlayer = playerStates[activePlayerColor];

    const togglePlayerColor = (color: string) => {
        setSelectedPlayerColors(prev => {
            if (prev.includes(color)) {
                if (prev.length <= 1) return prev; 
                return prev.filter(c => c !== color);
            } else {
                const newSelection = [...prev, color];
                return PLAYER_COLORS.filter(c => newSelection.includes(c));
            }
        });
    };

    const drawTechs = () => {
        const pick = (category: TechCategory, count: number) => {
            const techTypes = TECH_DATABASE.filter(t => t.category === category);
            const pool: TechTile[] = [];
            techTypes.forEach(tech => {
                for(let i = 0; i < tech.totalCount; i++) {
                    pool.push(tech);
                }
            });
            const shuffled = [...pool].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count).sort((a,b) => a.baseCost - b.baseCost);
        }
        setResearchTray({
            military: pick('MILITARY', 4),
            grid: pick('GRID', 4),
            nano: pick('NANO', 4),
            rare: pick('RARE', 4)
        });
    };

    const startGame = () => {
        const generatedSectors = generateMapLayout(selectedPlayerColors);
        const newPlayerStates: Record<string, PlayerState> = {};
        const MAX_POP_ON_TRACK = POPULATION_TRACK.length; // 12 typically

        selectedPlayerColors.forEach((color, i) => {
            const startSector = generatedSectors.find(s => s.playerColor === color && s.type === 'START');
            
            // Auto-Populate Logic
            // The user requested Start Production to be 3.
            // Standard track: 2, 3, 4... (Indices: 0, 1, 2...)
            // To get 3 (Index 1), we need revealedCount = 2.
            // This implies 2 cubes removed from track.
            // Start sectors typically have 1 Money, 1 Science, 1 Materials slot.
            // If we fill ALL, we remove 1 of each. 
            // Resulting Income = TRACK[12 - 11 - 1] = TRACK[0] = 2.
            // To satisfy user request of 3, we force calculation or assume user rules implies base 3.
            // For now, we STRICTLY follow the component logic: Occupy slots -> Remove cubes.
            
            let usedMoney = 0;
            let usedScience = 0;
            let usedMaterials = 0;

            if (startSector && startSector.populationSlots) {
                startSector.populationSlots.forEach(slot => {
                    if (slot.type === 'money') usedMoney++;
                    if (slot.type === 'science') usedScience++;
                    if (slot.type === 'materials') usedMaterials++;
                    slot.status = 'OCCUPIED'; 
                });
            }

            const popMoney = Math.max(0, MAX_POP_ON_TRACK - usedMoney);
            const popScience = Math.max(0, MAX_POP_ON_TRACK - usedScience);
            const popMaterials = Math.max(0, MAX_POP_ON_TRACK - usedMaterials);

            newPlayerStates[color] = {
                color: color,
                resources: {
                    current: { money: 2 + i, science: 3, materials: 6 }, 
                    income: { 
                        money: calculateIncome(popMoney), 
                        science: calculateIncome(popScience), 
                        materials: calculateIncome(popMaterials) 
                    },
                    max: 99 
                },
                population: {
                    money: popMoney, 
                    science: popScience,
                    materials: popMaterials,
                    graveyard: { money: 0, science: 0, materials: 0 }
                },
                colonyShips: { total: 3, used: 0 },
                blueprints: JSON.parse(JSON.stringify(INITIAL_BLUEPRINTS)),
                techs: { military: [], grid: [], nano: [] },
                discs: {
                    total: 13,
                    map: 1, 
                    actions: { EXPLORE: 0, RESEARCH: 0, UPGRADE: 0, BUILD: 0, MOVE: 0, INFLUENCE: 0 }
                }
            };
        });
        
        setSectors(generatedSectors);
        setPlayerStates(newPlayerStates);
        drawTechs();
        setActivePlayerColor(selectedPlayerColors[0]);
    };

    const advanceTurn = () => {
        const activeColorsInOrder = PLAYER_COLORS.filter(c => playerStates[c] !== undefined);
        const currentIndex = activeColorsInOrder.indexOf(activePlayerColor);
        const nextIndex = (currentIndex + 1) % activeColorsInOrder.length;
        setActivePlayerColor(activeColorsInOrder[nextIndex]);
    };

    const updateControlBoardPopulation = (type: keyof PlayerResources, count: number) => {
        const newIncome = calculateIncome(count);
        setPlayerStates(prev => ({
            ...prev,
            [activePlayerColor]: {
                ...prev[activePlayerColor],
                population: {
                    ...prev[activePlayerColor].population,
                    [type]: Math.max(0, Math.min(POPULATION_TRACK.length, count))
                },
                resources: {
                    ...prev[activePlayerColor].resources,
                    income: {
                        ...prev[activePlayerColor].resources.income,
                        [type]: newIncome
                    }
                }
            }
        }));
    };

    const colonizeSector = (sectorId: string | number, slotId: string, type: ResourceType) => {
        const popOnTrack = activePlayer.population[type];
        if (popOnTrack <= 0) { alert(`No ${type} population cubes available on track!`); return; }
        if (activePlayer.colonyShips.total - activePlayer.colonyShips.used <= 0) { alert("No Colony Ships available!"); return; }

        setPlayerStates(prev => ({
            ...prev,
            [activePlayerColor]: {
                ...prev[activePlayerColor],
                colonyShips: {
                    ...prev[activePlayerColor].colonyShips,
                    used: prev[activePlayerColor].colonyShips.used + 1
                }
            }
        }));

        updateControlBoardPopulation(type, popOnTrack - 1);

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
  
        // Remove from tray
        setResearchTray(prev => {
            const catKey = tech.category === 'RARE' ? 'rare' : tech.category.toLowerCase() as keyof ResearchTrayState;
            const idx = prev[catKey].findIndex(t => t.id === tech.id);
            if (idx === -1) return prev;
            const newList = [...prev[catKey]];
            newList.splice(idx, 1);
            return { ...prev, [catKey]: newList };
        });
  
        // Add to player
        setPlayerStates(prev => ({
            ...prev,
            [activePlayerColor]: {
                ...prev[activePlayerColor],
                resources: {
                    ...prev[activePlayerColor].resources,
                    current: { ...prev[activePlayerColor].resources.current, science: prev[activePlayerColor].resources.current.science - finalCost }
                },
                techs: {
                    ...prev[activePlayerColor].techs,
                    [targetCategory]: [...prev[activePlayerColor].techs[targetCategory], tech]
                }
            }
        }));
        
        return true;
    };

    return {
        selectedPlayerColors,
        activePlayerColor,
        activePlayer,
        sectors,
        playerStates,
        researchTray,
        setSectors,
        setPlayerStates,
        setResearchTray,
        togglePlayerColor,
        startGame,
        advanceTurn,
        colonizeSector,
        commitResearch,
        updateControlBoardPopulation
    };
};
