
import React, { useState, useRef } from 'react';
import { 
    Crosshair, Shield, Cpu, Sparkles, ChevronLeft
} from 'lucide-react';
import { ResearchTrayState, TechTile } from '../../types/index';
import { TechIcon, TechStats } from './TechVisuals';

interface ResearchBoardProps {
  onClose: () => void;
  playerColor?: string;
  availableTechs?: ResearchTrayState;
  onTechSelect?: (tech: TechTile) => void;
}

export const ResearchBoard: React.FC<ResearchBoardProps> = ({ onClose, playerColor = 'white', availableTechs, onTechSelect }) => {
  // --- PAN & ZOOM STATE ---
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  
  // We use both state (for UI updates like cursor) and ref (for immediate logic checks)
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  
  const dragStartRef = useRef<{ x: number, y: number } | null>(null);
  const dragStartPosRef = useRef<{ x: number, y: number } | null>(null);

  // --- PAN & ZOOM HANDLERS ---
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const zoomIntensity = 0.1;
    const direction = e.deltaY > 0 ? -1 : 1;
    const newScale = Math.min(Math.max(0.5, transform.scale + direction * zoomIntensity), 2.5);
    
    setTransform(prev => ({
        ...prev,
        scale: newScale
    }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Critical: Do NOT call preventDefault() here as it blocks onClick events on children
    setIsDragging(false); 
    isDraggingRef.current = false;
    dragStartRef.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStartRef.current || !dragStartPosRef.current) return;
    
    // Capture values to ensure they aren't null inside checks or callbacks
    const startPos = dragStartRef.current;
    const initialClickPos = dragStartPosRef.current;

    // Calculate distance moved to prevent micro-movements from blocking clicks
    const dx = e.clientX - initialClickPos.x;
    const dy = e.clientY - initialClickPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 5) {
        if (!isDraggingRef.current) {
            setIsDragging(true);
            isDraggingRef.current = true;
        }
        setTransform(prev => ({
            ...prev,
            x: e.clientX - startPos.x,
            y: e.clientY - startPos.y
        }));
    }
  };

  const handleMouseUp = () => {
    dragStartRef.current = null;
    dragStartPosRef.current = null;
    // We delay resetting the ref slightly to ensure onClick handler can check it
    setTimeout(() => {
        setIsDragging(false);
        isDraggingRef.current = false;
    }, 0);
  };

  const handleTileClick = (tech: TechTile) => {
      // Use ref for immediate check
      if (isDraggingRef.current) return; 
      if (onTechSelect) {
          onTechSelect(tech);
      }
  };
  
  const categories = [
    { 
      id: 'MILITARY', 
      label: 'Military', 
      icon: <Crosshair className="text-pink-500 w-8 h-8" />, 
      color: 'border-pink-500/30 bg-pink-900/10 text-pink-500',
      trackColor: 'bg-pink-900/5',
      slotBorder: 'border-pink-500/20',
      iconColor: 'text-pink-400'
    },
    { 
      id: 'GRID', 
      label: 'Grid', 
      icon: <Shield className="text-green-500 w-8 h-8" />, 
      color: 'border-green-500/30 bg-green-900/10 text-green-500',
      trackColor: 'bg-green-900/5',
      slotBorder: 'border-green-500/20',
      iconColor: 'text-green-400'
    },
    { 
      id: 'NANO', 
      label: 'Nano', 
      icon: <Cpu className="text-yellow-500 w-8 h-8" />, 
      color: 'border-yellow-500/30 bg-yellow-900/10 text-yellow-500',
      trackColor: 'bg-yellow-900/5',
      slotBorder: 'border-yellow-500/20',
      iconColor: 'text-yellow-400'
    }
  ];

  const columns = [2, 4, 6, 8, 10, 12, 14, 16];
  const rareTechSlots = 8; // Increased for balance/visuals

  // Updated TechTileView with Icons and Larger Size
  const TechTileView = ({ tech, isRare, iconColor, stackSize = 1 }: { tech: TechTile, isRare?: boolean, iconColor?: string, stackSize?: number }) => (
      <div 
        onClick={() => handleTileClick(tech)}
        className={`
            absolute inset-0
            w-full h-full flex flex-col justify-between p-3 rounded-xl overflow-hidden bg-slate-800 
            ${isRare ? 'border-2 border-purple-500/50' : ''}
            hover:ring-4 hover:ring-white/30 cursor-pointer transition-all shadow-xl
            group z-10 hover:z-20 hover:-translate-y-1
        `}
      >
          {/* Header */}
          <div className="flex justify-between items-start z-20 relative">
              <div className="text-[11px] font-black leading-tight uppercase text-white tracking-wide max-w-[80%]">{tech.name}</div>
          </div>
          
          {/* Central Icon */}
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-transform group-hover:scale-110 duration-500 ${isRare ? 'text-purple-400' : iconColor}`}>
              <TechIcon iconId={tech.iconId} size={64} />
          </div>

          <div className="flex justify-between items-end mt-1 relative z-20 w-full">
              <div className="bg-slate-900/60 p-1.5 rounded backdrop-blur-sm shadow-md border border-slate-700/50">
                   <TechStats techId={tech.id} />
              </div>
              
              {/* COST BUBBLES */}
              <div className="flex items-center relative h-10 w-14 flex-none">
                  {/* Base Cost (White Square/Circle) */}
                  <div className="absolute right-0 bottom-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg z-10 border-2 border-slate-300">
                      <span className="text-black font-black text-xl">{tech.baseCost}</span>
                  </div>
                  {/* Min Cost (Colored Circle) */}
                  <div className={`absolute right-7 bottom-[-6px] w-7 h-7 rounded-full border-2 border-slate-800 flex items-center justify-center shadow-lg z-20 ${
                      tech.category === 'MILITARY' ? 'bg-pink-500 text-white' :
                      tech.category === 'GRID' ? 'bg-green-500 text-black' :
                      tech.category === 'NANO' ? 'bg-yellow-400 text-black' : 'bg-purple-500 text-white'
                  }`}>
                      <span className="font-black text-[11px]">{tech.minCost}</span>
                  </div>
              </div>
          </div>

          {/* Category stripe */}
          <div className={`absolute top-0 left-0 w-1.5 h-full opacity-100 ${
              tech.category === 'MILITARY' ? 'bg-pink-500' :
              tech.category === 'GRID' ? 'bg-green-500' :
              tech.category === 'NANO' ? 'bg-yellow-500' : 'bg-purple-500'
          }`}></div>
      </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#13151a] rounded-3xl border border-slate-700 shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex-none flex items-center justify-between p-6 bg-slate-900 border-b border-slate-700 z-50 shadow-md">
            <div className="flex items-center gap-6">
                 <button 
                    onClick={onClose}
                    className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-600"
                >
                    <ChevronLeft size={28} />
                </button>
                <div>
                    <h2 className="text-4xl font-black text-white tracking-widest uppercase flex items-center gap-3">
                        <Cpu className="text-blue-500" size={36} />
                        Research <span className="text-blue-500">Database</span>
                    </h2>
                    <p className="text-slate-400 text-sm font-mono tracking-widest mt-1">SELECT TECHNOLOGY TO ACQUIRE</p>
                </div>
            </div>
            <div className="flex flex-col items-end">
                 <div className="text-slate-500 text-xs uppercase tracking-widest font-bold">Systems Online</div>
                 <div className="flex gap-2 mt-1">
                     <div className="px-2 py-1 bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs rounded">MILITARY</div>
                     <div className="px-2 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-xs rounded">GRID</div>
                     <div className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs rounded">NANO</div>
                 </div>
            </div>
        </div>

        {/* Board Container */}
        <div 
            className="flex-1 overflow-hidden relative bg-[#0b0c10] cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
        >
            <div 
                className="absolute origin-top-left transition-transform duration-75 ease-out"
                style={{
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    padding: '60px'
                }}
            >
                {/* WIDER CONTAINER FOR FULL HD */}
                <div className="bg-[#16181d] rounded-3xl p-8 lg:p-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-slate-800/80 inline-block min-w-[1450px]">
                    
                    {/* Column Headers */}
                    <div className="flex gap-6 mb-6 pl-[140px]">
                        {columns.map((cost, i) => (
                            <div key={i} className="w-40 h-12 flex items-center justify-center text-slate-500/30 font-black text-4xl select-none">
                                {cost}
                            </div>
                        ))}
                    </div>

                    {/* Standard Categories */}
                    <div className="flex flex-col gap-6">
                        {categories.map((cat) => {
                            const catTechs = availableTechs ? availableTechs[cat.id.toLowerCase() as keyof ResearchTrayState] : [];
                            
                            // Group by ID to handle stacking
                            const groupedTechs = new Map<string, TechTile[]>();
                            catTechs.forEach(t => {
                                if(!groupedTechs.has(t.id)) groupedTechs.set(t.id, []);
                                groupedTechs.get(t.id)?.push(t);
                            });

                            return (
                            <div key={cat.id} className={`flex gap-6 p-4 rounded-2xl ${cat.trackColor} border border-white/5`}>
                                {/* Row Header */}
                                <div className={`w-28 h-40 flex flex-col items-center justify-center gap-3 rounded-xl border-2 ${cat.color} shadow-lg bg-slate-900/50`}>
                                    {cat.icon}
                                    <span className="font-bold text-xs uppercase tracking-widest">{cat.label}</span>
                                </div>

                                {/* Tech Slots */}
                                <div className="flex gap-6">
                                    {columns.map((colCost, i) => {
                                        // Find any tech stack that belongs in this cost slot
                                        // Since keys are IDs, we look for any entry where value[0].baseCost === colCost
                                        const foundStack = Array.from(groupedTechs.values()).find(stack => stack[0].baseCost === colCost);
                                        const tech = foundStack ? foundStack[0] : null;
                                        const count = foundStack ? foundStack.length : 0;

                                        return (
                                            <div 
                                                key={i} 
                                                className={`
                                                    w-40 h-40 rounded-xl bg-[#0e0f14] border-2 border-dashed ${cat.slotBorder}
                                                    shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]
                                                    relative
                                                `}
                                            >
                                                {tech ? (
                                                    <div className="w-full h-full relative animate-in fade-in zoom-in-95 duration-300">
                                                        {/* Render stack underneath visual effect */}
                                                        {count > 1 && Array.from({length: count - 1}).map((_, idx) => (
                                                             <div key={idx} className="absolute inset-0 bg-slate-700 rounded-xl border border-slate-600"
                                                                  style={{ 
                                                                      transform: `translate(${(idx+1)*3}px, ${(idx+1)*-3}px)`,
                                                                      zIndex: 0
                                                                  }}
                                                             />
                                                        ))}
                                                        
                                                        {/* Top Card */}
                                                        <div className="absolute inset-0 z-10">
                                                             <TechTileView tech={tech} iconColor={cat.iconColor} stackSize={count} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center opacity-10">
                                                        <div className="w-20 h-1 rounded bg-current"></div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )})}
                    </div>

                    {/* Separator */}
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent my-10 opacity-30"></div>

                    {/* Rare Technologies */}
                    <div className="flex gap-6 p-4 rounded-2xl bg-purple-900/5 justify-center border border-purple-500/10">
                        <div className="w-28 h-40 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-purple-500/30 bg-purple-900/10 text-purple-400 shadow-lg bg-slate-900/50">
                            <Sparkles className="w-8 h-8" />
                            <span className="font-bold text-xs uppercase tracking-widest">Rare</span>
                        </div>

                        <div className="flex gap-6 flex-wrap max-w-[1300px]">
                            {Array.from({ length: rareTechSlots }).map((_, i) => {
                                const tech = availableTechs?.rare[i];
                                return (
                                    <div 
                                        key={i} 
                                        className={`
                                            w-40 h-40 rounded-xl bg-[#0e0f14] border-2 border-dashed border-purple-500/20
                                            shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]
                                            flex items-center justify-center relative p-1.5
                                        `}
                                    >
                                        {tech ? (
                                            <div className="w-full h-full animate-in fade-in zoom-in-95 duration-300">
                                                <TechTileView tech={tech} isRare={true} />
                                            </div>
                                        ) : (
                                            <div className="text-purple-900/20 font-black text-4xl select-none">?</div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
};
