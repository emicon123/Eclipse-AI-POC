
import React from 'react';
import { PartType, ShipPart } from '../../types/index';
import { Crosshair, Rocket, Cpu, Shield, Heart, Hexagon, Zap, MoveUp } from 'lucide-react';

interface ShipPartIconProps {
    type: PartType;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export const ShipPartIcon: React.FC<ShipPartIconProps> = ({ type, size = 80, strokeWidth = 1.5, className }) => {
    switch (type) {
        case PartType.CANNON: return <Crosshair size={size} strokeWidth={strokeWidth} className={className} />;
        case PartType.MISSILE: return <Rocket size={size} strokeWidth={strokeWidth} className={className} />;
        case PartType.COMPUTER: return <Cpu size={size} strokeWidth={strokeWidth} className={className} />;
        case PartType.SHIELD: return <Shield size={size} strokeWidth={strokeWidth} className={className} />;
        case PartType.HULL: return <Heart size={size} strokeWidth={strokeWidth} className={className} />;
        case PartType.DRIVE: return <Hexagon size={size} strokeWidth={strokeWidth} className={className} />;
        case PartType.SOURCE: return <Zap size={size} strokeWidth={strokeWidth} className={className} />;
        case PartType.INITIATIVE: return <MoveUp size={size} strokeWidth={strokeWidth} className={className} />;
        default: return <Hexagon size={size} className={className} />;
    }
};

export const ShipPartStats: React.FC<{ part: ShipPart; isPicker?: boolean }> = ({ part, isPicker = false }) => {
    const textClass = isPicker ? "text-lg lg:text-xl font-bold" : "text-2xl lg:text-3xl font-bold";
    const iconSize = isPicker ? 18 : 24;

    if (part.type === PartType.DRIVE) {
        return (
            <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1 text-purple-400 ${textClass}`}>
                    <MoveUp size={iconSize} /><span>+{part.initiative}</span>
                </div>
                <div className={`flex items-center gap-1 text-emerald-400 ${textClass}`}>
                    <Hexagon size={iconSize} /><span>+{part.initiative}</span>
                </div>
            </div>
        );
    }

    if (part.damage > 0) return <div className={`flex items-center gap-1 text-red-400 ${textClass}`}><Crosshair size={iconSize} /><span>{part.damage}</span></div>;
    if (part.shield > 0) return <div className={`flex items-center gap-1 text-cyan-400 ${textClass}`}><Shield size={iconSize} /><span>-{part.shield}</span></div>;
    if (part.computer > 0) return <div className={`flex items-center gap-1 text-blue-400 ${textClass}`}><Cpu size={iconSize} /><span>+{part.computer}</span></div>;
    if (part.hull > 0) return <div className={`flex items-center gap-1 text-green-500 ${textClass}`}><Heart size={iconSize} /><span>{part.hull}</span></div>;
    if (part.powerGeneration > 0) return <div className={`flex items-center gap-1 text-yellow-400 ${textClass}`}><Zap size={iconSize} /><span>+{part.powerGeneration}</span></div>;
    
    if (part.initiative > 0) return <div className={`flex items-center gap-1 text-purple-400 ${textClass}`}><MoveUp size={iconSize} /><span>+{part.initiative}</span></div>;
    return null;
};
