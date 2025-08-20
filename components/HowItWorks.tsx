
import React from 'react';
import { DataIcon, AnalysisIcon, SignalIcon, SyncIcon, SirenIcon } from './icons/FeatureIcons';

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

const StepCard: React.FC<StepCardProps> = ({ icon, title, description, delay }) => (
  <div className="bg-gray-800/50 p-6 rounded-lg text-center animate-fade-in-up flex flex-col items-center border border-transparent hover:border-brand-green/30 hover:bg-gray-800 transition-colors duration-300" style={{ animationDelay: delay }}>
    <div className="flex justify-center mb-4 text-brand-green">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">How It Works</h2>
          <p className="text-gray-400 mt-2">A five-step process for a smarter, safer city.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <StepCard
            icon={<DataIcon />}
            title="1. Real-Time Data"
            description="Collects live traffic data from IoT sensors and cameras across the city."
            delay="0.1s"
          />
          <StepCard
            icon={<AnalysisIcon />}
            title="2. AI Analysis"
            description="Our predictive AI model analyzes traffic patterns and forecasts congestion."
            delay="0.2s"
          />
          <StepCard
            icon={<SignalIcon />}
            title="3. Dynamic Signals"
            description="Intelligently adjusts traffic signal timings in real-time to optimize flow."
            delay="0.3s"
          />
          <StepCard
            icon={<SyncIcon />}
            title="4. Network Sync"
            description="Creates synchronized 'green waves' across major corridors for smooth transit."
            delay="0.4s"
          />
          <StepCard
            icon={<SirenIcon />}
            title="5. Emergency Priority"
            description="Detects emergency vehicles and overrides signals to create an immediate clear path."
            delay="0.5s"
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
