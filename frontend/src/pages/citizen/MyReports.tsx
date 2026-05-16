import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MessageSquare, Star, Clock, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import client from '../../api/client';
import StatusBadge from '../../components/StatusBadge';
import MediaViewer from '../../components/MediaViewer';
import RatingStars from '../../components/RatingStars';
import toast from 'react-hot-toast';

const MyReports: React.FC = () => {
  const { user } = useAuthStore();
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    fetchReports();
  }, [user]);

  const fetchReports = async () => {
    const res = await client.get('/reports');
    setReports(res.data.filter((r: any) => r.citizen_id === user?.id).reverse());
  };

  const openReportDetail = async (report: any) => {
    const res = await client.get(`/reports/${report.id}`);
    setSelectedReport(res.data);
    setIsModalOpen(true);
  };

  const handleSubmitReview = async () => {
    try {
      await client.post('/reviews', {
        report_id: selectedReport.report.id,
        reviewee_id: selectedReport.report.assigned_contractor_id,
        rating: reviewRating,
        comment: reviewComment
      });
      toast.success("Thank you for your feedback!");
      setIsModalOpen(false);
      fetchReports();
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-4xl font-black">My Reports</h1>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search issues..." 
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
            />
          </div>
          <button className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {reports.map((report: any) => (
          <motion.div 
            key={report.id}
            layoutId={`report-${report.id}`}
            onClick={() => openReportDetail(report)}
            className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-between hover:border-primary cursor-pointer group transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                <img 
                  src={report.image_url ? `${import.meta.env.VITE_API_BASE_URL || ''}${report.image_url}` : "https://images.unsplash.com/photo-1590333746438-283fd829a3a5?auto=format&fit=crop&q=80&w=200"} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                  alt=""
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">{report.title}</h3>
                <p className="text-sm text-gray-500">{report.area} • {new Date(report.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <StatusBadge status={report.status} />
              <div className={`hidden sm:flex flex-col items-end ${report.severity === 'high' ? 'text-red-500' : 'text-gray-400'}`}>
                <span className="text-[10px] font-black uppercase tracking-tighter">Severity</span>
                <span className="text-xs font-bold capitalize">{report.severity}</span>
              </div>
            </div>
          </motion.div>
        ))}
        {reports.length === 0 && (
          <div className="text-center py-20 bg-gray-50 dark:bg-slate-800 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-700">
            <p className="text-gray-400 font-bold">You haven't reported any issues yet.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 md:p-12 overflow-y-auto space-y-10">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-2">
                    <StatusBadge status={selectedReport.report.status} />
                    <h2 className="text-4xl font-black">{selectedReport.report.title}</h2>
                    <p className="text-gray-500 text-lg flex items-center"><Search size={18} className="mr-2" /> {selectedReport.report.address}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 h-fit min-w-[200px]">
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Issue Timeline</p>
                    <div className="space-y-4">
                      {[
                        { label: 'Reported', active: true, icon: Clock },
                        { label: 'Bidding', active: ['bidding', 'assigned', 'in_progress', 'done'].includes(selectedReport.report.status), icon: MessageSquare },
                        { label: 'Working', active: ['assigned', 'in_progress', 'done'].includes(selectedReport.report.status), icon: Star },
                        { label: 'Resolved', active: selectedReport.report.status === 'done', icon: CheckCircle2 }
                      ].map((step, i) => (
                        <div key={i} className={`flex items-center space-x-3 ${step.active ? 'text-primary' : 'text-gray-300'}`}>
                          <step.icon size={16} />
                          <span className="text-xs font-bold">{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-sm font-black uppercase text-gray-400 mb-4 tracking-widest">Evidence</h4>
                      <MediaViewer 
                        image_url={selectedReport.report.image_url} 
                        video_url={selectedReport.report.video_url} 
                        audio_url={selectedReport.report.audio_url} 
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase text-gray-400 mb-2 tracking-widest">Description</h4>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg italic">
                        "{selectedReport.report.description}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                     {selectedReport.report.status === 'done' ? (
                       <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 p-8 rounded-[2rem] space-y-6">
                          <div className="text-center space-y-2">
                            <h3 className="text-2xl font-black text-green-800 dark:text-green-300">Work Completed!</h3>
                            <p className="text-green-700 dark:text-green-400 text-sm">Please rate the service provided by the contractor.</p>
                          </div>
                          
                          <div className="flex flex-col items-center space-y-4">
                            <RatingStars initialRating={reviewRating} onRate={setReviewRating} />
                            <textarea 
                              className="w-full bg-white dark:bg-slate-800 border border-green-200 dark:border-green-800 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-green-500" 
                              placeholder="Your feedback..."
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                            />
                            <button 
                              onClick={handleSubmitReview}
                              className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition-colors"
                            >
                              Submit Review
                            </button>
                          </div>
                       </div>
                     ) : (
                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-8 rounded-[2rem] space-y-6">
                           <h3 className="text-xl font-bold">Assigned Team</h3>
                           {selectedReport.report.assigned_contractor_id ? (
                             <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-primary shadow-sm">C</div>
                                  <div>
                                    <p className="font-bold">Authorized Contractor</p>
                                    <p className="text-xs text-gray-500">Working on resolution</p>
                                  </div>
                                </div>
                                <div className="pt-4 border-t border-blue-200 dark:border-blue-900/50">
                                   <p className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase mb-2">Latest Progress</p>
                                   {selectedReport.progress.length > 0 ? (
                                      <div className="bg-white/50 dark:bg-slate-800/50 p-3 rounded-xl border border-blue-100 dark:border-blue-900/20">
                                         <p className="text-sm italic">"{selectedReport.progress[0].note}"</p>
                                         <p className="text-[10px] text-gray-500 mt-1">{new Date(selectedReport.progress[0].created_at).toLocaleDateString()}</p>
                                      </div>
                                   ) : (
                                      <p className="text-sm text-blue-600/60">Work is scheduled to begin soon.</p>
                                   )}
                                </div>
                             </div>
                           ) : (
                             <p className="text-gray-500 italic">Municipal officers are currently reviewing bids from contractors.</p>
                           )}
                        </div>
                     )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyReports;
