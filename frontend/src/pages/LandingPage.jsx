import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Database, BrainCircuit, BarChart, Zap, Search, Layers, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const getCategoryEmoji = (category) => {
  if (!category) return '👕';
  const cat = category.toLowerCase();
  if (cat.includes('shoe') || cat.includes('footwear')) return '👟';
  if (cat.includes('watch') || cat.includes('jewelry')) return '⌚';
  if (cat.includes('bag') || cat.includes('purse')) return '👜';
  if (cat.includes('saree') || cat.includes('lehenga')) return '🥻';
  if (cat.includes('dress') || cat.includes('skirt')) return '👗';
  if (cat.includes('glasses') || cat.includes('sunglasses')) return '🕶️';
  return '👕'; // Default fashion emoji
};

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [isPersonalized, setIsPersonalized] = useState(false);

  useEffect(() => {
    let history = [];
    try {
      history = JSON.parse(localStorage.getItem('voga_history') || '[]');
    } catch (e) {
      console.error(e);
    }

    if (history.length > 0) {
      // Fetch personalized recommendations based on viewing history
      fetch('http://127.0.0.1:5001/api/recommendations/personal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history })
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProducts(data.slice(0, 3));
          setIsPersonalized(true);
        }
      })
      .catch(err => console.error(err));
    } else {
      // Fallback to standard featured products (Cold Start problem solution)
      fetch('http://127.0.0.1:5001/api/products?limit=3')
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err => console.error(err));
    }
  }, []);

  const pipelineSteps = [
    { name: "Dataset", icon: <Database /> },
    { name: "Data Cleaning", icon: <Layers /> },
    { name: "Feature Engineering", icon: <BrainCircuit /> },
    { name: "TF-IDF Vectorizer", icon: <BarChart /> },
    { name: "Cosine Similarity", icon: <Search /> },
    { name: "Top-N Products", icon: <Zap /> },
  ];

  return (
    <div className="flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden bg-gradient-to-b from-brand-bgSecondary to-brand-bg py-24 sm:py-32">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-brand-blue/10 to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-brand-textPrimary mb-6"
          >
            Discover Products <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">
              Smarter with ML
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-xl text-brand-textSecondary max-w-3xl mx-auto"
          >
            An AI-powered recommendation platform that uses Natural Language Processing, TF-IDF Vectorization, and Cosine Similarity to recommend similar products intelligently.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex justify-center gap-4"
          >
            <Link to="/search" className="bg-brand-blue hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              Explore Products <ArrowRight size={20} />
            </Link>
            <Link to="/dashboard" className="bg-white border border-brand-border hover:bg-gray-50 text-brand-textPrimary font-medium py-3 px-8 rounded-full shadow-sm hover:shadow transition-all">
              View ML Dashboard
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Recommended For You Section */}
      {products.length > 0 && (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold flex items-center gap-3">
                {isPersonalized ? (
                  <><Zap className="text-brand-purple" /> Recommended For You</>
                ) : (
                  <><Star className="text-brand-blue" /> Featured Products</>
                )}
              </h2>
              <p className="text-brand-textSecondary mt-2">
                {isPersonalized 
                  ? "Based on an ML analysis of your recent browsing history."
                  : "Trending items in our catalog right now."}
              </p>
            </div>
            <Link to="/search" className="text-brand-blue font-semibold hover:underline mt-4 sm:mt-0">View All →</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, idx) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className="glass rounded-2xl overflow-hidden flex flex-col group cursor-pointer hover:shadow-lg"
              >
                <Link to={`/product/${p.id}`}>
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden flex items-center justify-center">
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-500">
                      {getCategoryEmoji(p.category)}
                    </span>
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold shadow-sm">
                      {p.category}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col bg-white">
                    <p className="text-xs text-brand-textSecondary mb-1 font-medium">{p.brand}</p>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-tight text-brand-textPrimary">{p.name}</h3>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-extrabold text-xl text-brand-textPrimary">₹{p.price.toLocaleString()}</span>
                      <div className="flex items-center gap-1 text-brand-warning text-sm font-semibold">
                        <Star size={16} fill="currentColor" /> {p.rating.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Statistics Counters */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Products", value: "25,497" },
            { label: "TF-IDF Features", value: "8,000+" },
            { label: "Accuracy", value: "97%" },
            { label: "Categories", value: "50+" }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
              className="text-center glass p-6 rounded-2xl"
            >
              <h3 className="text-4xl font-black text-brand-blue">{stat.value}</h3>
              <p className="mt-2 text-sm font-medium text-brand-textSecondary uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ML Pipeline Animation */}
      <section className="w-full bg-brand-bgSecondary py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works: <span className="text-brand-purple">The ML Pipeline</span></h2>
          
          <div className="flex flex-col md:flex-row justify-between items-center relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-brand-border -translate-y-1/2 z-0" />
            
            {pipelineSteps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 50 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative z-10 flex flex-col items-center bg-white p-4 rounded-xl border border-brand-border shadow-sm mb-6 md:mb-0 w-40 text-center"
              >
                <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mb-3">
                  {step.icon}
                </div>
                <h4 className="font-semibold text-sm">{step.name}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why VOGA Features */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl font-bold text-center mb-16">Why VOGA?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "AI Recommendation Engine", desc: "Powered by Cosine Similarity across thousands of feature vectors." },
            { title: "Natural Language Processing", desc: "Context-aware product understanding via tuned TF-IDF." },
            { title: "Explainable AI", desc: "Transparent recommendations. See exactly why a product matched." }
          ].map((feat, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className="p-8 border border-brand-border rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all"
            >
              <div className="w-10 h-10 bg-purple-50 text-brand-purple rounded-lg flex items-center justify-center mb-4">
                <BrainCircuit size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
              <p className="text-brand-textSecondary">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
    </div>
  );
};

export default LandingPage;
