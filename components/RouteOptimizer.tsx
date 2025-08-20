
import React, { useState, useCallback } from 'react';
import { generateRouteSuggestion } from '../services/geminiService';
import type { RouteSuggestion } from '../types';
import Loader from './icons/Loader';
import RouteIcon from './icons/RouteIcon';
import RoadIcon from './icons/RoadIcon';
import { ClockIcon } from './icons/MetricIcons';

const FinishFlagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path d="M4 3a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H4z" />
        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h4v-2H4V4h12v2h2V4a1 1 0 00-1-1H3z" clipRule="evenodd" />
    </svg>
);


const RouteOptimizer: React.FC = () => {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [suggestion, setSuggestion] = useState<RouteSuggestion | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateRoute = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuggestion(null);
        try {
            const data = await generateRouteSuggestion(start, end);
            setSuggestion(data);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [start, end]);

    return (
        <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <RouteIcon />
                <span className="ml-2">AI Route Optimization</span>
            </h3>
            <p className="text-gray-400 mb-4">Find the fastest route in Bangalore, avoiding current congestion.</p>
            <form onSubmit={handleGenerateRoute} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                    <label htmlFor="start" className="block text-sm font-medium text-gray-400 mb-1">Start Location</label>
                    <input
                        id="start"
                        type="text"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        placeholder="e.g., Koramangala"
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-4 py-2 focus:ring-2 focus:ring-brand-green focus:outline-none"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="end" className="block text-sm font-medium text-gray-400 mb-1">End Location</label>
                    <input
                        id="end"
                        type="text"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        placeholder="e.g., MG Road"
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-4 py-2 focus:ring-2 focus:ring-brand-green focus:outline-none"
                        required
                    />
                </div>
                <div className="sm:col-span-2">
                    <button
                        type="submit"
                        disabled={isLoading || !start || !end}
                        className="w-full bg-brand-green-dark hover:bg-brand-green-dark/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-md transition duration-300"
                    >
                        {isLoading ? 'Calculating...' : 'Find Smart Route'}
                    </button>
                </div>
            </form>

            {isLoading && (
                <div className="flex flex-col items-center justify-center text-center text-gray-300 mt-6">
                    <Loader size={40} />
                    <p className="mt-2 text-md">Analyzing traffic patterns...</p>
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-md text-red-300">
                    <p><strong>Route Calculation Failed:</strong> {error}</p>
                </div>
            )}

            {suggestion && (
                <div className="mt-6 p-4 bg-black/20 border border-gray-700 rounded-lg animate-fade-in-up">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                         <h4 className="font-bold text-brand-green-light">Your Optimized Route</h4>
                         <div className="flex flex-wrap gap-2">
                            <p className="text-sm font-semibold text-white bg-green-600/50 px-3 py-1 rounded-full">
                                Time Saved: {suggestion.timeSaved}
                            </p>
                         </div>
                    </div>
                    <p className="text-gray-300 mt-2 text-sm italic">"{suggestion.summary}"</p>
                    
                    <div className="mt-4">
                        <h5 className="text-md font-semibold text-gray-200 mb-3">Deep Drive Simulation:</h5>
                        <ol className="relative border-l border-gray-700 ml-2">
                            {suggestion.waypoints.map((point, index) => {
                                const isLast = index === suggestion.waypoints.length - 1;
                                return (
                                    <li key={index} className={`mb-4 ml-6 ${isLast ? 'mb-0' : ''}`}>
                                        <span className="absolute flex items-center justify-center w-6 h-6 bg-brand-green-dark rounded-full -left-3 ring-4 ring-gray-800 text-white text-xs font-bold">
                                            {isLast ? <FinishFlagIcon /> : index + 1}
                                        </span>
                                        <div className="flex justify-between items-center p-2 rounded-md">
                                            <p className="text-gray-300 pr-2 text-sm">{point.instruction}</p>
                                            {!isLast && point.distanceKm > 0 && (
                                                <span className="text-xs font-medium text-gray-400 bg-gray-900/50 px-2 py-1 rounded-full whitespace-nowrap">{point.distanceKm} km</span>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>


                    <div className="mt-4 relative">
                        <h5 className="text-md font-semibold text-gray-200 mb-2">Route Visualization:</h5>
                        <iframe
                            className="w-full h-80 rounded-lg border border-gray-700"
                            loading="lazy"
                            allowFullScreen
                            src={suggestion.googleMapsUrl}>
                        </iframe>
                        <div className="absolute top-12 left-2 md:left-4 bg-brand-dark/80 backdrop-blur-sm p-3 rounded-lg border border-gray-700 shadow-lg animate-fade-in-up w-48">
                            <div className="flex items-center space-x-3">
                                <div className="text-brand-green bg-black/20 p-2 rounded-full">
                                    <RoadIcon />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-white">{suggestion.totalDistanceKm} km</p>
                                    <p className="text-xs text-gray-400">Total Distance</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 mt-3">
                                <div className="text-brand-green bg-black/20 p-2 rounded-full">
                                    <ClockIcon />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-white">{suggestion.estimatedTravelTime}</p>
                                    <p className="text-xs text-gray-400">Est. Travel Time</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RouteOptimizer;