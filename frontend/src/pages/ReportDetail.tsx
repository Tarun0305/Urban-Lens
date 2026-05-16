import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, User, FileText } from 'lucide-react';
import client from '../api/client';
import StatusBadge from '../components/StatusBadge';
import MediaViewer from '../components/MediaViewer';
import AIResultCard from '../components/AIResultCard';

const ReportDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      client.get(`/reports/${id}`)
        .then(res => setData(res.data))
        .catch(() => navigate('/'));
    }
  }, [id, navigate]);

  if (!data) return <div className="p-20 text-center">Loading report details...</div>;

  const { report } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-500 hover:text-primary transition-colors font-bold">
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="p-8 md:p-12 space-y-8">
             <div className="space-y-4">
                <div className="flex items-center space-x-3">
                   <StatusBadge status={report.status} />
                   <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${report.severity === 'high' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'}`}>
                    {report.severity} Priority
                  </span>
                </div>
                <h1 className="text-4xl font-black">{report.title}</h1>
                <p className="text-gray-500 flex items-center"><MapPin size={18} className="mr-2 text-primary" /> {report.address}</p>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-700">
                   <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Reporter</p>
                   <p className="font-bold flex items-center text-sm"><User size={14} className="mr-2" /> Citizen #{report.citizen_id}</p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-700">
                   <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Report Date</p>
                   <p className="font-bold flex items-center text-sm"><Calendar size={14} className="mr-2" /> {new Date(report.created_at).toLocaleDateString()}</p>
                </div>
             </div>

             <div className="space-y-2">
                <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest flex items-center"><FileText size={16} className="mr-2" /> Description</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  "{report.description}"
                </p>
                {report.description_language !== 'en' && (
                  <p className="text-[10px] font-bold text-primary uppercase">Translated from {report.description_language}</p>
                )}
             </div>

             <AIResultCard result={report} />
          </div>

          <div className="bg-gray-50 dark:bg-slate-900/50 p-8 md:p-12 border-l border-gray-100 dark:border-slate-700">
             <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest mb-6">Media Evidence</h3>
             <MediaViewer 
                image_url={report.image_url}
                video_url={report.video_url}
                audio_url={report.audio_url}
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
