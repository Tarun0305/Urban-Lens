import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, IndianRupee, Users, Calendar, Upload, Loader2, Play, Mic, Camera } from 'lucide-react';
import client from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import StatusBadge from '../../components/StatusBadge';
import MediaViewer from '../../components/MediaViewer';
import toast from 'react-hot-toast';

const MyTasks: React.FC = () => {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  // Progress Form
  const [note, setNote] = useState('');
  const [workers, setWorkers] = useState(0);
  const [spent, setSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    const res = await client.get('/reports');
    setTasks(res.data.filter((r: any) => r.assigned_contractor_id === user?.id && r.status !== 'done').reverse());
  };

  const handlePostProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('report_id', selectedTask.id.toString());
      formData.append('note', note);
      formData.append('workers_today', workers.toString());
      formData.append('money_spent', spent.toString());

      await client.post('/progress', formData);
      toast.success("Progress update posted!");
      setIsUploadOpen(false);
      setNote('');
      setWorkers(0);
      setSpent(0);
      fetchTasks();
    } catch (err) {
      toast.error("Failed to post progress");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black">My Active Tasks</h1>
        <p className="text-gray-500">Manage your assigned repairs and post daily updates.</p>
      </header>

      <div className="grid gap-8">
        {tasks.map((task: any) => (
          <motion.div 
            key={task.id}
            layoutId={`task-${task.id}`}
            className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col lg:flex-row"
          >
            <div className="lg:w-80 h-64 lg:h-auto relative overflow-hidden">
               <img src={`${import.meta.env.VITE_API_BASE_URL || ''}${task.image_url}`} className="w-full h-full object-cover" alt="" />
               <div className="absolute top-4 left-4">
                  <StatusBadge status={task.status} />
               </div>
            </div>

            <div className="flex-1 p-8 md:p-10 space-y-8">
               <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black">{task.title}</h2>
                    <p className="text-gray-500 flex items-center"><MapPin size={16} className="mr-2" /> {task.address}</p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                       <p className="text-[10px] font-black uppercase text-gray-400">Budget</p>
                       <p className="text-xl font-black text-primary flex items-center"><IndianRupee size={16} />{task.estimated_cost?.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black uppercase text-gray-400">Team Size</p>
                       <p className="text-xl font-black flex items-center justify-end"><Users size={16} className="mr-2" />{task.workforce_count}</p>
                    </div>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Timeline</h4>
                    <div className="flex items-center space-x-3 text-sm font-bold">
                       <Calendar className="text-primary" size={18} />
                       <span>{new Date(task.work_start_date).toLocaleDateString()} — {new Date(task.work_end_date).toLocaleDateString()}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                       <div className="h-full bg-primary w-[35%]" /> {/* Mock Progress */}
                    </div>
                  </div>
                  <div className="flex items-end justify-end">
                     <button 
                       onClick={() => { setSelectedTask(task); setIsUploadOpen(true); }}
                       className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all flex items-center"
                     >
                       <Upload className="mr-2" size={20} /> Post Daily Update
                     </button>
                  </div>
               </div>
            </div>
          </motion.div>
        ))}

        {tasks.length === 0 && (
          <div className="py-40 text-center bg-gray-50 dark:bg-slate-800 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-700">
             <h3 className="text-2xl font-bold text-gray-400">All caught up!</h3>
             <p className="text-gray-400">You don't have any active assignments right now.</p>
          </div>
        )}
      </div>

      {/* Progress Upload Modal */}
      <AnimatePresence>
        {isUploadOpen && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-12 space-y-8"
            >
              <div className="text-center space-y-2">
                 <h2 className="text-3xl font-black">Daily Progress</h2>
                 <p className="text-gray-500">Update for {selectedTask.title}</p>
              </div>

              <form onSubmit={handlePostProgress} className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-sm font-bold ml-1">Today's Work Summary</label>
                   <textarea 
                     required
                     className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary h-32"
                     placeholder="What was accomplished today?"
                     value={note}
                     onChange={(e) => setNote(e.target.value)}
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-sm font-bold ml-1">Workers Today</label>
                       <input 
                         type="number"
                         className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary"
                         value={workers}
                         onChange={(e) => setWorkers(parseInt(e.target.value))}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold ml-1">Daily Expenses (₹)</label>
                       <input 
                         type="number"
                         className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary"
                         value={spent}
                         onChange={(e) => setSpent(parseInt(e.target.value))}
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-4">
                    <div className="aspect-square bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-700 cursor-pointer hover:bg-gray-200 transition-colors">
                       <Camera className="text-gray-400" />
                    </div>
                    <div className="aspect-square bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-700 cursor-pointer hover:bg-gray-200 transition-colors">
                       <Play className="text-gray-400" />
                    </div>
                    <div className="aspect-square bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-700 cursor-pointer hover:bg-gray-200 transition-colors">
                       <Mic className="text-gray-400" />
                    </div>
                 </div>

                 <button 
                   type="submit"
                   disabled={isSubmitting}
                   className="w-full bg-primary text-white py-5 rounded-[2rem] font-black text-xl hover:bg-blue-700 shadow-2xl shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center justify-center"
                 >
                   {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Update"}
                 </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyTasks;
