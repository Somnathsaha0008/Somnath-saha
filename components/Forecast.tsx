import React, { useState, useCallback } from 'react';
import { generateTrafficForecast } from '../services/geminiService';
import type { TrafficForecast, ForecastHotspot } from '../types';
import Loader from './icons/Loader';

const Forecast: React.FC = () => {
    const [query, setQuery] = useState('');
    const [forecast, setForecast] = useState<TrafficForecast | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateForecast = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
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

    const getCongestionBadgeColor = (level: ForecastHotspot['predictedCongestion']) => {
        switch (level) {
            case 'High': return 'bg-red-500/80 text-red-100 border-red-500';
            case 'Medium': return 'bg-yellow-500/80 text-yellow-100 border-yellow-500';
            case 'Low': return 'bg-green-500/80 text-green-100 border-green-500';
            default: return 'bg-gray-500/80 text-gray-100 border-gray-500';
        }
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-white mb-4">Future Forecast</h3>
            <p className="text-gray-400 mb-4">Want to plan ahead? Ask our AI for a traffic forecast.</p>
            <form onSubmit={handleGenerateForecast} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., Tomorrow at 9 AM..."
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
                <div className="mt-6 p-4 bg-black/20 border border-gray-700 rounded-lg animate-fade-in-up">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                        <h4 className="font-bold text-brand-green-light">Forecast for: {forecast.forecastTime}</h4>
                        <span className="text-xs font-semibold text-gray-300 bg-gray-700/50 px-3 py-1 rounded-full self-start sm:self-center">
                            {forecast.overallTrend}
                        </span>
                    </div>

                    <p className="text-gray-300 mt-2 mb-4 text-sm">{forecast.summary}</p>

                    <div className="space-y-3">
                        <h5 className="text-md font-semibold text-gray-200">Predicted Hotspots:</h5>
                        <ul className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {forecast.hotspots.map((hotspot, index) => (
                                <li key={index} className="p-3 bg-gray-900/50 rounded-md text-sm">
                                    <div className="flex items-start justify-between">
                                        <span className="font-semibold text-gray-300 pr-2">{hotspot.location}</span>
                                        <span className={`flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${getCongestionBadgeColor(hotspot.predictedCongestion)}`}>
                                            {hotspot.predictedCongestion}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 mt-1">
                                        <span className="font-medium text-gray-500">Reason:</span> {hotspot.reason}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-700">
                         <h6 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Influential Data Sources</h6>
                         <div className="flex flex-wrap gap-2 mt-2">
                            {forecast.dataSources.map((source, index) => (
                                <span key={index} className="text-xs text-brand-green-light bg-brand-green/10 px-2 py-1 rounded">
                                    {source}
                                </span>
                            ))}
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Forecast;