import { PartType, ShipPart, Blueprint, TechTile } from './types';

export const TECH_SLOT_DISCOUNTS = [0, 1, 2, 3, 4, 6, 8];

export const SHIP_PARTS: ShipPart[] = [
  // Cannons
  { id: 'ion_cannon', name: 'Ion Cannon', type: PartType.CANNON, cost: 0, damage: 1, computer: 0, shield: 0, hull: 0, initiative: 0, powerUsage: 1, powerGeneration: 0, color: 'text-yellow-400' },
  { id: 'plasma_cannon', name: 'Plasma Cannon', type: PartType.CANNON, cost: 0, damage: 2, computer: 0, shield: 0, hull: 0, initiative: 0, powerUsage: 2, powerGeneration: 0, color: 'text-orange-500' },
  { id: 'soliton_cannon', name: 'Soliton Cannon', type: PartType.CANNON, cost: 0, damage: 3, computer: 0, shield: 0, hull: 0, initiative: 0, powerUsage: 3, powerGeneration: 0, color: 'text-red-500' },
  { id: 'antimatter_cannon', name: 'Antimatter Cannon', type: PartType.CANNON, cost: 0, damage: 4, computer: 0, shield: 0, hull: 0, initiative: 0, powerUsage: 4, powerGeneration: 0, color: 'text-red-600' },

  // Computers
  { id: 'electron_comp', name: 'Electron Computer', type: PartType.COMPUTER, cost: 0, damage: 0, computer: 1, shield: 0, hull: 0, initiative: 0, powerUsage: 0, powerGeneration: 0, color: 'text-blue-300' },
  { id: 'positron_comp', name: 'Positron Computer', type: PartType.COMPUTER, cost: 0, damage: 0, computer: 2, shield: 0, hull: 0, initiative: 1, powerUsage: 1, powerGeneration: 0, color: 'text-blue-400' },
  { id: 'gluon_comp', name: 'Gluon Computer', type: PartType.COMPUTER, cost: 0, damage: 0, computer: 3, shield: 0, hull: 0, initiative: 2, powerUsage: 2, powerGeneration: 0, color: 'text-blue-500' },

  // Shields
  { id: 'hull', name: 'Hull', type: PartType.HULL, cost: 0, damage: 0, computer: 0, shield: 0, hull: 1, initiative: 0, powerUsage: 0, powerGeneration: 0, color: 'text-green-600' },
  { id: 'gauss_shield', name: 'Gauss Shield', type: PartType.SHIELD, cost: 0, damage: 0, computer: 0, shield: 1, hull: 0, initiative: 0, powerUsage: 0, powerGeneration: 0, color: 'text-cyan-400' },
  { id: 'phase_shield', name: 'Phase Shield', type: PartType.SHIELD, cost: 0, damage: 0, computer: 0, shield: 2, hull: 0, initiative: 0, powerUsage: 1, powerGeneration: 0, color: 'text-cyan-500' },

  // Drives
  { id: 'nuclear_drive', name: 'Nuclear Drive', type: PartType.DRIVE, cost: 0, damage: 0, computer: 0, shield: 0, hull: 0, initiative: 1, powerUsage: 1, powerGeneration: 0, color: 'text-purple-300' },
  { id: 'fusion_drive', name: 'Fusion Drive', type: PartType.DRIVE, cost: 0, damage: 0, computer: 0, shield: 0, hull: 0, initiative: 2, powerUsage: 2, powerGeneration: 0, color: 'text-purple-400' },

  // Sources
  { id: 'nuclear_source', name: 'Nuclear Source', type: PartType.SOURCE, cost: 0, damage: 0, computer: 0, shield: 0, hull: 0, initiative: 0, powerUsage: 0, powerGeneration: 3, color: 'text-yellow-600' },
  { id: 'fusion_source', name: 'Fusion Source', type: PartType.SOURCE, cost: 0, damage: 0, computer: 0, shield: 0, hull: 0, initiative: 0, powerUsage: 0, powerGeneration: 6, color: 'text-orange-600' },
  { id: 'tachyon_source', name: 'Tachyon Source', type: PartType.SOURCE, cost: 0, damage: 0, computer: 0, shield: 0, hull: 0, initiative: 0, powerUsage: 0, powerGeneration: 9, color: 'text-pink-600' },
  
  // Reinforced Hull
  { id: 'reinforced_hull', name: 'Reinforced Hull', type: PartType.HULL, cost: 0, damage: 0, computer: 0, shield: 0, hull: 2, initiative: 0, powerUsage: 0, powerGeneration: 0, color: 'text-green-500' },
];

export const TECH_DATABASE: TechTile[] = [
    // --- MILITARY (Pink) ---
    { id: 'neutron_bombs', name: 'Neutron Bombs', category: 'MILITARY', baseCost: 2, minCost: 2, totalCount: 2, iconId: 'bomb', description: 'Destroy Population Cubes automatically.' },
    { id: 'starbase', name: 'Starbase', category: 'MILITARY', baseCost: 4, minCost: 3, totalCount: 4, iconId: 'starbase', description: 'You may Build Starbases.' },
    { id: 'plasma_cannon', name: 'Plasma Cannon', category: 'MILITARY', baseCost: 6, minCost: 4, totalCount: 3, iconId: 'cannon', description: 'Unlock Plasma Cannon Ship Part.' },
    { id: 'phase_shield', name: 'Phase Shield', category: 'MILITARY', baseCost: 8, minCost: 5, totalCount: 3, iconId: 'shield_phase', description: 'Unlock Phase Shield Ship Part.' },
    { id: 'advanced_mining', name: 'Advanced Mining', category: 'MILITARY', baseCost: 10, minCost: 6, totalCount: 3, iconId: 'mining', description: 'Place Pop in Advanced Materials Squares.' },
    { id: 'tachyon_source', name: 'Tachyon Source', category: 'MILITARY', baseCost: 12, minCost: 8, totalCount: 3, iconId: 'source', description: 'Unlock Tachyon Source Ship Part.' },
    { id: 'gluon_computer', name: 'Gluon Computer', category: 'MILITARY', baseCost: 14, minCost: 10, totalCount: 3, iconId: 'computer', description: 'Unlock Gluon Computer Ship Part.' },
    { id: 'plasma_missile', name: 'Plasma Missile', category: 'MILITARY', baseCost: 16, minCost: 12, totalCount: 3, iconId: 'missile', description: 'Unlock Plasma Missile Ship Part.' },

    // --- GRID (Green) ---
    { id: 'gauss_shield', name: 'Gauss Shield', category: 'GRID', baseCost: 2, minCost: 2, totalCount: 3, iconId: 'shield', description: 'Unlock Gauss Shield Ship Part.' },
    { id: 'improved_hull', name: 'Improved Hull', category: 'GRID', baseCost: 4, minCost: 3, totalCount: 3, iconId: 'hull', description: 'Unlock Improved Hull Ship Part.' },
    { id: 'fusion_source', name: 'Fusion Source', category: 'GRID', baseCost: 6, minCost: 4, totalCount: 3, iconId: 'source', description: 'Unlock Fusion Source Ship Part.' },
    { id: 'positron_computer', name: 'Positron Computer', category: 'GRID', baseCost: 8, minCost: 5, totalCount: 3, iconId: 'computer', description: 'Unlock Positron Computer Ship Part.' },
    { id: 'advanced_economy', name: 'Advanced Economy', category: 'GRID', baseCost: 10, minCost: 6, totalCount: 3, iconId: 'money', description: 'Place Pop in Advanced Money Squares.' },
    { id: 'tachyon_drive', name: 'Tachyon Drive', category: 'GRID', baseCost: 12, minCost: 8, totalCount: 3, iconId: 'drive', description: 'Unlock Tachyon Drive Ship Part.' },
    { id: 'antimatter_cannon', name: 'Antimatter Cannon', category: 'GRID', baseCost: 14, minCost: 10, totalCount: 3, iconId: 'cannon', description: 'Unlock Antimatter Cannon Ship Part.' },
    { id: 'quantum_grid', name: 'Quantum Grid', category: 'GRID', baseCost: 16, minCost: 12, totalCount: 3, iconId: 'grid', description: '+2 Influence Discs immediately.' },

    // --- NANO (Yellow) ---
    { id: 'nanorobots', name: 'Nanorobots', category: 'NANO', baseCost: 2, minCost: 2, totalCount: 3, iconId: 'robot', description: '+1 Activation when taking Build Action.' },
    { id: 'fusion_drive', name: 'Fusion Drive', category: 'NANO', baseCost: 4, minCost: 3, totalCount: 3, iconId: 'drive', description: 'Unlock Fusion Drive Ship Part.' },
    { id: 'orbital', name: 'Orbital', category: 'NANO', baseCost: 6, minCost: 4, totalCount: 4, iconId: 'orbital', description: 'You may Build Orbitals.' },
    { id: 'advanced_robotics', name: 'Advanced Robotics', category: 'NANO', baseCost: 8, minCost: 5, totalCount: 3, iconId: 'robot_head', description: '+1 Influence Disc immediately.' },
    { id: 'advanced_labs', name: 'Advanced Labs', category: 'NANO', baseCost: 10, minCost: 6, totalCount: 3, iconId: 'flask', description: 'Place Pop in Advanced Science Squares.' },
    { id: 'monolith', name: 'Monolith', category: 'NANO', baseCost: 12, minCost: 8, totalCount: 3, iconId: 'monolith', description: 'You may Build Monoliths.' },
    { id: 'wormhole_generator', name: 'Wormhole Generator', category: 'NANO', baseCost: 14, minCost: 10, totalCount: 3, iconId: 'wormhole', description: 'Explore/Move through edges without Wormholes.' },
    { id: 'artifact_key', name: 'Artifact Key', category: 'NANO', baseCost: 16, minCost: 12, totalCount: 3, iconId: 'key', description: 'Gain 5 Resources for each Artifact.' },

    // --- RARE (Purple) - All 1 Copy ---
    { id: 'antimatter_splitter', name: 'Antimatter Splitter', category: 'RARE', baseCost: 7, minCost: 5, totalCount: 1, iconId: 'split', description: 'Split Antimatter Cannon damage freely.' },
    { id: 'conifold_field', name: 'Conifold Field', category: 'RARE', baseCost: 5, minCost: 3, totalCount: 1, iconId: 'shield', description: 'Unlock Conifold Field Ship Part.' },
    { id: 'neutron_absorber', name: 'Neutron Absorber', category: 'RARE', baseCost: 7, minCost: 5, totalCount: 1, iconId: 'absorb', description: 'Immune to Neutron Bombs.' },
    { id: 'absorption_shield', name: 'Absorption Shield', category: 'RARE', baseCost: 9, minCost: 6, totalCount: 1, iconId: 'shield', description: 'Unlock Absorption Shield Ship Part.' },
    { id: 'cloaking_device', name: 'Cloaking Device', category: 'RARE', baseCost: 11, minCost: 7, totalCount: 1, iconId: 'eye_off', description: 'Requires 2 ships to Pin you.' },
    { id: 'improved_logistics', name: 'Improved Logistics', category: 'RARE', baseCost: 6, minCost: 4, totalCount: 1, iconId: 'move', description: '+1 Move Activation.' },
    { id: 'sentient_hull', name: 'Sentient Hull', category: 'RARE', baseCost: 7, minCost: 5, totalCount: 1, iconId: 'hull_brain', description: 'Unlock Sentient Hull Ship Part.' },
    { id: 'soliton_cannon_tech', name: 'Soliton Cannon', category: 'RARE', baseCost: 12, minCost: 8, totalCount: 1, iconId: 'cannon', description: 'Unlock Soliton Cannon Ship Part.' },
    { id: 'transition_drive', name: 'Transition Drive', category: 'RARE', baseCost: 5, minCost: 3, totalCount: 1, iconId: 'drive', description: 'Unlock Transition Drive Ship Part.' },
    { id: 'warp_portal', name: 'Warp Portal', category: 'RARE', baseCost: 7, minCost: 5, totalCount: 1, iconId: 'portal', description: 'Place Warp Portal Tile.' },
    { id: 'flux_missile', name: 'Flux Missile', category: 'RARE', baseCost: 15, minCost: 11, totalCount: 1, iconId: 'missile', description: 'Unlock Flux Missile Ship Part.' },
    { id: 'pico_modulator', name: 'Pico Modulator', category: 'RARE', baseCost: 9, minCost: 6, totalCount: 1, iconId: 'upgrade', description: '+2 Upgrade Activations.' },
    { id: 'ancient_labs', name: 'Ancient Labs', category: 'RARE', baseCost: 6, minCost: 4, totalCount: 1, iconId: 'flask_ancient', description: 'Draw one Discovery Tile immediately.' },
    { id: 'zero_point_source', name: 'Zero-Point Source', category: 'RARE', baseCost: 16, minCost: 12, totalCount: 1, iconId: 'source', description: 'Unlock Zero-Point Source Ship Part.' },
    { id: 'metasynthesis', name: 'Metasynthesis', category: 'RARE', baseCost: 14, minCost: 10, totalCount: 1, iconId: 'dna', description: 'Colonize any Advanced Pop Square.' },
];

export const DEFAULT_INTERCEPTOR: Blueprint = {
  shipType: 'Interceptor',
  baseCost: 3,
  baseInitiative: 2,
  slots: [PartType.EMPTY, PartType.EMPTY, PartType.EMPTY, PartType.EMPTY],
  equipped: [
    SHIP_PARTS.find(p => p.id === 'ion_cannon') || null,      
    null,                                                     
    SHIP_PARTS.find(p => p.id === 'nuclear_source') || null,  
    SHIP_PARTS.find(p => p.id === 'nuclear_drive') || null    
  ]
};

export const DEFAULT_CRUISER: Blueprint = {
  shipType: 'Cruiser',
  baseCost: 5,
  baseInitiative: 1,
  slots: [PartType.EMPTY, PartType.EMPTY, PartType.EMPTY, PartType.EMPTY, PartType.EMPTY, PartType.EMPTY],
  equipped: [
    SHIP_PARTS.find(p => p.id === 'electron_comp') || null,
    SHIP_PARTS.find(p => p.id === 'ion_cannon') || null,
    null, 
    SHIP_PARTS.find(p => p.id === 'hull') || null,
    SHIP_PARTS.find(p => p.id === 'nuclear_source') || null,
    SHIP_PARTS.find(p => p.id === 'nuclear_drive') || null
  ]
};

export const DEFAULT_DREADNOUGHT: Blueprint = {
  shipType: 'Dreadnought',
  baseCost: 8,
  baseInitiative: 0,
  slots: [PartType.EMPTY, PartType.EMPTY, PartType.EMPTY, PartType.EMPTY, PartType.EMPTY, PartType.EMPTY, PartType.EMPTY, PartType.EMPTY],
  equipped: [
    SHIP_PARTS.find(p => p.id === 'electron_comp') || null,
    SHIP_PARTS.find(p => p.id === 'ion_cannon') || null,
    SHIP_PARTS.find(p => p.id === 'ion_cannon') || null,
    null, 
    SHIP_PARTS.find(p => p.id === 'hull') || null,
    SHIP_PARTS.find(p => p.id === 'hull') || null,
    SHIP_PARTS.find(p => p.id === 'nuclear_source') || null,
    SHIP_PARTS.find(p => p.id === 'nuclear_drive') || null
  ]
};

// Starbase Configuration
// Cost: 3, Initiative: 4, Base Power: 3
// Slots: 4 (Comp, Cannon, Hull, Hull)
export const DEFAULT_STARBASE: Blueprint = {
  shipType: 'Starbase',
  baseCost: 3,
  baseInitiative: 4,
  basePowerGeneration: 3,
  slots: [PartType.EMPTY, PartType.EMPTY, PartType.EMPTY, PartType.EMPTY],
  equipped: [
    SHIP_PARTS.find(p => p.id === 'electron_comp') || null,
    SHIP_PARTS.find(p => p.id === 'ion_cannon') || null,
    SHIP_PARTS.find(p => p.id === 'hull') || null,
    SHIP_PARTS.find(p => p.id === 'hull') || null
  ]
};