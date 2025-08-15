import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative py-20 md:py-32 bg-brand-dark overflow-hidden">
      <div 
        className="absolute inset-0 bg-hero-pattern animate-background-pan"
        style={{ backgroundSize: '200% 200%'}}
      ></div>
      <div className="relative container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 animate-fade-in-up">
          Unclogging Bangalore's Arteries
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          GreenWave AI transforms urban mobility by dynamically optimizing traffic signals, creating seamless green corridors to reduce congestion and emissions.
        </p>
      </div>
    </section>
  );
};

export default Hero;
