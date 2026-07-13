import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const getCategoryEmoji = (category) => {
  const cat = category.toLowerCase();
  if (cat.includes('shoe') || cat.includes('footwear')) return '👟';
  if (cat.includes('watch') || cat.includes('jewelry')) return '⌚';
  if (cat.includes('bag') || cat.includes('purse')) return '👜';
  if (cat.includes('saree') || cat.includes('lehenga')) return '🥻';
  if (cat.includes('dress') || cat.includes('skirt')) return '👗';
  if (cat.includes('glasses') || cat.includes('sunglasses')) return '🕶️';
  return '👕'; // Default fashion emoji
};

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialProducts, setInitialProducts] = useState([]);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1500);

  useEffect(() => {
    // Load some initial products
    fetch('http://127.0.0.1:5001/api/products?limit=50')
      .then(res => res.json())
      .then(data => setInitialProducts(data))
      .catch(err => console.error(err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    fetch(`http://127.0.0.1:5001/api/products/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const baseProducts = query && results.length > 0 ? results : initialProducts;

  // Apply filters
  const displayProducts = useMemo(() => {
    return baseProducts.filter(p => {
      // Price filter
      if (p.price > maxPrice) return false;
      
      // Category filter (Targeting Men, Women, Boys, Girls specifically)
      if (selectedCategories.length > 0) {
        const matchesCat = selectedCategories.some(sc => {
          // Use word boundary to avoid "Women" matching "Men"
          const regex = new RegExp('\\b' + sc + '\\b', 'i');
          return regex.test(p.category) || regex.test(p.name);
        });
        if (!matchesCat) return false;
      }
      
      return true;
    });
  }, [baseProducts, selectedCategories, maxPrice]);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Search Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-extrabold text-brand-textPrimary mb-6">Discover Fashion</h1>
        <form onSubmit={handleSearch} className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-textSecondary">
            <Search size={20} />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 rounded-2xl border border-brand-border bg-white shadow-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all text-lg"
            placeholder="Search for shirts, dresses, shoes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit" 
            className="absolute right-2 top-2 bottom-2 bg-brand-blue hover:bg-blue-700 text-white px-6 rounded-xl font-medium transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="glass p-5 rounded-2xl">
            <div className="flex items-center gap-2 font-bold mb-4">
              <Filter size={18} /> Filters
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2 text-brand-textSecondary uppercase">Gender / Category</h4>
                <div className="space-y-2">
                  {['Men', 'Women', 'Boys', 'Girls', 'Unisex'].map(c => (
                    <label key={c} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(c)}
                        onChange={() => toggleCategory(c)}
                        className="rounded text-brand-blue focus:ring-brand-blue" 
                      />
                      <span className="text-sm">{c}</span>
                    </label>
                  ))}
                </div>
              </div>
              <hr className="border-brand-border" />
              <div>
                <h4 className="font-semibold text-sm mb-2 text-brand-textSecondary uppercase">Max Price: ₹{maxPrice}</h4>
                <input 
                  type="range" 
                  min="100" 
                  max="1500" 
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-blue" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center py-20 text-brand-textSecondary">Searching...</div>
          ) : (
            <>
              {query && <p className="mb-6 text-brand-textSecondary">Found {displayProducts.length} results</p>}
              {!query && displayProducts.length > 0 && <p className="mb-6 text-brand-textSecondary">Showing {displayProducts.length} featured products</p>}
              
              {displayProducts.length === 0 ? (
                <div className="text-center py-20 text-brand-textSecondary bg-white rounded-2xl border border-brand-border">
                  No products found matching your criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayProducts.map((p, idx) => (
                    <motion.div 
                      key={p.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
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
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
