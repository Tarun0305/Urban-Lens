import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface AIResultCardProps {
  result: {
    ai_verified: boolean;
    ai_confidence: number;
    ai_result: string;
    ai_severity_assessment: string;
    ai_duplicate_flagged: boolean;
    severity: string;
  };
}

const AIResultCard: React.FC<AIResultCardProps> = ({ result }) => {
  const getSeverityColor = (s: string) => {
    if (s === 'high') return 'text-red-500 bg-red-50';
    if (s === 'medium') return 'text-orange-500 bg-orange-50';
    return 'text-green-500 bg-green-50';
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {result.ai_verified ? (
            <CheckCircle className="text-green-500" size={20} />
          ) : (
            <XCircle className="text-red-500" size={20} />
          )}
          <span className="font-bold text-gray-800 dark:text-gray-200">
            {result?.ai_verified ? "AI Verified" : "Verification Failed"}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-500">Confidence:</span>
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${(result?.ai_confidence || 0) > 70 ? 'bg-green-500' : 'bg-yellow-500'}`} 
              style={{ width: `${result?.ai_confidence || 0}%` }}
            ></div>
          </div>
          <span className="text-xs font-medium">{Math.round(result?.ai_confidence || 0)}%</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold uppercase tracking-wider ${getSeverityColor(result?.severity || 'low')}`}>
          Severity: {result?.severity || 'low'}
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
          "{result.ai_severity_assessment}"
        </p>

        {result.ai_duplicate_flagged && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg flex items-start space-x-2">
            <AlertTriangle className="mt-0.5 shrink-0" size={18} />
            <div>
              <p className="text-sm font-bold">Duplicate Detected</p>
              <p className="text-xs">Similar issue already reported nearby. Your report increases severity priority.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIResultCard;
