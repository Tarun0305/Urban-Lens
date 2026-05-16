import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Hammer, CheckCircle2, TrendingUp, Clock, Map as MapIcon } from 'lucide-react';
import client from '../../api/client';
import { useAuthStore } from '../../store/authStore';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    client.get('/analytics/summary').then(res => setSummary(res.data));
  }, []);

  if (!summary) return <div>Loading...</div>;

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black">Officer Console</h1>
          <p className="text-gray-500">City management and issue resolution oversight.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/municipal/issues" className="bg-white dark:bg-slate-800 px-6 py-3 border border-gray-200 dark:border-slate-700 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">Issues List</Link>
          <Link to="/municipal/bids" className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">Bid Manager</Link>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Pending Verification", value: summary.pending, icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-50" },
          { label: "Awaiting Bids", value: summary.bidding, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Active Repairs", value: summary.in_progress, icon: Hammer, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Resolved Today", value: summary.done, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center space-x-6"
          >
            <div className={`w-16 h-16 rounded-2xl ${stat.bg} dark:bg-slate-700 flex items-center justify-center ${stat.color}`}>
              <stat.icon size={32} />
            </div>
            <div>
              <p className="text-3xl font-black">{stat.value}</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Category Distribution */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
          <h2 className="text-xl font-bold flex items-center"><MapIcon className="mr-2 text-primary" size={20} /> Issues by Category</h2>
          <div className="space-y-4">
            {Object.entries(summary?.by_category || {}).map(([cat, count]: [any, any]) => (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize font-medium">{cat}</span>
                  <span className="font-bold">{count}</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${(count / summary.total_reports) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Severity Overview */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
          <h2 className="text-xl font-bold flex items-center"><AlertTriangle className="mr-2 text-orange-500" size={20} /> Criticality Levels</h2>
          <div className="grid grid-cols-1 gap-4">
            {['high', 'medium', 'low'].map((sev) => (
              <div key={sev} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${sev === 'high' ? 'bg-red-500' : sev === 'medium' ? 'bg-orange-500' : 'bg-green-500'}`} />
                  <span className="font-bold capitalize">{sev} Priority</span>
                </div>
                <span className="text-xl font-black">{summary?.by_severity?.[sev] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Efficiency Stats */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
          <h2 className="text-xl font-bold flex items-center"><Clock className="mr-2 text-green-500" size={20} /> Efficiency Metrics</h2>
          <div className="space-y-6">
            <div className="text-center p-6 bg-green-50 dark:bg-green-900/10 rounded-3xl border border-green-100 dark:border-green-800">
               <p className="text-4xl font-black text-green-700 dark:text-green-300">{summary.avg_resolution_days}</p>
               <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mt-1">Avg Resolution Days</p>
            </div>
            <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800">
               <p className="text-4xl font-black text-blue-700 dark:text-blue-300">92%</p>
               <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1">Contractor Compliance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
