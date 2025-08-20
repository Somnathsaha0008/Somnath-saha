
import React from 'react';

const iconClass = "w-6 h-6";

export const LeafIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.879A6 6 0 012.121 3.879m7.53 12.422A6.004 6.004 0 0012 21a6.002 6.002 0 005.364-8.121" />
    </svg>
);

export const ClockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const CarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 14h12M6 18h12" />
    </svg>
);

export const AlertIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

export const SirenIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M6.25 9.375c.968-.968 2.24-1.563 3.594-1.563s2.626.595 3.594 1.563m-7.188 0c-.09.34-.14.69-.14 1.047 0 .356.05.706.14 1.047m7.188 0c.09-.34.14-.69.14-1.047 0-.356-.05-.706-.14-1.047m-7.188 0l-3.375-3.375m3.375 3.375L4 12.125m2.25 0L3 15.5m3.25-6.125l-2.625 4.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a8.25 8.25 0 004.243-1.272.75.75 0 00.395-1.076 8.25 8.25 0 00-8.276 0 .75.75 0 00.395 1.076A8.25 8.25 0 0012 21z" />
        <path d="M17.75 9.375c-.968-.968-2.24-1.563-3.594-1.563s-2.626.595-3.594 1.563m7.188 0c.09.34.14.69.14 1.047 0 .356-.05.706-.14-1.047m-7.188 0c-.09-.34-.14-.69-.14-1.047 0 .356.05.706.14 1.047m-7.188 0l3.375-3.375M17.75 9.375L20 12.125m-2.25 0L21 15.5m-3.25-6.125l2.625 4.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75v1.5" />
    </svg>
);
