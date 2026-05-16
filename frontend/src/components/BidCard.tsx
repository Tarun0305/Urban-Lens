import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Calendar, Users, IndianRupee } from 'lucide-react';

interface BidCardProps {
  bid: any;
  contractor: any;
  onAccept?: () => void;
  onReject?: () => void;
  showActions?: boolean;
}

const BidCard: React.FC<BidCardProps> = ({ bid, contractor, onAccept, onReject, showActions }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-primary font-bold text-lg">
            {contractor?.full_name ? contractor.full_name[0] : 'U'}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100">{contractor?.full_name || 'Contractor'}</h4>
            <div className="flex items-center space-x-1 text-yellow-500">
              <Star size={14} fill="currentColor" />
              <span className="text-sm font-medium">{contractor?.rating?.toFixed(1) || '5.0'}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center text-2xl font-bold text-primary dark:text-blue-400">
            <IndianRupee size={20} />
            {(bid?.quoted_price || 0).toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Quoted Price</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar size={16} className="text-primary" />
          <span>{new Date(bid.proposed_start_date).toLocaleDateString()} — {new Date(bid.proposed_end_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Users size={16} className="text-primary" />
          <span>{bid.proposed_workforce} workers</span>
        </div>
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
        "{bid.message}"
      </p>

      {showActions && (
        <div className="flex space-x-3">
          <button 
            onClick={onAccept}
            className="flex-1 bg-primary text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            {t('accept_bid')}
          </button>
          <button 
            onClick={onReject}
            className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-bold border border-red-100 hover:bg-red-100 transition-colors"
          >
            {t('reject_bid')}
          </button>
        </div>
      )}
    </div>
  );
};

export default BidCard;
