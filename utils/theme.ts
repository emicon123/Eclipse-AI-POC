// Centralized theme configuration to ensure consistency across the app

export const THEME_STYLES: Record<string, { 
    text: string, 
    border: string, 
    bg: string, 
    shadow: string, 
    hoverBorder: string 
}> = {
    'white': { text: 'text-white', border: 'border-white', bg: 'bg-white/10', shadow: 'shadow-white/40', hoverBorder: 'hover:border-white' },
    'black': { text: 'text-zinc-400', border: 'border-zinc-500', bg: 'bg-zinc-500/10', shadow: 'shadow-zinc-500/40', hoverBorder: 'hover:border-zinc-400' },
    'green': { text: 'text-green-500', border: 'border-green-500', bg: 'bg-green-500/10', shadow: 'shadow-green-500/40', hoverBorder: 'hover:border-green-500' },
    'blue': { text: 'text-blue-500', border: 'border-blue-500', bg: 'bg-blue-500/10', shadow: 'shadow-blue-500/40', hoverBorder: 'hover:border-blue-500' },
    'yellow': { text: 'text-yellow-500', border: 'border-yellow-500', bg: 'bg-yellow-500/10', shadow: 'shadow-yellow-500/40', hoverBorder: 'hover:border-yellow-500' },
    'red': { text: 'text-red-500', border: 'border-red-500', bg: 'bg-red-500/10', shadow: 'shadow-red-500/40', hoverBorder: 'hover:border-red-500' },
};

export const getDiscStyles = (color: string) => {
    switch(color) {
        case 'white': return 'from-slate-100 to-slate-400 border-white';
        case 'black': return 'from-zinc-600 to-zinc-900 border-zinc-400';
        case 'green': return 'from-green-500 to-green-900 border-green-400';
        case 'blue': return 'from-blue-500 to-blue-900 border-blue-400';
        case 'yellow': return 'from-yellow-400 to-yellow-700 border-yellow-300';
        case 'red': return 'from-red-500 to-red-900 border-red-400';
        default: return 'from-blue-500 to-blue-900 border-blue-400';
    }
};

export const getDiscStylesTransparent = (color: string) => {
     switch(color) {
        case 'white': return 'from-slate-100/90 to-slate-400/90 border-white/60';
        case 'black': return 'from-zinc-600/90 to-zinc-900/90 border-zinc-400/60';
        case 'green': return 'from-green-500/90 to-green-900/90 border-green-400/60';
        case 'blue': return 'from-blue-500/90 to-blue-900/90 border-blue-400/60';
        case 'yellow': return 'from-yellow-400/90 to-yellow-700/90 border-yellow-300/60';
        case 'red': return 'from-red-500/90 to-red-900/90 border-red-400/60';
        default: return 'from-blue-500/90 to-blue-900/90 border-blue-400/60';
    }
}