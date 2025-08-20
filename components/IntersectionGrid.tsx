import React from 'react';
import AmbulanceIcon from './icons/AmbulanceIcon';

type SimulationStatus = 'idle' | 'detecting' | 'calculating' | 'clearing' | 'en_route' | 'cleared' | 'resuming';

interface IntersectionGridProps {
    status: SimulationStatus;
    progress: number;
}

const GRID_SIZE = 4;
// Path goes from bottom to top in the first column
const EMERGENCY_PATH = [
    { row: 3, col: 0 },
    { row: 2, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: 0 },
];

const Light: React.FC<{ color: 'red' | 'green' | 'off', pulse?: boolean }> = ({ color, pulse }) => {
    const colorClass = {
        red: 'bg-red-500 shadow-[0_0_4px_1px_rgba(239,68,68,0.7)]',
        green: 'bg-green-400 shadow-[0_0_4px_1px_rgba(52,211,153,0.7)]',
        off: 'bg-gray-700',
    }[color];
    const pulseClass = pulse ? (color === 'green' ? 'animate-pulse-green' : 'animate-pulse-red') : '';
    return <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${colorClass} ${pulseClass}`} />;
};

const Intersection: React.FC<{
    isPath: boolean;
    pathIndex: number;
    status: SimulationStatus;
}> = ({ isPath, pathIndex, status }) => {
    
    let verticalLight: 'red' | 'green' | 'off' = 'red';
    let horizontalLight: 'red' | 'green' | 'off' = 'green';

    if (status === 'idle' || status === 'detecting') {
         // show some normal traffic
         verticalLight = 'red';
         horizontalLight = 'green';
    } else if (status === 'calculating') {
        verticalLight = 'red';
        horizontalLight = 'red';
    } else if (status === 'clearing' || status === 'en_route' || status === 'cleared') {
        if(isPath) {
            verticalLight = 'green';
            horizontalLight = 'red';
        } else {
            verticalLight = 'red';
            horizontalLight = 'red';
        }
    } else if (status === 'resuming') {
        verticalLight = 'red';
        horizontalLight = 'green';
    }
    
    const waveDelay = isPath ? `${pathIndex * 150}ms` : '0ms';
    const isClearing = status === 'clearing' && isPath;
    
    return (
        <div className="relative w-12 h-12 bg-gray-800/50 rounded-md flex items-center justify-center transition-all duration-500"
             style={{ transitionDelay: waveDelay }}>
            <div className={`absolute top-1/2 -translate-y-1/2 h-full w-2.5 ${isClearing ? 'bg-green-500/10' : ''} transition-colors duration-500`}></div>
            <div className="flex flex-col items-center space-y-2.5">
                <Light color={verticalLight} pulse={isPath && status === 'en_route'} />
                <div className="flex items-center space-x-2.5">
                    <Light color={horizontalLight} />
                    <div className="w-2.5 h-2.5 bg-gray-900 rounded-sm"></div>
                    <Light color={horizontalLight} />
                </div>
                <Light color={verticalLight} pulse={isPath && status === 'en_route'} />
            </div>
        </div>
    );
};


const IntersectionGrid: React.FC<IntersectionGridProps> = ({ status, progress }) => {
    const grid = Array.from({ length: GRID_SIZE }, (_, row) =>
        Array.from({ length: GRID_SIZE }, (_, col) => {
            const pathIndex = EMERGENCY_PATH.findIndex(p => p.row === row && p.col === col);
            return {
                isPath: pathIndex !== -1,
                pathIndex: pathIndex,
            };
        })
    );

    const segmentLength = 100 / (EMERGENCY_PATH.length - 1);
    const currentSegmentIndex = Math.min(Math.floor(progress / segmentLength), EMERGENCY_PATH.length - 2);
    const segmentProgress = (progress % segmentLength) / segmentLength;

    const startPos = EMERGENCY_PATH[currentSegmentIndex];
    const endPos = EMERGENCY_PATH[currentSegmentIndex + 1];
    
    let top = 0, left = 0;
    if (startPos && endPos) {
        const startTop = startPos.row * 3.5 + 1.75;
        const startLeft = startPos.col * 3.5 + 1.75;
        const endTop = endPos.row * 3.5 + 1.75;
        const endLeft = endPos.col * 3.5 + 1.75;

        top = startTop + (endTop - startTop) * segmentProgress;
        left = startLeft + (endLeft - startLeft) * segmentProgress;
    }

    const showVehicle = status === 'en_route' && progress < 100;
    
    return (
        <div className="relative p-4 bg-black/30 rounded-lg border border-gray-700 aspect-square max-w-sm mx-auto">
            <div className="grid grid-cols-4 gap-2">
                {grid.flat().map((cell, index) => (
                    <Intersection 
                        key={index} 
                        isPath={cell.isPath}
                        pathIndex={cell.pathIndex}
                        status={status}
                    />
                ))}
            </div>
            {showVehicle && (
                 <div className="absolute top-0 left-0 transition-transform duration-100 ease-linear"
                      style={{ 
                          transform: `translate(${left}rem, ${top}rem) translate(-50%, -50%)`,
                      }}>
                    <AmbulanceIcon />
                 </div>
            )}
        </div>
    );
};

export default IntersectionGrid;
