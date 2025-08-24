import React from 'react';

const DeliveryTruckIcon: React.FC = () => (
    <div className="relative w-7 h-5 flex items-center justify-center rounded-sm bg-yellow-400 shadow-lg shadow-yellow-500/20">
        <div className="w-2 h-2 rounded-full bg-gray-800 border border-gray-900 absolute -bottom-1 left-1"></div>
        <div className="w-2 h-2 rounded-full bg-gray-800 border border-gray-900 absolute -bottom-1 right-1.5"></div>
        <div className="absolute top-1 left-1 w-2 h-3 bg-yellow-300/80 rounded-sm"></div>
    </div>
);

export default DeliveryTruckIcon;
