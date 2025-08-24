import React from 'react';
import TwoWheelerIcon from './icons/TwoWheelerIcon';

type SimulationStatus = 'idle' | 'detecting' | 'optimizing' | 'active' | 'completed' | 'resuming';

interface LogisticsGridProps {
    status: SimulationStatus;
    progress: number;
}

const GRID_ROWS = 2;
const GRID_COLS = 4;
const CORRIDOR_ROW = 0;

const Light: React.FC<{ color: 'red' | 'green' | 'yellow' | 'off' }> = ({ color }) => {
    const colorClass = {
        red: 'bg-red-500 shadow-[0_0_4px_1px_rgba(239,68,68,0.7)]',
        green: 'bg-green-400 shadow-[0_0_4px_1px_rgba(52,211,153,0.7)]',
        yellow: 'bg-yellow-400 shadow-[0_0_4px_1px_rgba(250,204,21,0.7)]',
        off: 'bg-gray-700',
    }[color];
    return <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${colorClass}`} />;
};

const Intersection: React.FC<{
    isCorridor: boolean;
    colIndex: number;
    status: SimulationStatus;
}> = ({ isCorridor, colIndex, status }) => {
    
    let verticalLight: 'red' | 'green' | 'yellow' | 'off' = 'red';
    let horizontalLight: 'red' | 'green' | 'yellow' | 'off' = 'green';

    if (status === 'idle' || status === 'resuming') {
        verticalLight = (colIndex % 2 === 0) ? 'red' : 'green';
        horizontalLight = (colIndex % 2 === 0) ? 'green' : 'red';
    } else if (status === 'detecting' || status === 'optimizing') {
        verticalLight = 'red';
        horizontalLight = 'yellow';
    } else if (status === 'active' || status === 'completed') {
        if (isCorridor) {
            verticalLight = 'red';
            horizontalLight = 'green';
        } else {
            verticalLight = 'green';
            horizontalLight = 'red';
        }
    }
    
    const waveDelay = isCorridor ? `${colIndex * 150}ms` : '0ms';
    const isOptimizing = status === 'optimizing' && isCorridor;
    
    return (
        <div className={`relative w-16 h-16 bg-gray-800/50 rounded-md flex items-center justify-center transition-all duration-500`}
             style={{ transitionDelay: waveDelay }}>
             <div className={`absolute w-full h-4 bg-gray-900/50 transition-all duration-500 ${isCorridor && (status === 'active' || status === 'optimizing') ? 'bg-yellow-500/10' : ''}`}>
                {isCorridor && status === 'optimizing' && <div className="w-full h-full bg-yellow-400/20 animate-pulse"></div>}
             </div>
             <div className="absolute h-full w-4 bg-gray-900/50"></div>
            <div className="relative w-6 h-6 bg-gray-800 rounded-sm flex items-center justify-center">
                 <div className="absolute -top-3"><Light color={verticalLight} /></div>
                 <div className="absolute -bottom-3"><Light color={verticalLight} /></div>
                 <div className="absolute -left-3"><Light color={horizontalLight} /></div>
                 <div className="absolute -right-3"><Light color={horizontalLight} /></div>
            </div>
        </div>
    );
};


const LogisticsGrid: React.FC<LogisticsGridProps> = ({ status, progress }) => {
    const grid = Array.from({ length: GRID_ROWS }, (_, row) =>
        Array.from({ length: GRID_COLS }, (_, col) => ({
            isCorridor: row === CORRIDOR_ROW,
        }))
    );

    const riderPositions = [0, 15, 30, 45, 60, 75, 90, 105].map(start => (start + progress) % 125 - 10);
    const showRiders = status === 'active';

    return (
        <div className="relative p-4 bg-black/30 rounded-lg border border-gray-700 max-w-sm mx-auto overflow-hidden">
            <div className="grid grid-cols-4 gap-2">
                {grid.flat().map((cell, index) => (
                    <Intersection 
                        key={index} 
                        isCorridor={cell.isCorridor}
                        colIndex={index % GRID_COLS}
                        status={status}
                    />
                ))}
            </div>
             {showRiders && riderPositions.map((pos, i) => (
                 <div key={i} className="absolute top-[3rem] left-0 transition-transform duration-150 ease-linear"
                      style={{ 
                          transform: `translateX(${pos * 0.28}rem) translateY(-50%)`,
                          opacity: (pos > 0 && pos < 115) ? 1 : 0,
                      }}>
                    <TwoWheelerIcon />
                 </div>
            ))}
        </div>
    );
};

export default LogisticsGrid;