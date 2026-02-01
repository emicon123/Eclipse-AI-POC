
import { useState } from 'react';
import { PlayerState } from '../../types/index';

const PLAYER_COLORS = ['white', 'black', 'green', 'blue', 'yellow', 'red'];

export const usePlayerManagement = () => {
    const [selectedPlayerColors, setSelectedPlayerColors] = useState<string[]>(['blue', 'red']);
    const [activePlayerColor, setActivePlayerColor] = useState('blue');
    const [playerStates, setPlayerStates] = useState<Record<string, PlayerState>>({});

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

    const advanceTurn = () => {
        const activeColorsInOrder = PLAYER_COLORS.filter(c => playerStates[c] !== undefined);
        const currentIndex = activeColorsInOrder.indexOf(activePlayerColor);
        const nextIndex = (currentIndex + 1) % activeColorsInOrder.length;
        setActivePlayerColor(activeColorsInOrder[nextIndex]);
    };

    return {
        selectedPlayerColors,
        activePlayerColor,
        activePlayer,
        playerStates,
        setPlayerStates,
        setActivePlayerColor,
        togglePlayerColor,
        advanceTurn
    };
};
