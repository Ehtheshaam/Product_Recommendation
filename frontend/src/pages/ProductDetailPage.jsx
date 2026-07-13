import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, Zap, Info } from 'lucide-react';
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

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch product details
    fetch(`http://127.0.0.1:5001/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        
        // --- PERSONALIZATION HISTORY TRACKING ---
        try {
          const currentHistory = JSON.parse(localStorage.getItem('voga_history') || '[]');
          const numericId = parseInt(id);
          // Remove if it exists to put it at the front
          const newHistory = [numericId, ...currentHistory.filter(item => item !== numericId)];
          // Keep only the last 5 items
          localStorage.setItem('voga_history', JSON.stringify(newHistory.slice(0, 5)));
        } catch (e) {
          console.error("Failed to save history", e);
        }
        // ----------------------------------------
        
        // Fetch recommendations
        return fetch(`http://127.0.0.1:5001/api/recommendations/${id}`);
      })
      .then(res => res.json())
      .then(data => {
        setRecommendations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-center text-brand-textSecondary mt-20">Loading Product...</div>;
  if (!product) return <div className="p-8 text-center text-brand-danger mt-20">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Product Top Section */}
      <div className="glass rounded-3xl p-8 mb-16 flex flex-col md:flex-row gap-12">
        <div className="md:w-1/2">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
            <span className="text-9xl">{getCategoryEmoji(product.category)}</span>
          </motion.div>
        </div>
        <div className="md:w-1/2 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-50 text-brand-blue font-semibold text-sm rounded-full">{product.category}</span>
            <span className="text-brand-textSecondary font-medium">{product.brand}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-textPrimary leading-tight mb-4">{product.name}</h1>
          <div className="flex items-center gap-2 mb-6 text-brand-warning font-bold text-lg">
            <Star fill="currentColor" /> {product.rating.toFixed(1)} Rating
          </div>
          <div className="text-4xl font-black mb-8">₹{product.price.toLocaleString()}</div>
          
          <div className="flex gap-4">
            <button className="flex-1 bg-brand-blue hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg">
              Buy Now
            </button>
            <button className="flex-1 bg-white border-2 border-brand-border hover:border-brand-textPrimary text-brand-textPrimary py-4 rounded-xl font-bold transition-all">
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations & Explainable AI */}
      <div>
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold flex items-center gap-3">
            <Zap className="text-brand-purple" /> Similar Products
          </h2>
          <p className="text-brand-textSecondary mt-2">Powered by our AI Recommendation Engine</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec, idx) => (
            <motion.div 
              key={rec.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl overflow-hidden flex flex-col"
            >
              {/* XAI Badge */}
              <div className="bg-brand-bgSecondary px-4 py-3 border-b border-brand-border flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-success">
                  <ShieldCheck size={16} /> {rec.similarity}% Match
                </div>
                <div className="text-xs font-semibold text-brand-textSecondary uppercase">
                  {rec.confidence} Confidence
                </div>
              </div>

              <div className="p-5 flex-1 flex gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  <span className="text-4xl">{getCategoryEmoji(rec.category)}</span>
                </div>
                <div className="flex flex-col">
                  <Link to={`/product/${rec.id}`} className="font-bold text-brand-textPrimary hover:text-brand-blue line-clamp-2 leading-snug mb-1">
                    {rec.name}
                  </Link>
                  <p className="font-black mt-auto">₹{rec.price.toLocaleString()}</p>
                </div>
              </div>

              {/* XAI Reason */}
              <div className="px-5 pb-5 mt-auto">
                <div className="bg-blue-50 text-brand-blue text-xs p-3 rounded-xl flex items-start gap-2">
                  <Info size={16} className="shrink-0 mt-0.5" />
                  <p>{rec.reason}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default ProductDetailPage;
