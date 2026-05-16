import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import BidCard from '../../components/BidCard';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';

const BidManager: React.FC = () => {
  const [biddingIssues, setBiddingIssues] = useState<any[]>([]);
  const [selectedIssueBids, setSelectedIssueBids] = useState<any>(null);

  useEffect(() => {
    fetchBiddingIssues();
  }, []);

  const fetchBiddingIssues = async () => {
    const res = await client.get('/reports?status=bidding');
    setBiddingIssues(res.data);
  };

  const loadBidsForIssue = async (issue: any) => {
    const res = await client.get(`/bids/${issue.id}`);
    setSelectedIssueBids({ issue, bids: res.data });
  };

  const handleAcceptBid = async (bidId: number) => {
    try {
      await client.put(`/bids/${bidId}/accept`);
      toast.success("Bid accepted successfully!");
      setSelectedIssueBids(null);
      fetchBiddingIssues();
    } catch (err) {
      toast.error("Failed to accept bid");
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/municipal/dashboard" className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 hover:text-primary transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-4xl font-black">Bid Selection</h1>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-bold text-sm">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </header>

      {selectedIssueBids ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-blue-50 dark:bg-slate-800 p-8 rounded-[2.5rem] border border-blue-100 dark:border-slate-700 flex justify-between items-center">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-primary tracking-widest">Comparing Bids For</p>
              <h2 className="text-3xl font-black">{selectedIssueBids.issue.title}</h2>
              <p className="text-gray-500 font-medium">{selectedIssueBids.issue.area} • {selectedIssueBids?.bids?.length || 0} Bids Received</p>
            </div>
            <button 
              onClick={() => setSelectedIssueBids(null)}
              className="px-6 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl font-bold hover:text-red-500 transition-colors"
            >
              Back to List
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {selectedIssueBids.bids.map((bid: any) => (
              <BidCard 
                key={bid.bid.id} 
                bid={bid.bid} 
                contractor={bid.contractor} 
                showActions={true}
                onAccept={() => handleAcceptBid(bid.bid.id)}
              />
            ))}
            {selectedIssueBids.bids.length === 0 && (
              <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-slate-800 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-slate-700">
                <p className="text-gray-500 font-bold">No bids have been placed for this issue yet.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {biddingIssues.map((issue: any) => (
            <motion.div 
              key={issue.id}
              whileHover={{ y: -5 }}
              onClick={() => loadBidsForIssue(issue)}
              className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-primary transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-blue-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-primary text-xl">
                   {issue.category === 'pothole' ? '🕳️' : issue.category === 'garbage' ? '🗑️' : '💡'}
                 </div>
                 <StatusBadge status="bidding" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{issue.title}</h3>
              <p className="text-sm text-gray-500 mb-6">{issue.area} • {new Date(issue.created_at).toLocaleDateString()}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-slate-700">
                <div className="flex items-center text-primary font-bold">
                  <TrendingUp size={16} className="mr-2" />
                  <span>View Bids</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-gray-400">Received</p>
                  <p className="font-bold">Pending...</p>
                </div>
              </div>
            </motion.div>
          ))}
          {biddingIssues.length === 0 && (
            <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-slate-800 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-slate-700">
              <p className="text-gray-500 font-bold">No issues currently awaiting bid selection.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BidManager;
