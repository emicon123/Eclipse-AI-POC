import React from 'react';
import { ShipStats } from '../types';
import { Zap, Shield, Crosshair, MoveUp, Database, Octagon } from 'lucide-react';

interface StatsPanelProps {
  stats: ShipStats;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Power */}
        <div className={`p-4 rounded-xl border ${stats.powerBalance >= 0 ? 'bg-slate-800 border-slate-700' : 'bg-red-900/20 border-red-500/50'} flex flex-col items-center justify-center`}>
            <Zap className={`mb-2 ${stats.powerBalance >= 0 ? 'text-yellow-400' : 'text-red-500'}`} />
            <span className="text-xs text-slate-400 uppercase tracking-wider">Power</span>
            <span className={`text-xl font-bold ${stats.powerBalance >= 0 ? 'text-white' : 'text-red-400'}`}>
                {stats.powerBalance >= 0 ? '+' : ''}{stats.powerBalance}
            </span>
        </div>

        {/* Initiative */}
        <div className="p-4 rounded-xl border bg-slate-800 border-slate-700 flex flex-col items-center justify-center">
            <MoveUp className="mb-2 text-purple-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wider">Initiative</span>
            <span className="text-xl font-bold text-white">{stats.initiative}</span>
        </div>

        {/* Damage */}
        <div className="p-4 rounded-xl border bg-slate-800 border-slate-700 flex flex-col items-center justify-center">
            <Crosshair className="mb-2 text-red-500" />
            <span className="text-xs text-slate-400 uppercase tracking-wider">Damage</span>
            <span className="text-xl font-bold text-white">{stats.damage}</span>
        </div>

         {/* Computer */}
         <div className="p-4 rounded-xl border bg-slate-800 border-slate-700 flex flex-col items-center justify-center">
            <Database className="mb-2 text-blue-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wider">Computer</span>
            <span className="text-xl font-bold text-white">+{stats.computer}</span>
        </div>

        {/* Shield */}
        <div className="p-4 rounded-xl border bg-slate-800 border-slate-700 flex flex-col items-center justify-center">
            <Shield className="mb-2 text-cyan-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wider">Shield</span>
            <span className="text-xl font-bold text-white">-{stats.shield}</span>
        </div>

        {/* Hull */}
        <div className="p-4 rounded-xl border bg-slate-800 border-slate-700 flex flex-col items-center justify-center">
            <Octagon className="mb-2 text-green-500" />
            <span className="text-xs text-slate-400 uppercase tracking-wider">Hull</span>
            <span className="text-xl font-bold text-white">{stats.hull}</span>
        </div>
    </div>
  );
};