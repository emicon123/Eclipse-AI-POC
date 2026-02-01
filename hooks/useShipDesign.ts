
import { useState, useMemo } from 'react';
import { Blueprint, ShipStats, ShipPart } from '../types';
import { calculateStats } from '../utils/gameLogic';
import { INITIAL_BLUEPRINTS } from '../constants/index';

export const useShipDesign = (activePlayer: any) => {
    const [draftBlueprints, setDraftBlueprints] = useState<Record<string, Blueprint> | null>(null);
    const [upgradeActivations, setUpgradeActivations] = useState(0);
    const [activeDiscoveryPart, setActiveDiscoveryPart] = useState<ShipPart | null>(null);
    const [activeBlueprintType, setActiveBlueprintType] = useState<string>('Interceptor');

    const displayedBlueprint = (draftBlueprints)
        ? draftBlueprints[activeBlueprintType] 
        : (activePlayer ? activePlayer.blueprints[activeBlueprintType] : INITIAL_BLUEPRINTS['Interceptor']);

    const currentStats = useMemo(() => calculateStats(displayedBlueprint), [displayedBlueprint]);

    const startUpgrade = (blueprints: any, activations: number, discoveryPart: ShipPart | null = null, type: string = 'Interceptor') => {
        setDraftBlueprints(JSON.parse(JSON.stringify(blueprints)));
        setUpgradeActivations(activations);
        setActiveDiscoveryPart(discoveryPart);
        setActiveBlueprintType(type);
    };

    const updateBlueprint = (newBp: Blueprint, cost: number) => {
        setDraftBlueprints(prev => prev ? { ...prev, [newBp.shipType]: newBp } : null);
        setUpgradeActivations(prev => prev - cost);
    };
    
    const cancelUpgrade = () => {
         setDraftBlueprints(null);
         setActiveDiscoveryPart(null);
    }

    const commitDraft = (setPlayerStates: any, activePlayerColor: string) => {
        if (!draftBlueprints) return false;
        
        let isValid = true;
        Object.values(draftBlueprints).forEach((bp: any) => {
             if (!calculateStats(bp).isValid) isValid = false;
        });
        
        if (!isValid) return false;

         setPlayerStates((prev: any) => ({
            ...prev,
            [activePlayerColor]: {
                ...prev[activePlayerColor],
                blueprints: { ...prev[activePlayerColor].blueprints, ...draftBlueprints }
            }
        }));
        
        setDraftBlueprints(null);
        setActiveDiscoveryPart(null);
        return true;
    }

    return {
        draftBlueprints,
        upgradeActivations,
        activeDiscoveryPart,
        activeBlueprintType,
        setActiveBlueprintType,
        displayedBlueprint,
        currentStats,
        startUpgrade,
        updateBlueprint,
        cancelUpgrade,
        commitDraft
    };
};
