
import React from 'react';

export const GuardianShipIcon = ({ size = 24, className = "" }: {size?: number, className?: string}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 2L13.5 6L16 6.5L19 9L21 9L19 11L14.5 13V18L16.5 20L16.5 22H7.5L7.5 20L9.5 18V13L5 11L3 9L5 9L8 6.5L10.5 6L12 2Z" strokeWidth="0" />
    </svg>
);

export const InterceptorIcon = ({ size = 20, className = "" }: {size?: number, className?: string}) => (
     <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
         <path d="M12 2L15 8L20 9L15 14L16 20L12 17L8 20L9 14L4 9L9 8L12 2Z" strokeWidth="0" />
     </svg>
);

export const GCDSIcon = ({ size = 32, className = "" }: {size?: number, className?: string}) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g filter="url(#glow)">
            <path d="M12 30L10 35H30L28 30H12Z" fill="#64748b" stroke="#cbd5e1" strokeWidth="1"/>
            <path d="M6 26C6 24 20 22 20 22C20 22 34 24 34 26C34 28 20 30 20 30C20 30 6 28 6 26Z" fill="#475569" stroke="#94a3b8" strokeWidth="1"/>
            <rect x="8" y="26" width="4" height="2" fill="#3b82f6" />
            <rect x="28" y="26" width="4" height="2" fill="#3b82f6" />
            <rect x="14" y="16" width="12" height="10" fill="#334155" />
            <path d="M4 18C4 15 20 13 20 13C20 13 36 15 36 18C36 21 20 23 20 23C20 23 4 21 4 18Z" fill="#94a3b8" stroke="#e2e8f0" strokeWidth="1"/>
            <circle cx="10" cy="18" r="1.5" fill="#ef4444" />
            <circle cx="30" cy="18" r="1.5" fill="#ef4444" />
            <circle cx="20" cy="23" r="1.5" fill="#ef4444" />
            <path d="M8 16Q20 6 32 16" fill="#cbd5e1" stroke="#475569" />
            <rect x="16" y="8" width="2" height="6" fill="#64748b" />
            <rect x="22" y="8" width="2" height="6" fill="#64748b" />
            <rect x="19" y="6" width="2" height="8" fill="#94a3b8" />
            <rect x="19" y="6" width="2" height="1" fill="#fbbf24" /> 
        </g>
        <defs>
            <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
    </svg>
);
