
import { useState } from 'react';
import { ResearchTrayState, TechCategory, TechTile } from '../../types/index';
import { TECH_DATABASE } from '../../constants/index';

export const useTechManager = () => {
    const [researchTray, setResearchTray] = useState<ResearchTrayState>({ military: [], grid: [], nano: [], rare: [] });

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

    const removeTechFromTray = (techId: string, category: TechCategory) => {
        setResearchTray(prev => {
            const catKey = category === 'RARE' ? 'rare' : category.toLowerCase() as keyof ResearchTrayState;
            const idx = prev[catKey].findIndex(t => t.id === techId);
            if (idx === -1) return prev;
            const newList = [...prev[catKey]];
            newList.splice(idx, 1);
            return { ...prev, [catKey]: newList };
        });
    };

    return {
        researchTray,
        setResearchTray,
        drawTechs,
        removeTechFromTray
    };
};
