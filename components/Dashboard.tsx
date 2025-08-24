import React, { useState, useCallback, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generateTrafficReport } from '../services/geminiService';
import type { TrafficReport, CongestionHotspot } from '../types';
import { LeafIcon, ClockIcon, CarIcon, AlertIcon } from './icons/MetricIcons';
import useCountUp from '../hooks/useCountUp';
import Loader from './icons/Loader';
import Forecast from './Forecast';
import RouteOptimizer from './RouteOptimizer';
import Panel from './Panel';
import CustomChartTooltip from './CustomChartTooltip';
import EmergencyPreemption from './EmergencyPreemption';
import LiveTrafficFeed from './LiveTrafficFeed';
import LogisticsOptimization from './LogisticsOptimization';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number; unit: string; }> = ({ icon, label, value, unit }) => {
  const animatedValue = useCountUp(value, 1500);

  return (
    <div className="bg-white/5 p-4 rounded-lg flex items-center space-x-4 transition-all duration-300 hover:bg-white/10 transform hover:-translate-y-1">
      <div className="text-brand-green bg-black/20 p-3 rounded-full">{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white">{animatedValue}<span className="text-lg text-gray-300 ml-1">{unit}</span></p>
      </div>
    </div>
  );
};

const HotspotItem: React.FC<{ hotspot: CongestionHotspot }> = ({ hotspot }) => {
  const levelColor = {
    High: 'bg-red-500/80 text-red-100 border-red-500',
    Medium: 'bg-yellow-500/80 text-yellow-100 border-yellow-500',
    Low: 'bg-green-500/80 text-green-100 border-green-500',
  }[hotspot.congestionLevel];

  return (
    <li className="flex items-center justify-between p-3 bg-white/5 rounded-md">
      <span className="text-gray-300">{hotspot.location}</span>
      <div className="flex items-center space-x-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${levelColor}`}>
          {hotspot.congestionLevel}
        </span>
      </div>
    </li>
  );
};

const Dashboard: React.FC = () => {
  const [report, setReport] = useState<TrafficReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
    let isCancelled = false;

    const fetchInitialReport = async () => {
      try {
        const data = await generateTrafficReport();
        if (!isCancelled) {
          setReport(data);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err.message || 'An unknown error occurred.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchInitialReport();

    return () => {
      isCancelled = true;
    };
  }, []);

  const chartData = report ? [
    { name: 'Avg. Wait Time', Before: report.metrics.avgWaitTimeBefore, After: report.metrics.avgWaitTimeAfter },
  ] : [];

  return (
    <section className="py-20 bg-transparent" id="dashboard">
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <Panel className="lg:col-span-8">
                    <h3 className="text-xl font-semibold text-brand-green-light mb-3">{report.summary.title}</h3>
                    <div className="space-y-4 text-gray-300">
                        <p>
                            <span className="font-semibold text-green-400">Positive Highlight: </span>
                            {report.summary.positiveHighlight}
                        </p>
                        <p>
                            <span className="font-semibold text-yellow-400">Current Challenge: </span>
                            {report.summary.challengeHighlight}
                        </p>
                        <p className="text-sm italic text-gray-400 border-t border-gray-700 pt-3 mt-3">
                            <span className="font-semibold not-italic text-gray-300">Outlook: </span>
                            {report.summary.outlook}
                        </p>
                    </div>
                </Panel>
                <Panel className="lg:col-span-4">
                    <LiveTrafficFeed feed={report.liveFeed} status={report.systemStatus} />
                </Panel>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<ClockIcon />} label="Avg. Wait Time Reduction" value={report.metrics.avgWaitTimeBefore - report.metrics.avgWaitTimeAfter} unit="sec" />
                <StatCard icon={<CarIcon />} label="City Traffic Flow" value={report.metrics.trafficFlowRate} unit="vph" />
                <StatCard icon={<LeafIcon />} label="CO₂ Emission Reduction" value={report.metrics.co2Reduction} unit="%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <Panel className="lg:col-span-7">
                <h3 className="text-lg font-semibold text-white mb-4">Wait Time Comparison (Seconds)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorBefore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F87171" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0.8}/>
                        </linearGradient>
                        <linearGradient id="colorAfter" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34D399" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.8}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
                    <YAxis tick={{ fill: '#9CA3AF' }} />
                    <Tooltip content={<CustomChartTooltip />} cursor={{fill: 'rgba(16, 185, 129, 0.1)'}}/>
                    <Legend wrapperStyle={{ color: '#D1D5DB' }}/>
                    <Bar dataKey="Before" fill="url(#colorBefore)" name="Before GreenWave" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="After" fill="url(#colorAfter)" name="After GreenWave" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>

              <Panel className="lg:col-span-5">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center"><AlertIcon /> <span className='ml-2'>Congestion Hotspots</span></h3>
                <ul className="space-y-3">
                  {report.hotspots.map((hotspot) => (
                    <HotspotItem key={hotspot.location} hotspot={hotspot} />
                  ))}
                </ul>
              </Panel>
            
              <Panel className="lg:col-span-7">
                <RouteOptimizer />
              </Panel>
              <Panel className="lg:col-span-5">
                <Forecast />
              </Panel>
              
              <Panel className="lg:col-span-12">
                <LogisticsOptimization />
              </Panel>

              <Panel className="lg:col-span-12">
                <EmergencyPreemption />
              </Panel>
            </div>
             <div className="text-center mt-8">
                <button
                    onClick={handleGenerateReport}
                    className="relative group bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 overflow-hidden"
                    disabled={isLoading}
                    >
                    <span className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-20 transition-opacity"></span>
                    <span className="absolute top-0 left-0 h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine"></span>
                    <span className="relative z-10">{isLoading ? 'Refreshing...' : 'Refresh Live Report'}</span>
                </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
