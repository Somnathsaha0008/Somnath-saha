import React from 'react';

const TwoWheelerIcon: React.FC = () => (
    <div className="relative w-6 h-5 flex items-center justify-center" aria-label="Delivery rider icon">
        <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body */}
            <path d="M4 16H2V11L4 9H10L12 11H20V16H18" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Wheels */}
            <circle cx="6" cy="16" r="3" fill="#4B5563" stroke="#FBBF24" strokeWidth="1.5"/>
            <circle cx="16" cy="16" r="3" fill="#4B5563" stroke="#FBBF24" strokeWidth="1.5"/>
            {/* Rider */}
            <path d="M10 9L8 4H11L13 9" stroke="#F9FAFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9.5" cy="2.5" r="1.5" fill="#F9FAFB" stroke="#FBBF24" strokeWidth="1"/>
            {/* Delivery Box */}
            <rect x="15" y="5" width="6" height="6" rx="1" fill="#FBBF24" stroke="#111827" strokeWidth="1"/>
        </svg>
    </div>
);

export default TwoWheelerIcon;
