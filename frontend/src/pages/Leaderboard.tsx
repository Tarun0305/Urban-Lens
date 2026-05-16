import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, TrendingUp, Award, Medal } from 'lucide-react';
import client from '../api/client';
import RatingStars from '../components/RatingStars';

const Leaderboard: React.FC = () => {
  const [contractors, setContractors] = useState<any[]>([]);

  useEffect(() => {
    client.get('/users/leaderboard').then(res => setContractors(res.data));
  }, []);

  return (
    <div className="space-y-12">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center px-4 py-2 bg-yellow-50 text-yellow-600 rounded-full font-black text-xs uppercase tracking-widest border border-yellow-100">
           <Trophy size={16} className="mr-2" /> Top Performance Leaderboard
        </div>
        <h1 className="text-5xl font-black">Contractor Honor Roll</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Celebrating our municipal partners who maintain the highest standards of quality and speed.</p>
      </header>

      {/* Podium */}
      <div className="grid md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto pt-10">
        {/* 2nd Place */}
        {contractors[1] && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-700 shadow-lg text-center space-y-4 relative h-fit"
          >
            <div className="w-12 h-12 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center absolute -top-6 left-1/2 -translate-x-1/2 border-4 border-white dark:border-slate-800 font-black">2</div>
            <div className="w-24 h-24 bg-slate-100 rounded-[2rem] mx-auto flex items-center justify-center text-4xl font-black">{contractors[1].full_name ? contractors[1].full_name[0] : 'U'}</div>
            <div>
               <h3 className="text-xl font-bold">{contractors[1].full_name}</h3>
               <div className="flex justify-center mt-1">
                 <RatingStars initialRating={contractors[1].rating} readonly />
               </div>
            </div>
            <p className="text-sm font-black text-slate-500 uppercase tracking-widest">{(contractors[1].rating || 0).toFixed(1)} Score</p>
          </motion.div>
        )}

        {/* 1st Place */}
        {contractors[0] && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary p-10 rounded-[4rem] text-white shadow-2xl shadow-blue-500/30 text-center space-y-6 relative z-10 scale-110 mb-10"
          >
            <div className="w-16 h-16 bg-yellow-400 text-white rounded-full flex items-center justify-center absolute -top-8 left-1/2 -translate-x-1/2 border-8 border-white dark:border-slate-900 shadow-xl ring-4 ring-yellow-400/20">
               <Trophy size={32} />
            </div>
            <div className="w-32 h-32 bg-white/20 rounded-[2.5rem] mx-auto flex items-center justify-center text-6xl font-black">{contractors[0].full_name ? contractors[0].full_name[0] : 'U'}</div>
            <div>
               <h3 className="text-3xl font-black">{contractors[0].full_name}</h3>
               <div className="flex justify-center mt-2 scale-110">
                  <Star fill="currentColor" size={24} className="text-yellow-400" />
                  <Star fill="currentColor" size={24} className="text-yellow-400" />
                  <Star fill="currentColor" size={24} className="text-yellow-400" />
                  <Star fill="currentColor" size={24} className="text-yellow-400" />
                  <Star fill="currentColor" size={24} className="text-yellow-400" />
               </div>
            </div>
            <div className="bg-white/20 py-3 px-6 rounded-2xl inline-block">
               <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">Efficiency Score</p>
               <p className="text-2xl font-black">{(contractors[0].rating || 0).toFixed(1)}</p>
            </div>
          </motion.div>
        )}

        {/* 3rd Place */}
        {contractors[2] && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-700 shadow-lg text-center space-y-4 relative h-fit"
          >
            <div className="w-12 h-12 bg-orange-200 text-orange-700 rounded-full flex items-center justify-center absolute -top-6 left-1/2 -translate-x-1/2 border-4 border-white dark:border-slate-800 font-black">3</div>
            <div className="w-24 h-24 bg-orange-50 rounded-[2rem] mx-auto flex items-center justify-center text-4xl font-black">{contractors[2].full_name ? contractors[2].full_name[0] : 'U'}</div>
            <div>
               <h3 className="text-xl font-bold">{contractors[2].full_name}</h3>
               <div className="flex justify-center mt-1">
                 <RatingStars initialRating={contractors[2].rating} readonly />
               </div>
            </div>
            <p className="text-sm font-black text-orange-600 uppercase tracking-widest">{(contractors[2].rating || 0).toFixed(1)} Score</p>
          </motion.div>
        )}
      </div>

      {/* List */}
      <div className="max-w-4xl mx-auto space-y-4">
         {contractors.slice(3).map((c: any, i) => (
           <div key={c.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-between hover:scale-[1.01] transition-transform">
              <div className="flex items-center space-x-6">
                 <span className="text-2xl font-black text-gray-300 w-8">{i + 4}</span>
                 <div className="w-12 h-12 bg-gray-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center font-bold text-gray-500">{c.full_name ? c.full_name[0] : 'U'}</div>
                 <h4 className="font-bold text-lg">{c.full_name || 'Unnamed'}</h4>
              </div>
              <div className="flex items-center space-x-8">
                 <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-gray-400">Rating</p>
                    <p className="font-bold flex items-center"><Star size={14} className="text-yellow-400 mr-1 fill-current" /> {(c.rating || 0).toFixed(1)}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-gray-400">Completed</p>
                    <p className="font-bold">12 Jobs</p>
                 </div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default Leaderboard;
