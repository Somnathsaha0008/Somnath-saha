import React from 'react';

const Header: React.FC = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const targetId = e.currentTarget.href.split('#')[1];
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="bg-brand-dark/80 backdrop-blur-sm sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center space-x-3 group">
            <svg className="w-8 h-8 text-brand-green group-hover:text-brand-green-light group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <h1 className="text-2xl font-bold text-white group-hover:text-brand-green-light group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all duration-300">
              GreenWave AI
            </h1>
          </a>
          <a 
            href="#dashboard" 
            onClick={handleScroll}
            className="hidden md:block text-brand-gray hover:text-white transition-colors duration-300"
          >
            View Live Dashboard
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
