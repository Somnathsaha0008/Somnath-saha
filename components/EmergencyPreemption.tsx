import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateEmergencyScenario } from '../services/geminiService';
import type { EmergencyScenario } from '../types';
import Loader from './icons/Loader';
import { SirenIcon } from './icons/MetricIcons';
import IntersectionGrid from './IntersectionGrid';

type SimulationStatus = 'idle' | 'detecting' | 'calculating' | 'clearing' | 'en_route' | 'cleared' | 'resuming';

const StatusMessages: Record<SimulationStatus, { title: string; subtitle: string }> = {
  idle: { title: 'System Nominal', subtitle: 'Monitoring for emergency signals.' },
  detecting: { title: 'Emergency Signal Detected', subtitle: 'Receiving broadcast from vehicle...' },
  calculating: { title: 'Calculating Optimal Path', subtitle: 'AI is plotting the fastest, safest route.' },
  clearing: { title: 'Clearing Traffic Corridor', subtitle: 'Overriding signals to create a green wave.' },
  en_route: { title: 'Vehicle En Route', subtitle: 'Path is clear. Monitoring progress in real-time.' },
  cleared: { title: 'Vehicle Has Passed', subtitle: 'The emergency vehicle has cleared the corridor.' },
  resuming: { title: 'Resuming Normal Operations', subtitle: 'Returning signals to adaptive control.' },
};

const EmergencyPreemption: React.FC = () => {
    const [scenario, setScenario] = useState<EmergencyScenario | null>(null);
    const [status, setStatus] = useState<SimulationStatus>('idle');
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const timeoutRef = useRef<NodeJS.Timeout[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const clearTimeouts = () => {
        timeoutRef.current.forEach(clearTimeout);
        timeoutRef.current = [];
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        // Cleanup timeouts on component unmount
        return () => clearTimeouts();
    }, []);

    const runSimulation = (generatedScenario: EmergencyScenario) => {
        clearTimeouts();
        setScenario(generatedScenario);
        setProgress(0);
        setStatus('detecting');

        const timings = {
            detecting: 2000,
            calculating: 2500,
            clearing: 3000,
            en_route: 8000,
            cleared: 2000,
            resuming: 2500,
        };

        let cumulativeTime = 0;

        timeoutRef.current.push(setTimeout(() => setStatus('calculating'), cumulativeTime += timings.detecting));
        timeoutRef.current.push(setTimeout(() => setStatus('clearing'), cumulativeTime += timings.calculating));
        
        timeoutRef.current.push(setTimeout(() => {
            setStatus('en_route');
            const startTime = Date.now();
            intervalRef.current = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const newProgress = Math.min(100, (elapsedTime / timings.en_route) * 100);
                setProgress(newProgress);
                if (newProgress >= 100) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            }, 50);
        }, cumulativeTime += timings.clearing));

        timeoutRef.current.push(setTimeout(() => setStatus('cleared'), cumulativeTime += timings.en_route));
        timeoutRef.current.push(setTimeout(() => setStatus('resuming'), cumulativeTime += timings.cleared));
        timeoutRef.current.push(setTimeout(() => {
            setStatus('idle');
            setScenario(null);
            setProgress(0);
        }, cumulativeTime += timings.resuming));
    };
    
    const handleSimulation = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        clearTimeouts();
        
        try {
            const data = await generateEmergencyScenario();
            runSimulation(data);
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
                <IntersectionGrid status={status} progress={progress} />
            </div>
            <div className="lg:w-1/2 w-full">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                    <SirenIcon />
                    <span className="ml-2">Emergency Vehicle Preemption (EVP)</span>
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                    When an emergency is detected, GreenWave AI overrides the network to create an immediate, safe passage, saving critical time.
                </p>
                
                <div className="p-4 bg-black/20 rounded-lg min-h-[120px] flex flex-col justify-center">
                    <div className='flex items-center'>
                        {isSimulating && status !== 'resuming' && status !== 'cleared' && <Loader size={40} />}
                        <div className={isSimulating ? 'ml-4' : ''}>
                            <h4 className="font-semibold text-brand-green-light">{message.title}</h4>
                            <p className="text-sm text-gray-300">{message.subtitle}</p>
                            {scenario && isSimulating && (
                                <p className="text-xs text-gray-400 mt-1">
                                    {scenario.vehicleType} detected {scenario.location}, {scenario.destination}.
                                </p>
                            )}
                        </div>
                    </div>
                     {status === 'en_route' && (
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-3">
                            <div className="bg-brand-green h-2.5 rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    {!isSimulating && (
                        <button
                            onClick={handleSimulation}
                            disabled={isLoading}
                            className="w-full bg-brand-green-dark hover:bg-brand-green-dark/80 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-md transition duration-300 flex items-center justify-center animate-fade-in-up"
                        >
                            {isLoading ? <><Loader size={24} /><span className="ml-2">Preparing...</span></> : 'Simulate Emergency Response'}
                        </button>
                    )}
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-300 text-sm">
                        <p><strong>Simulation Failed:</strong> {error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmergencyPreemption;
