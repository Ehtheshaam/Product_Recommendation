import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import ProductDetailPage from './pages/ProductDetailPage';
import DashboardPage from './pages/DashboardPage';
import { Search, BarChart2, Package } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 glass">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-xl">
                  V
                </div>
                <span className="font-bold text-xl tracking-tight">VOGA</span>
              </Link>
              
              <nav className="flex space-x-8">
                <Link to="/search" className="text-brand-textSecondary hover:text-brand-blue font-medium flex items-center gap-2 transition-colors">
                  <Search size={18} /> Search
                </Link>
                <Link to="/dashboard" className="text-brand-textSecondary hover:text-brand-purple font-medium flex items-center gap-2 transition-colors">
                  <BarChart2 size={18} /> ML Dashboard
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-brand-bgSecondary border-t border-brand-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-brand-textSecondary">
            <p className="mb-4">VOGA - AI Powered Intelligent Product Discovery</p>
            <p className="text-sm">Built to demonstrate Machine Learning & React Full Stack capabilities.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
