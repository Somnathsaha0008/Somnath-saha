import React, { useState, useCallback, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generateTrafficReport } from '../services/geminiService';
import type { TrafficReport, CongestionHotspot } from '../types';
import { LeafIcon, ClockIcon, CarIcon, AlertIcon } from './icons/MetricIcons';
import useCountUp from '../hooks/useCountUp';
import Loader from './icons/Loader';
import Forecast from './Forecast';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number; unit: string; }> = ({ icon, label, value, unit }) => {
  const animatedValue = useCountUp(value, 1500);

  return (
    <div className="bg-gray-800 p-6 rounded-lg flex items-center space-x-4">
      <div className="text-brand-green bg-gray-700 p-3 rounded-full">{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white">{animatedValue}<span className="text-lg text-gray-300 ml-1">{unit}</span></p>
      </div>
    </div>
  );
};

const HotspotItem: React.FC<{ hotspot: CongestionHotspot }> = ({ hotspot }) => {
  const levelColor = {
    High: 'bg-red-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-green-500',
  }[hotspot.congestionLevel];

  return (
    <li className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
      <span className="text-gray-300">{hotspot.location}</span>
      <div className="flex items-center space-x-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${levelColor}`}>
          {hotspot.congestionLevel}
        </span>
      </div>
    </li>
  );
};

const Dashboard: React.FC = () => {
  const [report, setReport] = useState<TrafficReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setReport(null);
    try {
      const data = await generateTrafficReport();
      setReport(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    // Automatically generate the first report on component mount
    handleGenerateReport();
  }, [handleGenerateReport]);

  const chartData = report ? [
    { name: 'Avg. Wait Time', Before: report.metrics.avgWaitTimeBefore, After: report.metrics.avgWaitTimeAfter },
  ] : [];

  return (
    <section className="py-20 bg-brand-dark" id="dashboard">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Live Impact Dashboard</h2>
          <p className="text-gray-400 mt-2">Simulated real-time impact of GreenWave AI on Bangalore's traffic.</p>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center text-center text-gray-300 min-h-[50vh]">
            <Loader />
            <p className="mt-4 text-lg">Communicating with traffic network...</p>
            <p className="text-sm text-gray-500">Our AI is crunching the latest data.</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center max-w-md mx-auto p-6 bg-red-900/50 border border-red-700 rounded-lg">
            <h3 className="text-xl font-bold text-red-300">Report Generation Failed</h3>
            <p className="text-red-400 mt-2">{error}</p>
            <button
              onClick={handleGenerateReport}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
              Retry
            </button>
          </div>
        )}

        {report && !isLoading && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-brand-green-light mb-2">AI Summary</h3>
                <p className="text-gray-300">{report.summary}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<ClockIcon />} label="Avg. Wait Time Reduction" value={report.metrics.avgWaitTimeBefore - report.metrics.avgWaitTimeAfter} unit="sec" />
                <StatCard icon={<CarIcon />} label="City Traffic Flow" value={report.metrics.trafficFlowRate} unit="vph" />
                <StatCard icon={<LeafIcon />} label="CO₂ Emission Reduction" value={report.metrics.co2Reduction} unit="%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-gray-900 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Wait Time Comparison (Seconds)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
                    <YAxis tick={{ fill: '#9CA3AF' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} cursor={{fill: 'rgba(16, 185, 129, 0.1)'}}/>
                    <Legend wrapperStyle={{ color: '#D1D5DB' }}/>
                    <Bar dataKey="Before" fill="#EF4444" name="Before GreenWave" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="After" fill="#10B981" name="After GreenWave" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center"><AlertIcon /> <span className='ml-2'>Congestion Hotspots</span></h3>
                <ul className="space-y-3">
                  {report.hotspots.map((hotspot) => (
                    <HotspotItem key={hotspot.location} hotspot={hotspot} />
                  ))}
                </ul>
              </div>
            </div>
             <Forecast />
             <div className="text-center mt-8">
                <button
                    onClick={handleGenerateReport}
                    className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                    disabled={isLoading}
                    >
                    {isLoading ? 'Refreshing...' : 'Refresh Live Report'}
                </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
