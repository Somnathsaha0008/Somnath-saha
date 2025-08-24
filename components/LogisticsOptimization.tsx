

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateLogisticsReport } from '../services/geminiService';
import type { LogisticsReport, RouteSuggestion } from '../types';
import Loader from './icons/Loader';
import { LogisticsIcon } from './icons/FeatureIcons';
import LogisticsGrid from './LogisticsGrid';

type SimulationStatus = 'idle' | 'detecting' | 'optimizing' | 'active' | 'completed' | 'resuming';

const StatusMessages: Record<SimulationStatus, { title: string; subtitle: string }> = {
  idle: { title: 'System Nominal', subtitle: 'Monitoring for q-commerce fleet density.' },
  detecting: { title: 'High Delivery Demand Detected', subtitle: 'Analyzing two-wheeler fleet data for optimization...' },
  optimizing: { title: 'Calculating Optimal Corridor', subtitle: "AI is weaving a green-light path for delivery riders." },
  active: { title: 'Green Wave Activated', subtitle: 'Prioritizing signals for quick commerce fleets.' },
  completed: { title: 'Peak Demand Easing', subtitle: 'Delivery fleets have cleared the main corridor.' },
  resuming: { title: 'Resuming Normal Operations', subtitle: 'Returning signals to balanced adaptive control.' },
};

const RouteDisplay: React.FC<{ route: RouteSuggestion }> = ({ route }) => (
    <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-brand-green/30 animate-fade-in-up">
        <h5 className="text-md font-semibold text-brand-green-light mb-2">Smart Shortcut for Delivery Pilot</h5>
        <p className="text-sm text-gray-300 italic mb-3">"{route.summary}"</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3 text-xs">
            <span className="font-semibold text-white bg-green-600/50 px-2 py-1 rounded-full">Save: {route.timeSaved}</span>
            <span className="text-gray-400">Distance: {route.totalDistanceKm} km</span>
            <span className="text-gray-400">ETA: {route.estimatedTravelTime}</span>
        </div>
        <ol className="relative border-l border-gray-700 ml-2 space-y-3">
            {route.waypoints.map((point, index) => (
                 <li key={index} className="ml-4">
                    <div className="absolute w-3 h-3 bg-brand-green-dark rounded-full mt-1.5 -left-1.5 border border-gray-900 ring-2 ring-brand-green/50"></div>
                    <p className="text-sm text-gray-200">{point.instruction}</p>
                 </li>
            ))}
        </ol>
    </div>
);

const LogisticsOptimization: React.FC = () => {
    const [report, setReport] = useState<LogisticsReport | null>(null);
    const [status, setStatus] = useState<SimulationStatus>('idle');
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const timeoutRef = useRef<number[]>([]);
    const intervalRef = useRef<number | null>(null);

    const clearTimeouts = () => {
        timeoutRef.current.forEach(clearTimeout);
        timeoutRef.current = [];
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        return () => clearTimeouts();
    }, []);

    const runSimulation = (generatedReport: LogisticsReport) => {
        return new Promise<void>(resolve => {
            clearTimeouts();
            setReport(generatedReport);
            setProgress(0);
            setStatus('detecting');

            const timings = {
                detecting: 2000,
                optimizing: 2500,
                active: 8000,
                completed: 2000,
                resuming: 2500,
            };

            let cumulativeTime = 0;

            const t1 = window.setTimeout(() => setStatus('optimizing'), cumulativeTime += timings.detecting);
            
            const t2 = window.setTimeout(() => {
                setStatus('active');
                const startTime = Date.now();
                intervalRef.current = window.setInterval(() => {
                    const elapsedTime = Date.now() - startTime;
                    const newProgress = Math.min(100, (elapsedTime / timings.active) * 100);
                    setProgress(newProgress);
                    if (newProgress >= 100) {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                    }
                }, 50);
            }, cumulativeTime += timings.optimizing);

            const t3 = window.setTimeout(() => setStatus('completed'), cumulativeTime += timings.active);
            const t4 = window.setTimeout(() => setStatus('resuming'), cumulativeTime += timings.completed);
            const t5 = window.setTimeout(() => {
                setStatus('idle');
                setReport(null);
                setProgress(0);
                resolve();
            }, cumulativeTime += timings.resuming);

            timeoutRef.current = [t1, t2, t3, t4, t5];
        });
    };
    
    const handleSimulation = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        clearTimeouts();
        
        try {
            const data = await generateLogisticsReport();
            await runSimulation(data);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
            setStatus('idle');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const isSimulating = status !== 'idle';
    const message = StatusMessages[status];

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/2 w-full">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                    <LogisticsIcon />
                    <span className="ml-2">Quick Commerce & Fleet Optimization</span>
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                   During peak demand, the AI creates a 'green wave' and provides smart shortcut routes for two-wheeler fleets, crucial for meeting 15-minute delivery windows.
                </p>
                
                <div className="p-4 bg-black/20 rounded-lg min-h-[120px] flex flex-col justify-center border border-gray-800">
                    <div className='flex items-center'>
                        {isSimulating && status !== 'resuming' && status !== 'completed' && <Loader size={40} />}
                        <div className={isSimulating ? 'ml-4' : ''}>
                            <h4 className="font-semibold text-brand-green-light">{message.title}</h4>
                            <p className="text-sm text-gray-300">{message.subtitle}</p>
                            {report && isSimulating && (
                                 <p className="text-xs text-yellow-400 mt-1 font-mono animate-fade-in-up">
                                    Corridor: {report.metrics.prioritizedCorridor}
                                </p>
                            )}
                        </div>
                    </div>
                     {status === 'active' && (
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-3">
                            <div className="bg-yellow-400 h-2.5 rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
                        </div>
                    )}
                </div>

                 {report && isSimulating && (
                    <div className="mt-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Fleets Being Prioritized</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                           {report.activeFleets.map(fleet => (
                               <div key={fleet.name} className="bg-yellow-900/40 border border-yellow-700/50 text-center p-2 rounded-md">
                                   <p className="font-bold text-yellow-300 text-sm">{fleet.name}</p>
                                   <p className="text-xs text-yellow-400">{fleet.vehicleCount} riders</p>
                               </div>
                           ))}
                        </div>
                        {report.routeSuggestion && <RouteDisplay route={report.routeSuggestion} />}
                    </div>
                 )}

                <div className="mt-4">
                    {!isSimulating && (
                        <button
                            onClick={handleSimulation}
                            disabled={isLoading}
                            className="w-full bg-yellow-600/80 hover:bg-yellow-500/80 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-md transition duration-300 flex items-center justify-center animate-fade-in-up"
                        >
                            {isLoading ? <><Loader size={24} /><span className="ml-2">Preparing...</span></> : 'Simulate Quick Commerce Rush'}
                        </button>
                    )}
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-300 text-sm">
                        <p><strong>Simulation Failed:</strong> {error}</p>
                    </div>
                )}
            </div>
             <div className="lg:w-1/2 w-full">
                <LogisticsGrid status={status} progress={progress} />
            </div>
        </div>
    );
};

export default LogisticsOptimization;