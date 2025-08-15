
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Dashboard from './components/Dashboard';
import Benefits from './components/Benefits';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-brand-dark min-h-screen font-sans text-brand-light">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Dashboard />
        <Benefits />
      </main>
      <Footer />
    </div>
  );
}

export default App;
