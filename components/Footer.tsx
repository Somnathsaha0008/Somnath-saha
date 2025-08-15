
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-6 py-6 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} GreenWave AI. All Rights Reserved. Revolutionizing Bangalore's Roads.</p>
      </div>
    </footer>
  );
};

export default Footer;
