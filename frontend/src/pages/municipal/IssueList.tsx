import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, User, FileText, CheckCircle, TrendingUp } from 'lucide-react';
import client from '../../api/client';
import StatusBadge from '../../components/StatusBadge';
import AIResultCard from '../../components/AIResultCard';
import MediaViewer from '../../components/MediaViewer';
import BidCard from '../../components/BidCard';
import toast from 'react-hot-toast';

const IssueList: React.FC = () => {
  const [issues, setIssues] = useState<any[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    const res = await client.get('/reports');
    setIssues(res.data.reverse());
  };

  const openIssueDetail = async (issue: any) => {
    const res = await client.get(`/reports/${issue.id}`);
    setSelectedIssue(res.data);
    setIsPanelOpen(true);
  };

  const handleMarkDone = async (id: number) => {
    try {
      await client.post(`/reports/${id}/mark-done`);
      toast.success("Issue marked as resolved!");
      fetchIssues();
      setIsPanelOpen(false);
    } catch (err) {
      toast.error("Failed to mark as done");
    }
  };

  const filteredIssues = filterStatus 
    ? issues.filter((i: any) => i.status === filterStatus)
    : issues;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-4xl font-black">Issue Oversight</h1>
        <div className="flex items-center space-x-3">
          <select 
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-2 px-4 outline-none font-bold text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="bidding">Bidding</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search reports..." 
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700">
              <th className="px-6 py-4 text-xs font-black uppercase text-gray-400">Issue</th>
              <th className="px-6 py-4 text-xs font-black uppercase text-gray-400">Reporter</th>
              <th className="px-6 py-4 text-xs font-black uppercase text-gray-400">Status</th>
              <th className="px-6 py-4 text-xs font-black uppercase text-gray-400">Severity</th>
              <th className="px-6 py-4 text-xs font-black uppercase text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
            {filteredIssues.map((issue: any) => (
              <tr key={issue.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer" onClick={() => openIssueDetail(issue)}>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-700 overflow-hidden">
                       <img src={`${import.meta.env.VITE_API_BASE_URL || ''}${issue.image_url}`} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{issue.title}</p>
                      <p className="text-xs text-gray-500">{issue.area}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  User #{issue.citizen_id}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={issue.status} />
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${issue.severity === 'high' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'}`}>
                    {issue.severity}
                  </span>
                </td>
                <td className="px-6 py-4">
                   <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                      <Eye size={18} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredIssues.length === 0 && (
          <div className="py-20 text-center text-gray-400 font-bold">No issues found matching criteria.</div>
        )}
      </div>

      {/* Side Detail Panel */}
      <AnimatePresence>
        {isPanelOpen && selectedIssue && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPanelOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 shadow-2xl h-screen overflow-y-auto"
            >
              <div className="p-10 space-y-10">
                <div className="flex items-center justify-between">
                  <StatusBadge status={selectedIssue.report.status} />
                  <button onClick={() => setIsPanelOpen(false)} className="text-gray-400 hover:text-red-500">Close</button>
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-black">{selectedIssue.report.title}</h2>
                  <p className="text-gray-500 flex items-center"><FileText size={16} className="mr-2" /> ID: #{selectedIssue.report.id}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700">
                      <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Reporter</p>
                      <p className="font-bold flex items-center text-sm"><User size={14} className="mr-2" /> Citizen #{selectedIssue.report.citizen_id}</p>
                   </div>
                   <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700">
                      <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Location</p>
                      <p className="font-bold truncate text-sm">{selectedIssue.report.area}</p>
                   </div>
                </div>

                <AIResultCard result={selectedIssue.report} />

                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest">Evidence & Context</h3>
                  <MediaViewer 
                    image_url={selectedIssue.report.image_url} 
                    video_url={selectedIssue.report.video_url} 
                    audio_url={selectedIssue.report.audio_url} 
                  />
                  <div className="p-4 bg-blue-50 dark:bg-slate-800 rounded-2xl border border-blue-100 dark:border-slate-700">
                    <p className="text-sm italic">"{selectedIssue.report.description}"</p>
                    <p className="text-[10px] font-bold text-primary mt-2 uppercase tracking-widest">Detected Language: {selectedIssue.report.description_language}</p>
                  </div>
                </div>

                {/* Bid List for Bidding Status */}
                {selectedIssue.report.status === 'bidding' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest flex items-center">
                       <TrendingUp size={16} className="mr-2" /> Received Bids ({selectedIssue?.bids?.length || 0})
                    </h3>
                    <div className="space-y-4">
                      {(selectedIssue?.bids || []).map((bid: any) => (
                        <BidCard 
                          key={bid.bid.id} 
                          bid={bid.bid} 
                          contractor={bid.contractor} 
                          showActions={true}
                          onAccept={() => {
                             client.put(`/bids/${bid.bid.id}/accept`).then(() => {
                                toast.success("Bid accepted!");
                                fetchIssues();
                                setIsPanelOpen(false);
                             });
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {selectedIssue.report.status === 'in_progress' && (
                  <button 
                    onClick={() => handleMarkDone(selectedIssue.report.id)}
                    className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20"
                  >
                    <CheckCircle size={20} />
                    <span>Verify & Mark Resolved</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IssueList;
