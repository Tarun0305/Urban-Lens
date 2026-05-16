import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Briefcase, TrendingUp, AlertCircle, Send, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import client from '../../api/client';
import StatusBadge from '../../components/StatusBadge';
import IssueCard from '../../components/IssueCard';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTasks, setActiveTasks] = useState<any[]>([]);
  const [openBidding, setOpenBidding] = useState<any[]>([]);
  const [stats, setStats] = useState({ rating: 5.0, earnings: 0, completed: 0 });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    const reportsRes = await client.get('/reports');
    setActiveTasks(reportsRes.data.filter((r: any) => r.assigned_contractor_id === user?.id && r.status !== 'done'));
    setOpenBidding(reportsRes.data.filter((r: any) => r.status === 'bidding' && (user?.specializations || []).some((s: string) => s === r.category)));
    
    setStats({
      rating: user?.rating || 5.0,
      earnings: 450000, // Mock
      completed: 12
    });
  };

  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [selectedIssueForBid, setSelectedIssueForBid] = useState<any>(null);
  const [bidPrice, setBidPrice] = useState<number>(0);
  const [bidMessage, setBidMessage] = useState('');
  const [bidDays, setBidDays] = useState(7);

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await client.post('/bids', {
        report_id: selectedIssueForBid.id,
        quoted_price: bidPrice,
        proposed_start_date: new Date().toISOString(),
        proposed_end_date: new Date(Date.now() + bidDays * 86400000).toISOString(),
        proposed_workforce: 5,
        message: bidMessage
      });
      toast.success("Bid submitted successfully!");
      setIsBidModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Failed to submit bid");
    }
  };

  return (
    <div className="space-y-10">
      {/* Existing content... */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
           <div className="w-20 h-20 bg-primary text-white rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-2xl shadow-blue-500/20">
              {user?.full_name ? user.full_name[0] : 'U'}
           </div>
           <div>
              <h1 className="text-4xl font-black">{user?.full_name || 'Contractor'}</h1>
              <div className="flex items-center space-x-2 text-yellow-500">
                <Star size={18} fill="currentColor" />
                <span className="font-bold text-lg">{user?.rating?.toFixed(1) || '5.0'} Rating</span>
              </div>
           </div>
        </div>
        <div className="flex space-x-4">
           <div className="bg-white dark:bg-slate-800 px-6 py-4 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm text-center">
              <p className="text-2xl font-black">{stats.completed}</p>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Jobs Done</p>
           </div>
           <div className="bg-white dark:bg-slate-800 px-6 py-4 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm text-center">
              <p className="text-2xl font-black text-green-500">₹{stats.earnings.toLocaleString()}</p>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Earned</p>
           </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-10">
         {/* Active Tasks */}
         <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center"><Briefcase className="mr-2 text-primary" size={24} /> Active Assignments</h2>
              <span className="px-3 py-1 bg-blue-50 text-primary rounded-full text-xs font-bold">{activeTasks.length} Projects</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
               {activeTasks.map((task: any) => (
                 <IssueCard key={task.id} issue={task} />
               ))}
               {activeTasks.length === 0 && (
                 <div className="col-span-2 py-20 text-center bg-gray-50 dark:bg-slate-800 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-slate-700">
                    <p className="text-gray-400 font-bold">No active tasks. Check open bidding issues.</p>
                 </div>
               )}
            </div>
         </div>

         {/* Smart Bid Routing - Matching Skills */}
         <div className="space-y-8">
            <h2 className="text-2xl font-bold flex items-center"><TrendingUp className="mr-2 text-green-500" size={24} /> Recommended for You</h2>
            <div className="space-y-4">
               {openBidding.map((issue: any) => (
                 <motion.div 
                   key={issue.id}
                   whileHover={{ scale: 1.02 }}
                   className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm space-y-4"
                 >
                    <div className="flex justify-between items-start">
                       <span className="px-2.5 py-0.5 bg-green-50 text-green-600 rounded-md text-[10px] font-black uppercase tracking-wider">Skill Match: {issue.category}</span>
                       <StatusBadge status="bidding" />
                    </div>
                    <h3 className="font-bold text-lg leading-tight">{issue.title}</h3>
                    <div className="flex justify-between items-center pt-2">
                       <p className="text-xs text-gray-500">{issue.area}</p>
                       <button 
                         className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center"
                         onClick={() => { setSelectedIssueForBid(issue); setIsBidModalOpen(true); }}
                       >
                         Place Bid <Send size={12} className="ml-1" />
                       </button>
                    </div>
                 </motion.div>
               ))}
               {openBidding.length === 0 && (
                  <div className="p-8 text-center bg-gray-50 dark:bg-slate-800 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
                    <AlertCircle className="mx-auto text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400 font-medium">No new matching issues in your area.</p>
                  </div>
               )}
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] space-y-4 relative overflow-hidden">
               <div className="relative z-10 space-y-4">
                 <h3 className="text-xl font-bold">Today's Goal</h3>
                 <p className="text-sm opacity-70">Complete your daily progress updates to maintain your reliability score.</p>
                 <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle2 size={16} />
                    <span className="text-sm font-bold">2 Updates Pending</span>
                 </div>
               </div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
            </div>
         </div>
      </div>

      {/* Bid Form Modal */}
      <AnimatePresence>
        {isBidModalOpen && selectedIssueForBid && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBidModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-10 space-y-6"
            >
              <h2 className="text-2xl font-black">Submit Project Bid</h2>
              <p className="text-sm text-gray-500">Issue: {selectedIssueForBid.title}</p>
              
              <form onSubmit={handleSubmitBid} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Your Quote (₹)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. 50000"
                    value={bidPrice}
                    onChange={(e) => setBidPrice(parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Estimated Days to Complete</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary"
                    value={bidDays}
                    onChange={(e) => setBidDays(parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Proposal Message</label>
                  <textarea 
                    required
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary h-24"
                    placeholder="Briefly describe your approach..."
                    value={bidMessage}
                    onChange={(e) => setBidMessage(e.target.value)}
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Submit Proposal
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
