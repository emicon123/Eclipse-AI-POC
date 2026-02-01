
import React from 'react';
import { ChevronLeft, Zap, Check, BrainCircuit } from 'lucide-react';
import { Blueprint, ShipStats, ShipPart } from '../../types/index';
import { ShipDesigner } from '../ship/ShipDesigner';

interface UpgradeViewProps {
    displayedBlueprint: Blueprint;
    currentStats: ShipStats;
    activePlayerColor: string;
    activeBlueprintType: string;
    availableTechIds: string[];
    upgradeActivations: number;
    activeDiscoveryPart: ShipPart | null;
    onBlueprintUpdate: (newBp: Blueprint, cost: number) => void;
    onCancel: () => void;
    onCommit: () => void;
    onTypeSelect: (type: any) => void;
}

export const UpgradeView: React.FC<UpgradeViewProps> = ({
    displayedBlueprint,
    currentStats,
    activePlayerColor,
    activeBlueprintType,
    availableTechIds,
    upgradeActivations,
    activeDiscoveryPart,
    onBlueprintUpdate,
    onCancel,
    onCommit,
    onTypeSelect
}) => {
    return (
       <main className="flex-1 flex flex-col p-6 lg:p-10 overflow-y-auto">
          <div className="flex items-center justify-between mb-4 flex-none">
              <div className="flex items-center gap-6"><button onClick={onCancel} className="p-3 bg-slate-800 rounded-full"><ChevronLeft /></button><h2 className="text-4xl font-bold">Ship Design</h2></div>
              <div className="flex gap-4">
                  {!currentStats.isValid && <div className="px-4 py-2 rounded-xl border bg-red-500/20 border-red-500 text-red-400 flex items-center gap-2 font-bold animate-pulse"><Zap size={20} /><span className="uppercase">Power Negative</span></div>}
                  <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${upgradeActivations > 0 ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400'}`}><span className="text-sm font-bold uppercase tracking-wider">Activations Left:</span><span className="text-xl font-black">{upgradeActivations}</span></div>
                  <button onClick={onCancel} className="px-6 py-2 rounded-xl border border-slate-600 hover:bg-slate-700 text-slate-300 font-bold transition-all">Cancel Changes</button>
                  <button onClick={onCommit} disabled={!currentStats.isValid} className="px-8 py-2 rounded-xl border font-bold flex items-center gap-2 transition-all bg-blue-600 border-blue-500 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"><Check size={20} /> Finish Upgrades</button>
              </div>
          </div>
          <div className="flex gap-4 mb-4 flex-none">{(['Interceptor', 'Cruiser', 'Dreadnought', 'Starbase'] as const).map((type) => (<button key={type} onClick={() => onTypeSelect(type)} className={`px-8 py-4 rounded-2xl border-2 font-bold text-xl uppercase transition-colors ${activeBlueprintType === type ? 'bg-slate-800 border-white text-white' : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'}`}>{type}</button>))}</div>
          <div className="flex-1 grid lg:grid-cols-3 gap-8 min-h-0">
               <div className="lg:col-span-2 flex flex-col min-h-0"><ShipDesigner blueprint={displayedBlueprint} onUpdate={onBlueprintUpdate} stats={currentStats} playerColor={activePlayerColor} availableTechIds={availableTechIds} activationsRemaining={upgradeActivations} pendingPart={activeDiscoveryPart} /></div>
               <div className="space-y-6 flex-none"><div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700"><h3 className="font-bold flex gap-2 items-center"><BrainCircuit className="text-blue-400"/> AI Assistant</h3><p className="text-sm text-slate-400 mt-2">Analyze your ship's combat efficiency against current threats.</p></div></div>
          </div>
       </main>
    );
};
