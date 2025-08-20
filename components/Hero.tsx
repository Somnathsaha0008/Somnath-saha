import React from 'react';

const Hero: React.FC = () => {
  
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const targetId = e.currentTarget.href.split('#')[1];
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  return (
    <section className="relative py-20 md:py-32 bg-brand-dark overflow-hidden">
      <div 
        className="absolute inset-0 bg-hero-pattern animate-background-pan"
        style={{ backgroundSize: '200% 200%'}}
      ></div>
      <div className="relative container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 animate-fade-in-up bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 drop-shadow-md">
          Unclogging Bangalore's Arteries
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up mb-8" style={{ animationDelay: '0.2s' }}>
          GreenWave AI transforms urban mobility by dynamically optimizing traffic signals, creating seamless green corridors to reduce congestion and emissions.
        </p>
         <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <a
            href="#dashboard"
            onClick={handleScroll}
            className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-brand-green/20"
          >
            See It In Action
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
