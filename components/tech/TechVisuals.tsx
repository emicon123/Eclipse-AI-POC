import React from 'react';
import { 
    Crosshair, Shield, Cpu, Zap, Rocket, Database, Heart, Pickaxe, 
    Coins, Hexagon, CircleDot, RefreshCw, Key, 
    Orbit, Atom, BoxSelect, ScanEye, EyeOff, 
    Move, BrainCircuit, Dna, Anchor, Layers, MoveUp
} from 'lucide-react';

interface TechIconProps {
    iconId: string;
    size?: number;
    className?: string;
    style?: React.CSSProperties;
}

export const TechIcon: React.FC<TechIconProps> = ({ iconId, size = 36, className = "", style = {} }) => {
    const props = { size, strokeWidth: 1.5, className: `opacity-80 ${className}`, style };

    switch (iconId) {
        // Military
        case 'bomb': return <Atom {...props} />;
        case 'starbase': return <Anchor {...props} />;
        case 'cannon': return <Crosshair {...props} />;
        case 'shield_phase': return <Shield {...props} strokeDasharray="4 4" />;
        case 'mining': return <Pickaxe {...props} />;
        case 'source': return <Zap {...props} />;
        case 'computer': return <Database {...props} />;
        case 'missile': return <Rocket {...props} />;
        
        // Grid
        case 'shield': return <Shield {...props} />;
        case 'hull': return <Heart {...props} />;
        case 'money': return <Coins {...props} />;
        case 'drive': return <Hexagon {...props} />;
        case 'grid': return <BoxSelect {...props} />;
        
        // Nano
        case 'robot': return <RefreshCw {...props} />;
        case 'orbital': return <Orbit {...props} />;
        case 'robot_head': return <BrainCircuit {...props} />;
        case 'flask': return <ScanEye {...props} />;
        case 'monolith': return <Layers {...props} />;
        case 'wormhole': return <CircleDot {...props} />;
        case 'key': return <Key {...props} />;
        
        // Rare
        case 'split': return <Move {...props} />;
        case 'absorb': return <Shield {...props} fill="currentColor" className="opacity-20" />;
        case 'eye_off': return <EyeOff {...props} />;
        case 'move': return <Move {...props} />;
        case 'hull_brain': return <BrainCircuit {...props} />;
        case 'portal': return <CircleDot {...props} style={{ transform: 'scale(1.5)' }} />;
        case 'upgrade': return <RefreshCw {...props} />;
        case 'flask_ancient': return <ScanEye {...props} />;
        case 'dna': return <Dna {...props} />;
        
        default: return <Cpu {...props} />;
    }
};

export const TechStats: React.FC<{ techId: string }> = ({ techId }) => {
    switch(techId) {
        case 'neutron_bombs': return <div className="flex items-center gap-1 font-bold text-[8px]"><Atom size={10} className="text-pink-400" /> DESTROY POP</div>;
        case 'starbase': return <div className="flex items-center gap-1 font-bold text-[8px]"><Anchor size={10} className="text-white" /> BUILD STARBASE</div>;
        case 'plasma_cannon': return <div className="flex items-center gap-1 font-bold"><div className="flex items-center text-orange-400 text-[9px]"><Crosshair size={10} /> 2</div><div className="flex items-center text-pink-400 text-[9px]"><Zap size={10} /> -2</div></div>;
        case 'phase_shield': return <div className="flex items-center gap-1 font-bold"><div className="flex items-center text-cyan-400 text-[9px]"><Shield size={10} /> -2</div><div className="flex items-center text-pink-400 text-[9px]"><Zap size={10} /> -1</div></div>;
        case 'advanced_mining': return <div className="flex items-center gap-1 font-bold text-[8px]"><Pickaxe size={10} className="text-amber-500" /> ADV. SECTORS</div>;
        case 'tachyon_source': return <div className="flex items-center gap-1 font-bold text-pink-400 text-[9px]"><Zap size={10} /> +9</div>;
        case 'gluon_computer': return <div className="flex items-center gap-1 font-bold"><div className="flex items-center text-blue-400 text-[9px]"><Cpu size={10} /> +3</div><div className="flex items-center text-purple-400 text-[9px]"><MoveUp size={10} /> +2</div><div className="flex items-center text-pink-400 text-[9px]"><Zap size={10} /> -2</div></div>;
        case 'plasma_missile': return <div className="flex items-center gap-1 font-bold"><div className="flex items-center text-orange-500 text-[9px]"><Rocket size={10} /> 2</div><div className="flex items-center text-pink-400 text-[9px]"><Zap size={10} /> -1</div></div>;
        
        case 'gauss_shield': return <div className="flex items-center gap-1 font-bold text-cyan-400 text-[9px]"><Shield size={10} /> -1</div>;
        case 'improved_hull': return <div className="flex items-center gap-1 font-bold text-green-500 text-[9px]"><Heart size={10} /> 2</div>;
        case 'fusion_source': return <div className="flex items-center gap-1 font-bold text-orange-400 text-[9px]"><Zap size={10} /> +6</div>;
        case 'positron_computer': return <div className="flex items-center gap-1 font-bold"><div className="flex items-center text-blue-400 text-[9px]"><Cpu size={10} /> +2</div><div className="flex items-center text-purple-400 text-[9px]"><MoveUp size={10} /> +1</div><div className="flex items-center text-pink-400 text-[9px]"><Zap size={10} /> -1</div></div>;
        case 'advanced_economy': return <div className="flex items-center gap-1 font-bold text-[8px]"><Coins size={10} className="text-yellow-500" /> ADV. SECTORS</div>;
        case 'tachyon_drive': return <div className="flex items-center gap-1 font-bold"><div className="flex items-center text-emerald-400 text-[9px]"><Hexagon size={10} /> 3</div><div className="flex items-center text-purple-400 text-[9px]"><MoveUp size={10} /> +3</div><div className="flex items-center text-pink-400 text-[9px]"><Zap size={10} /> -3</div></div>;
        case 'antimatter_cannon': return <div className="flex items-center gap-1 font-bold"><div className="flex items-center text-red-500 text-[9px]"><Crosshair size={10} /> 4</div><div className="flex items-center text-pink-400 text-[9px]"><Zap size={10} /> -4</div></div>;
        case 'quantum_grid': return <div className="flex items-center gap-1 font-bold text-[8px]"><CircleDot size={10} className="text-purple-400" /> +2 DISCS</div>;

        case 'nanorobots': return <div className="flex items-center gap-1 font-bold text-[8px]"><RefreshCw size={10} className="text-yellow-400" /> +1 BUILD</div>;
        case 'fusion_drive': return <div className="flex items-center gap-1 font-bold"><div className="flex items-center text-emerald-400 text-[9px]"><Hexagon size={10} /> 2</div><div className="flex items-center text-purple-400 text-[9px]"><MoveUp size={10} /> +2</div><div className="flex items-center text-pink-400 text-[9px]"><Zap size={10} /> -2</div></div>;
        case 'orbital': return <div className="flex items-center gap-1 font-bold text-[8px]"><Orbit size={10} className="text-white" /> BUILD ORBITAL</div>;
        case 'advanced_robotics': return <div className="flex items-center gap-1 font-bold text-[8px]"><CircleDot size={10} className="text-purple-400" /> +1 DISC</div>;
        case 'advanced_labs': return <div className="flex items-center gap-1 font-bold text-[8px]"><ScanEye size={10} className="text-pink-500" /> ADV. SECTORS</div>;
        case 'monolith': return <div className="flex items-center gap-1 font-bold text-[8px]"><Layers size={10} className="text-white" /> BUILD MONOLITH</div>;
        case 'wormhole_generator': return <div className="flex items-center gap-1 font-bold text-[8px]"><CircleDot size={10} className="text-emerald-400" /> TRAVEL EDGE</div>;
        case 'artifact_key': return <div className="flex items-center gap-1 font-bold text-[8px]"><Key size={10} className="text-yellow-400" /> 5 RES / ARTIFACT</div>;

        default: return <div className="text-[8px] opacity-70">Unlock Tech</div>;
    }
}