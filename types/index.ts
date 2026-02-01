
export enum PartType {
  CANNON = 'Cannon',
  MISSILE = 'Missile',
  COMPUTER = 'Computer',
  SHIELD = 'Shield',
  HULL = 'Hull',
  DRIVE = 'Drive',
  SOURCE = 'Source',
  INITIATIVE = 'Initiative',
  EMPTY = 'Empty'
}

export interface ShipPart {
  id: string;
  name: string;
  type: PartType;
  cost: number; // Material cost
  damage: number;
  computer: number; // Hit bonus
  shield: number; // Hit penalty to enemy
  hull: number;
  initiative: number;
  powerUsage: number;
  powerGeneration: number;
  isRare?: boolean;
  color: string;
  requiredTechId?: string; // ID of the tech required to equip this part
}

export interface ShipStats {
  cost: number;
  damage: number;
  computer: number;
  shield: number;
  hull: number;
  initiative: number;
  movement: number; // New movement stat
  powerBalance: number; // Generation - Usage
  isValid: boolean;
  errors: string[]; // List of validation errors
}

export interface Blueprint {
  shipType: 'Interceptor' | 'Cruiser' | 'Dreadnought' | 'Starbase';
  baseInitiative: number;
  baseCost: number;
  basePowerGeneration?: number; // For Starbase fixed power
  slots: PartType[]; // Allowed types per slot usually, simplified here to just list of slots
  equipped: (ShipPart | null)[];
}

export interface SimResult {
  name: string;
  winRate: number;
  avgDamage: number;
}

export type PlayerAction = 'EXPLORE' | 'RESEARCH' | 'UPGRADE' | 'BUILD' | 'MOVE' | 'INFLUENCE';

export interface DiscoveryReward {
    id: string;
    label: string;
    description: string;
    type: 'RESOURCE' | 'TECH' | 'PART' | 'STRUCTURE' | 'VP';
}

export type ResourceType = 'money' | 'science' | 'materials';

export interface PopulationSlot {
    id: string;
    type: ResourceType;
    status: 'EMPTY' | 'OCCUPIED' | 'DESTROYED'; 
    isAdvanced?: boolean; // Requires specific tech
}

export interface ShipOnMap {
    id: string; // Unique ID for keying
    type: 'Interceptor' | 'Cruiser' | 'Dreadnought' | 'Starbase';
    owner: string; // Player color
    isDamaged?: boolean;
}

export interface SectorData {
  id: number | string;
  q: number;
  r: number;
  type: 'CENTER' | 'START' | 'GUARDIAN' | 'NEUTRAL' | 'EMPTY_ZONE';
  ring: number; 
  playerColor?: string;
  isExplored: boolean;
  
  // Exploration Data
  rotation: number; // 0-5, rotates wormholes
  wormholes: boolean[]; // Array of 6 booleans, index 0 is Top edge, clockwise
  ancients: number; // Count of ancients
  hasDiscoveryTile: boolean; // Is there a tile to claim?
  claimedDiscovery?: boolean; // Has the tile been claimed (if ancients are dead)?
  
  // Economy
  populationSlots: PopulationSlot[];
  ships: ShipOnMap[];
}

export interface PlayerResources {
    money: number;
    science: number;
    materials: number;
}

export type TechCategory = 'MILITARY' | 'GRID' | 'NANO' | 'RARE';

export interface TechTile {
    id: string;
    name: string;
    category: TechCategory;
    baseCost: number; // White number (Base cost)
    minCost: number;  // Black number (Minimum cost)
    description: string;
    totalCount: number; // Total copies in the game box
    iconId: string; // ID for mapping to Lucide icon
}

export interface ResearchTrayState {
    military: TechTile[];
    grid: TechTile[];
    nano: TechTile[];
    rare: TechTile[];
}

export interface PlayerState {
    color: string;
    resources: {
        current: PlayerResources;
        income: PlayerResources;
        max: number; 
    };
    // Track how many cubes are SITTING on the TRACK (available to be moved to map)
    population: {
        money: number;
        science: number;
        materials: number;
        graveyard: {
            money: number;
            science: number;
            materials: number;
        }
    };
    colonyShips: {
        total: number;
        used: number;
    };
    blueprints: {
        Interceptor: Blueprint;
        Cruiser: Blueprint;
        Dreadnought: Blueprint;
        Starbase: Blueprint;
    };
    techs: {
        military: TechTile[];
        grid: TechTile[];
        nano: TechTile[];
    };
    discs: {
        total: number;
        map: number; // Discs controlling sectors
        actions: Record<PlayerAction, number>; // Discs on action spots
    };
}
