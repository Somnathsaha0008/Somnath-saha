import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-dark/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <h1 className="text-2xl font-bold text-white">
              GreenWave AI
            </h1>
          </div>
          <a href="#dashboard" className="hidden md:block text-brand-gray hover:text-white transition-colors duration-300">
            View Live Dashboard
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
