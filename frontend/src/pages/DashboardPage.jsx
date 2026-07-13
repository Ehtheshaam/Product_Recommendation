import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Database, Activity, Cpu, Layers } from 'lucide-react';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5001/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  // Dummy data for charts since backend only gives aggregates currently
  const categoryData = [
    { name: 'Men\'s Fashion', value: 8400 },
    { name: 'Women\'s Fashion', value: 9200 },
    { name: 'Kids & Baby', value: 4100 },
    { name: 'Accessories', value: 3800 },
  ];

  const confidenceData = [
    { name: 'Low (<20%)', count: 4847, fill: '#ef4444' }, // Red
    { name: 'Medium (20-40%)', count: 8200, fill: '#eab308' }, // Yellow
    { name: 'High (>40%)', count: 12450, fill: '#22c55e' }, // Green
  ];

  const COLORS = ['#2563EB', '#7C3AED', '#06B6D4', '#F59E0B'];

  if (!stats) return <div className="p-8 text-center text-brand-textSecondary mt-20">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl font-extrabold text-brand-textPrimary">ML Dashboard</h1>
        <p className="text-brand-textSecondary mt-2">Real-time performance and analytics for the recommendation engine.</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { title: 'Dataset Size', value: stats.total_products, icon: <Database /> },
          { title: 'Vocabulary Size', value: stats.vocabulary_size, icon: <Layers /> },
          { title: 'Features Generated', value: stats.features_generated, icon: <Cpu /> },
          { title: 'Categories', value: stats.categories, icon: <Activity /> },
        ].map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            className="glass p-6 rounded-2xl flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
              {kpi.icon}
            </div>
            <div>
              <p className="text-sm text-brand-textSecondary font-medium">{kpi.title}</p>
              <h3 className="text-2xl font-bold">{kpi.value?.toLocaleString()}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Distribution */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-6">Fashion Category Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 flex-wrap mt-4">
            {categoryData.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-brand-textSecondary">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                {entry.name}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Confidence Curve */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-2">Model Confidence Distribution</h3>
          <p className="text-sm text-brand-textSecondary mb-6">Cosine similarity confidence across generated recommendations.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip cursor={{fill: '#F8FAFC'}} formatter={(val) => val.toLocaleString()} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {confidenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};

export default DashboardPage;
