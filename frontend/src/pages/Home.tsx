import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Wrench, Users, Map as MapIcon, ChevronRight } from 'lucide-react';
import client from '../api/client';
import IssueCard from '../components/IssueCard';

const Home: React.FC = () => {
  const [recentIssues, setRecentIssues] = useState<any[]>([]);

  useEffect(() => {
    client.get('/reports').then(res => setRecentIssues(res.data.slice(0, 3)));
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 text-primary font-bold text-sm"
          >
            <Zap size={16} className="mr-2" />
            AI-Powered Civic Platform
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl font-extrabold tracking-tight"
          >
            Report. Verify. <span className="text-primary">Fix.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            UrbanLens uses cutting-edge AI to streamline civic issue reporting and resolution. 
            Empowering citizens and municipal officers to build better cities together.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/citizen/report" className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-500/20 flex items-center justify-center">
              Report an Issue <ChevronRight className="ml-2" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center justify-center">
              Login as Official
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: "Reports Resolved", value: "1,240+", icon: ShieldCheck, color: "text-green-500" },
          { label: "Active Cities", value: "12", icon: MapIcon, color: "text-blue-500" },
          { label: "Contractors", value: "85", icon: Wrench, color: "text-orange-500" },
          { label: "Citizens", value: "50,000+", icon: Users, color: "text-purple-500" },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 text-center space-y-2 shadow-sm"
          >
            <stat.icon className={`mx-auto ${stat.color}`} size={32} />
            <h3 className="text-3xl font-black">{stat.value}</h3>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </section>

      {/* How it works */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold">How it Works</h2>
          <p className="text-gray-500">Three simple steps to a better neighborhood</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {[
            { step: "01", title: "Report", desc: "Snap a photo or record a video of the issue. Our GPS auto-tags the location." },
            { step: "02", title: "AI Verify", desc: "GPT-4o Vision verifies the issue, assesses severity, and flags duplicates instantly." },
            { step: "03", title: "Fix", desc: "Contractors bid for the work. Municipal officers accept. The issue gets fixed fast." },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 space-y-4 relative overflow-hidden group">
              <span className="text-6xl font-black text-gray-100 dark:text-slate-700 absolute -top-4 -right-4 transition-colors group-hover:text-blue-50 dark:group-hover:text-slate-600">{item.step}</span>
              <h3 className="text-2xl font-bold relative z-10">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 relative z-10">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Issues */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Recent Reports</h2>
          <Link to="/leaderboard" className="text-primary font-bold hover:underline">View All</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {recentIssues.length > 0 ? (
            recentIssues.map((issue: any) => <IssueCard key={issue.id} issue={issue} />)
          ) : (
            <div className="col-span-3 text-center py-12 bg-gray-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-700">
               <p className="text-gray-500">No recent issues found. Be the first to report!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
