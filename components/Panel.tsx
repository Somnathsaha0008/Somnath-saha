import React from 'react';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
}

const Panel: React.FC<PanelProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative rounded-xl overflow-hidden bg-gray-900/50 ${className}`}>
      {/* Spinning gradient border */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] animate-border-spin bg-[conic-gradient(from_0deg_at_50%_50%,rgba(16,185,129,0.5)_0%,transparent_30%,transparent_70%,rgba(16,185,129,0.5)_100%)]"></div>
      
      {/* Inner content container */}
      <div className="relative z-10 p-6 rounded-[11px] bg-gray-900/80 backdrop-blur-md h-full">
          {children}
      </div>
    </div>
  );
};

export default Panel;
