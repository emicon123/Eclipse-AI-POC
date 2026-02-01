
export const HEX_SIZE = 60;
export const HEX_WIDTH = HEX_SIZE * 2;
export const HEX_HEIGHT = HEX_SIZE * Math.sqrt(3);

export const NEIGHBOR_DIRS = [
    {q: 0, r: -1},  // 0: Top
    {q: 1, r: -1},  // 1: TR
    {q: 1, r: 0},   // 2: BR
    {q: 0, r: 1},   // 3: Bottom
    {q: -1, r: 1},  // 4: BL
    {q: -1, r: 0}   // 5: TL
];

export const hexToPixel = (q: number, r: number) => {
  const x = (3 / 2) * q * HEX_SIZE;
  const y = ((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r) * HEX_SIZE;
  return { x, y };
};

export const getRing = (q: number, r: number): number => {
  return Math.max(Math.abs(q), Math.abs(r), Math.abs(-q - r));
};

export const toRoman = (num: number) => {
    if (num === 1) return 'I';
    if (num === 2) return 'II';
    if (num === 3) return 'III';
    if (num > 3) return 'III+';
    return '';
};

export const getOppositeEdge = (edge: number) => (edge + 3) % 6;
