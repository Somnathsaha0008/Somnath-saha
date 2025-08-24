
import React from 'react';
import { ClockIcon, LeafIcon, CommerceIcon, ShieldIcon } from './icons/BenefitIcons';

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description, delay }) => (
  <div className="bg-gray-900 p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300 animate-fade-in-up border border-gray-800 hover:border-brand-green/30" style={{ animationDelay: delay }}>
    <div className="text-brand-green mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const Benefits: React.FC = () => {
  return (
    <section className="py-20 bg-brand-dark">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Core Advantages</h2>
          <p className="text-gray-400 mt-2">Transforming urban life, one intersection at a time.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <BenefitCard
            icon={<ClockIcon />}
            title="Faster Commutes"
            description="Significantly cuts down travel time by reducing unnecessary stops and idling."
            delay="0.1s"
          />
          <BenefitCard
            icon={<LeafIcon />}
            title="Lower Emissions"
            description="Less idling and smoother traffic flow leads to a major reduction in CO₂ emissions."
            delay="0.2s"
          />
          <BenefitCard
            icon={<CommerceIcon />}
            title="Economic Boost"
            description="By providing green waves and smart shortcut routes, we ensure faster, more reliable deliveries for quick commerce fleets, strengthening the local economy."
            delay="0.3s"
          />
          <BenefitCard
            icon={<ShieldIcon />}
            title="Improved Safety"
            description="Creates clear paths for emergency vehicles and optimizes flow to reduce intersection accidents."
            delay="0.4s"
          />
        </div>
      </div>
    </section>
  );
};

export default Benefits;
