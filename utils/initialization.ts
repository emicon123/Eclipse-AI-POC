
import { PlayerState, SectorData } from '../types/index';
import { INITIAL_BLUEPRINTS, POPULATION_TRACK } from '../constants/index';
import { calculateIncome } from './gameLogic';

export const createInitialPlayerStates = (
    playerColors: string[], 
    generatedSectors: SectorData[]
): Record<string, PlayerState> => {
    const newPlayerStates: Record<string, PlayerState> = {};
    const MAX_POP_ON_TRACK = POPULATION_TRACK.length;

    playerColors.forEach((color, i) => {
        const startSector = generatedSectors.find(s => s.playerColor === color && s.type === 'START');
        
        // 1. Mark the physical slots on the map as occupied
        if (startSector && startSector.populationSlots) {
            startSector.populationSlots.forEach(slot => {
                slot.status = 'OCCUPIED'; 
            });
        }

        // 2. Force removal of 2 cubes to ensure Income 3
        const usedMoney = 2;
        const usedScience = 2;
        const usedMaterials = 2;

        const popMoney = Math.max(0, MAX_POP_ON_TRACK - usedMoney);
        const popScience = Math.max(0, MAX_POP_ON_TRACK - usedScience);
        const popMaterials = Math.max(0, MAX_POP_ON_TRACK - usedMaterials);

        newPlayerStates[color] = {
            color: color,
            resources: {
                current: { money: 30, science: 30, materials: 30 }, 
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

    return newPlayerStates;
};
