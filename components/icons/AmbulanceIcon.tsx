import React from 'react';

const AmbulanceIcon: React.FC = () => (
    <div className="relative w-6 h-6 flex items-center justify-center rounded-md bg-white/90 shadow-lg shadow-brand-green/50">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-1.5 bg-red-500 rounded-sm animate-pulse-red border border-red-300/50"></div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
    </div>
);

export default AmbulanceIcon;
