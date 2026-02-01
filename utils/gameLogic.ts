
import { Blueprint, ShipStats, PartType, ShipPart, SectorData, PopulationSlot, ResourceType } from '../types/index';
import { DISCOVERY_TILES, SHIP_PARTS, POPULATION_TRACK } from '../constants/index';

// --- CONSTANTS FOR MAP GEN ---
const NEIGHBOR_DIRS = [
    {q: 0, r: -1},  // 0: Top
    {q: 1, r: -1},  // 1: TR
    {q: 1, r: 0},   // 2: BR
    {q: 0, r: 1},   // 3: Bottom
    {q: -1, r: 1},  // 4: BL
    {q: -1, r: 0}   // 5: TL
];

const RING_II_SLOTS = [
    { q: 0, r: -2, id: 201 }, // 0: Top
    { q: 2, r: -2, id: 202 }, // 1: Top Right
    { q: 2, r: 0, id: 203 },  // 2: Bottom Right
    { q: 0, r: 2, id: 204 },  // 3: Bottom
    { q: -2, r: 2, id: 205 }, // 4: Bottom Left
    { q: -2, r: 0, id: 206 }  // 5: Top Left
];

// --- SHIP CALCULATIONS ---
export const calculateStats = (blueprint: Blueprint): ShipStats => {
  let cost = blueprint.baseCost;
  let damage = 0;
  let computer = 0;
  let shield = 0;
  let hull = 1; 
  let initiative = blueprint.baseInitiative;
  let movement = 0;
  let powerUsage = 0;
  let powerGeneration = blueprint.basePowerGeneration || 0; 
  let driveCount = 0;

  blueprint.equipped.forEach(part => {
    if (part) {
      cost += part.cost;
      damage += part.damage;
      computer += part.computer;
      shield += part.shield;
      hull += part.hull;
      initiative += part.initiative;
      powerUsage += part.powerUsage;
      powerGeneration += part.powerGeneration;
      
      if (part.type === PartType.DRIVE) {
          movement += part.initiative; 
          driveCount++;
      }
    }
  });

  const powerBalance = powerGeneration - powerUsage;
  const errors: string[] = [];

  if (powerBalance < 0) {
      errors.push("Power Consumption exceeds Production.");
  }

  if (blueprint.shipType === 'Starbase') {
      if (driveCount > 0) {
          errors.push("Starbases cannot equip Drives.");
      }
  }

  return {
    cost,
    damage,
    computer,
    shield,
    hull,
    initiative,
    movement,
    powerBalance,
    isValid: errors.length === 0,
    errors
  };
};

export const hasRequiredTech = (part: ShipPart, playerTechIds: string[]): boolean => {
    if (part.isRare) return true; // Rare parts (from discovery) don't need tech tracks
    if (!part.requiredTechId) return true;
    return playerTechIds.includes(part.requiredTechId);
};

export const canEquipPartOnShip = (part: ShipPart, shipType: string): boolean => {
    if (shipType === 'Starbase' && part.type === PartType.DRIVE) return false;
    return true;
};

// --- MAP & EXPLORATION LOGIC ---

// Helper to determine start sector wormholes based on "One to Center, One Away, and One to the Right of each"
const getStartWormholes = (q: number, r: number): boolean[] => {
    // 1. Find direction TO Center (0,0)
    // The neighbor that gets us closer to 0,0.
    // Since we are at q,r, we want -q, -r direction approximately.
    // Actually, simple way: iterate neighbors, find which one reduces distance.
    const currentDist = Math.max(Math.abs(q), Math.abs(r), Math.abs(-q-r));
    let dirToCenterIndex = -1;

    for(let i=0; i<6; i++) {
        const n = NEIGHBOR_DIRS[i];
        const nDist = Math.max(Math.abs(q + n.q), Math.abs(r + n.r), Math.abs(-(q+n.q)-(r+n.r)));
        if (nDist < currentDist) {
            dirToCenterIndex = i;
            break;
        }
    }

    const wormholes = [false, false, false, false, false, false];
    
    if (dirToCenterIndex !== -1) {
        // 1. Towards Center
        wormholes[dirToCenterIndex] = true;
        // 2. Right of Towards Center (Clockwise +1)
        wormholes[(dirToCenterIndex + 1) % 6] = true;

        // 3. Away from Center (Opposite)
        const dirAwayIndex = (dirToCenterIndex + 3) % 6;
        wormholes[dirAwayIndex] = true;
        // 4. Right of Away (Clockwise +1)
        wormholes[(dirAwayIndex + 1) % 6] = true;
    }

    return wormholes;
};

export const generateSector = (ring: number, q: number, r: number): SectorData => {
    const id = Math.floor(Math.random() * 899) + 100;
    
    let ancients = 0;
    let hasDiscovery = false;
    let wormholes = [false, false, false, false, false, false];
    let slots: PopulationSlot[] = [];

    // Helper for random pop slots
    const addSlots = (count: number, advProb = 0.1) => {
        for(let i=0; i<count; i++) {
            const rand = Math.random();
            const type = rand > 0.6 ? 'materials' : rand > 0.3 ? 'science' : 'money';
            slots.push({
                id: `slot_${id}_${i}`,
                type: type as ResourceType,
                status: 'EMPTY',
                isAdvanced: Math.random() < advProb
            });
        }
    };

    if (ring === 1) {
        // Ring I
        wormholes = [true, true, true, true, true, true]; 
        if (Math.random() > 0.8) wormholes[Math.floor(Math.random()*6)] = false; 
        if (Math.random() > 0.9) ancients = 1; 
        addSlots(Math.floor(Math.random() * 2) + 1); 
    } else if (ring === 2) {
        // Ring II
        const holeCount = Math.floor(Math.random() * 3) + 2;
        for(let i=0; i<holeCount; i++) wormholes[Math.floor(Math.random()*6)] = true;
        
        if (Math.random() > 0.7) ancients = Math.floor(Math.random() * 2) + 1;
        if (Math.random() > 0.8) hasDiscovery = true;
        addSlots(Math.floor(Math.random() * 2) + 2); 
    } else {
        // Ring III
        const holeCount = Math.floor(Math.random() * 3) + 1;
        for(let i=0; i<holeCount; i++) wormholes[Math.floor(Math.random()*6)] = true;

        if (Math.random() > 0.5) ancients = Math.floor(Math.random() * 2) + 1;
        hasDiscovery = true;
        // Ring 3 usually has standard slots too
        addSlots(Math.floor(Math.random() * 3) + 2, 0.3); 
    }

    // Ensure at least 1 wormhole
    if (!wormholes.includes(true)) wormholes[0] = true;

    // Normal sectors (NEUTRAL) should have population slots (Requirement Fix)
    // Logic above calls addSlots for all rings, so Neutrals get them automatically unless we explicitly clear them.
    // The previous bug might have been in how they were rendered or specific condition logic.

    return {
        id,
        q, r,
        type: ancients > 0 ? 'GUARDIAN' : 'NEUTRAL',
        ring,
        isExplored: true,
        rotation: 0,
        wormholes,
        ancients,
        hasDiscoveryTile: hasDiscovery || (ancients > 0),
        claimedDiscovery: false,
        populationSlots: slots,
        ships: []
    };
};

export const generateMapLayout = (activeColors: string[]) => {
    const newSectors: SectorData[] = [
        { 
            id: '001', 
            q: 0, 
            r: 0, 
            type: 'CENTER', 
            ring: 0, 
            isExplored: true,
            rotation: 0,
            wormholes: [true, true, true, true, true, true],
            ancients: 1, 
            hasDiscoveryTile: true,
            ships: [],
            populationSlots: [
                 { id: `center_1`, type: 'money', status: 'EMPTY', isAdvanced: true },
                 { id: `center_2`, type: 'science', status: 'EMPTY', isAdvanced: true },
                 { id: `center_3`, type: 'materials', status: 'EMPTY', isAdvanced: true },
                 { id: `center_4`, type: 'money', status: 'EMPTY', isAdvanced: true }
            ]
        }
    ];

    let startIndices: number[] = [];
    const count = activeColors.length;

    switch (count) {
        case 1: startIndices = [0]; break;
        case 2: startIndices = [0, 3]; break;
        case 3: startIndices = [0, 2, 4]; break;
        case 4: startIndices = [0, 1, 3, 4]; break;
        case 5: startIndices = [0, 1, 2, 3, 4]; break;
        case 6: startIndices = [0, 1, 2, 3, 4, 5]; break;
        default: startIndices = [0];
    }

    let colorIdx = 0;
    
    // Fill Ring II
    RING_II_SLOTS.forEach((slot, index) => {
        if (startIndices.includes(index)) {
            const playerColor = activeColors[colorIdx];
            
            // Generate Start Wormholes based on requirement
            const startWormholes = getStartWormholes(slot.q, slot.r);

            newSectors.push({
                ...slot,
                type: 'START',
                ring: 2,
                playerColor: playerColor,
                isExplored: true,
                rotation: 0,
                wormholes: startWormholes,
                ancients: 0,
                hasDiscoveryTile: false,
                ships: [
                    { id: `start_ship_${index}`, type: 'Interceptor', owner: playerColor }
                ],
                // Starting sectors have 1 of each slot typically
                populationSlots: [
                    { id: `start_${index}_1`, type: 'money', status: 'EMPTY', isAdvanced: false },
                    { id: `start_${index}_2`, type: 'science', status: 'EMPTY', isAdvanced: false },
                    { id: `start_${index}_3`, type: 'materials', status: 'EMPTY', isAdvanced: false },
                ]
            });
            colorIdx++;
        } else {
            // Unoccupied Ring II slots are Guardians
            newSectors.push({
                ...slot,
                type: 'GUARDIAN',
                ring: 2,
                isExplored: true,
                rotation: 0,
                wormholes: [true, true, true, false, false, false],
                ancients: 1,
                hasDiscoveryTile: true,
                ships: [],
                populationSlots: [
                    { id: `guard_${index}_1`, type: 'money', status: 'EMPTY', isAdvanced: false },
                    { id: `guard_${index}_2`, type: 'materials', status: 'EMPTY', isAdvanced: false },
                ]
            });
        }
    });
    return newSectors;
};

export const drawDiscoveryTile = () => {
    return DISCOVERY_TILES[Math.floor(Math.random() * DISCOVERY_TILES.length)];
};

export const calculateIncome = (cubesOnTrack: number) => {
      const revealedCount = POPULATION_TRACK.length - cubesOnTrack;
      if (revealedCount <= 0) return 0;
      return POPULATION_TRACK[revealedCount - 1];
};
