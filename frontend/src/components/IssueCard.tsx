import React from 'react';
import StatusBadge from './StatusBadge';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface IssueCardProps {
  issue: any;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || '';

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
      <div className="relative h-48">
        <img 
          src={issue?.image_url ? `${baseURL}${issue.image_url}` : "https://images.unsplash.com/photo-1590333746438-283fd829a3a5?auto=format&fit=crop&q=80&w=800"} 
          alt={issue?.title || 'Issue'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={issue?.status || 'pending'} />
        </div>
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${issue?.severity === 'high' ? 'bg-red-500' : issue?.severity === 'medium' ? 'bg-orange-500' : 'bg-green-500'}`}>
          {issue?.severity || 'low'}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold mb-1 truncate">{issue?.title || 'Unnamed Issue'}</h3>
        <div className="flex items-center text-gray-500 text-xs mb-3 space-x-3">
          <div className="flex items-center">
            <MapPin size={14} className="mr-1" />
            {issue?.area || 'Unknown Area'}
          </div>
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {issue?.created_at ? new Date(issue.created_at).toLocaleDateString() : 'N/A'}
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4 h-10">
          {issue?.description || 'No description provided.'}
        </p>
        
        <Link 
          to={`/report/${issue?.id || 0}`}
          className="flex items-center justify-between w-full p-2 text-sm font-bold text-primary dark:text-blue-400 bg-blue-50 dark:bg-slate-700/50 rounded-xl hover:bg-primary hover:text-white transition-colors group-hover:bg-primary group-hover:text-white"
        >
          <span>View Details</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default IssueCard;
