import React, { useState, useCallback } from 'react';
import { generateTrafficForecast } from '../services/geminiService';
import type { TrafficForecast } from '../types';
import Loader from './icons/Loader';
import { AlertIcon, ClockIcon } from './icons/MetricIcons';

const Forecast: React.FC = () => {
    const [query, setQuery] = useState('');
    const [forecast, setForecast] = useState<TrafficForecast | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateForecast = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setForecast(null);
        try {
            const data = await generateTrafficForecast(query);
            setForecast(data);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [query]);

    const getCongestionInfo = (level: 'High' | 'Medium' | 'Low') => {
        switch (level) {
            case 'High': return { color: 'text-red-400', label: 'High Congestion' };
            case 'Medium': return { color: 'text-yellow-400', label: 'Medium Congestion' };
            case 'Low': return { color: 'text-green-400', label: 'Low Congestion' };
            default: return { color: 'text-gray-400', label: 'Unknown' };
        }
    };

    const congestionInfo = forecast ? getCongestionInfo(forecast.expectedCongestion) : null;

    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Future Forecast</h3>
            <p className="text-gray-400 mb-4">Want to plan ahead? Ask our AI for a traffic forecast.</p>
            <form onSubmit={handleGenerateForecast} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., Tomorrow at 9 AM, Friday evening..."
                    className="flex-grow bg-gray-800 border border-gray-700 text-white rounded-md px-4 py-2 focus:ring-2 focus:ring-brand-green focus:outline-none"
                    aria-label="Time for traffic forecast"
                    required
                />
                <button
                    type="submit"
                    disabled={isLoading || !query}
                    className="bg-brand-green-dark hover:bg-brand-green-dark/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-md transition duration-300"
                >
                    {isLoading ? 'Forecasting...' : 'Get Forecast'}
                </button>
            </form>

            {isLoading && (
                <div className="flex flex-col items-center justify-center text-center text-gray-300 mt-6">
                     <Loader size={40} />
                    <p className="mt-2 text-md">Peering into the future...</p>
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-md text-red-300">
                    <p><strong>Forecast Failed:</strong> {error}</p>
                </div>
            )}

            {forecast && (
                <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg animate-fade-in-up">
                    <h4 className="font-bold text-brand-green-light">Forecast for: {forecast.forecastTime}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-2">
                           <AlertIcon />
                            <span className="text-gray-400">Expected Congestion:</span>
                            <span className={`font-semibold ${congestionInfo?.color}`}>{congestionInfo?.label}</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <ClockIcon />
                            <span className="text-gray-400">Travel Time Impact:</span>
                            <span className="font-semibold text-gray-200">{forecast.travelTimeImpact}</span>
                        </div>
                    </div>
                    <p className="text-gray-300 mt-4 text-sm">{forecast.summary}</p>
                </div>
            )}
        </div>
    );
};

export default Forecast;