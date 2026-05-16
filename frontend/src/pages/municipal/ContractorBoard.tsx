import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, Users, CheckCircle, Clock } from 'lucide-react';
import client from '../../api/client';
import RatingStars from '../../components/RatingStars';

const ContractorBoard: React.FC = () => {
  const [contractors, setContractors] = useState<any[]>([]);

  useEffect(() => {
    client.get('/users/leaderboard').then(res => setContractors(res.data));
  }, []);

  return (
    <div className="space-y-10">
       <header className="space-y-2">
        <h1 className="text-4xl font-black">Authorized Contractors</h1>
        <p className="text-gray-500">Performance tracking and quality audit of municipal partners.</p>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
           {contractors.map((contractor: any, i) => (
             <motion.div 
               key={contractor.id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.05 }}
               className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
             >
               <div className="flex items-center space-x-6">
                 <div className="relative">
                     <div className="w-20 h-20 bg-blue-50 dark:bg-slate-700 rounded-3xl flex items-center justify-center text-primary text-3xl font-black shadow-inner">
                       {contractor.full_name ? contractor.full_name[0] : 'U'}
                     </div>
                    {i < 3 && (
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-400 text-white rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg">
                        <Trophy size={14} />
                      </div>
                    )}
                 </div>
                 <div className="space-y-1">
                   <h3 className="text-2xl font-bold">{contractor.full_name || 'Anonymous Contractor'}</h3>
                    <div className="flex items-center space-x-3">
                      <RatingStars initialRating={contractor.rating || 5.0} readonly />
                      <span className="text-sm font-bold text-gray-500">({(contractor.rating || 5.0).toFixed(1)})</span>
                    </div>
                   <div className="flex flex-wrap gap-2 pt-2">
                     {contractor.specializations?.map((spec: string) => (
                       <span key={spec} className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 rounded-md text-[10px] font-bold uppercase tracking-wider text-gray-500">{spec}</span>
                     ))}
                   </div>
                 </div>
               </div>

               <div className="flex items-center space-x-8 text-center border-t md:border-t-0 md:border-l border-gray-100 dark:border-slate-700 pt-6 md:pt-0 md:pl-8">
                 <div>
                   <p className="text-2xl font-black">24</p>
                   <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Jobs Done</p>
                 </div>
                 <div>
                   <p className="text-2xl font-black text-green-500">98%</p>
                   <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Reliability</p>
                 </div>
                 <div>
                   <p className="text-2xl font-black text-primary">4.2d</p>
                   <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Avg Speed</p>
                 </div>
               </div>
             </motion.div>
           ))}
        </div>

        <div className="space-y-8">
           <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-500/30 space-y-6">
              <h3 className="text-xl font-bold flex items-center"><Users size={20} className="mr-2" /> Top Performer</h3>
              <div className="text-center space-y-2">
                 <div className="w-24 h-24 bg-white/20 rounded-3xl mx-auto flex items-center justify-center text-4xl font-black">
                    {contractors[0]?.full_name ? contractors[0].full_name[0] : 'U'}
                 </div>
                 <h4 className="text-2xl font-black">{contractors[0]?.full_name || 'Top Contractor'}</h4>
                 <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest">
                    Platinum Partner
                 </div>
              </div>
              <div className="space-y-3 pt-4">
                 <div className="flex justify-between text-sm">
                   <span className="opacity-70">Resolution Score</span>
                   <span className="font-bold">99.4</span>
                 </div>
                 <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                   <div className="h-full bg-white w-[99%]" />
                 </div>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
              <h3 className="text-xl font-bold">Audit Summary</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-2xl">
                    <div className="flex items-center space-x-2">
                       <CheckCircle size={16} className="text-green-500" />
                       <span className="text-sm font-medium">Verified Status</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">Active</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-2xl">
                    <div className="flex items-center space-x-2">
                       <Clock size={16} className="text-orange-500" />
                       <span className="text-sm font-medium">Next Audit</span>
                    </div>
                    <span className="text-sm font-bold">14 Days</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorBoard;
