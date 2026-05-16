import React, { useState } from 'react';
import { Play, Maximize2, Volume2 } from 'lucide-react';

interface MediaViewerProps {
  image_url?: string;
  video_url?: string;
  audio_url?: string;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ image_url, video_url, audio_url }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL || '';

  return (
    <div className="space-y-4">
      {image_url && (
        <div className="relative group">
          <img 
            src={`${baseURL}${image_url}`} 
            alt="Issue Report" 
            className={`w-full rounded-xl object-cover cursor-pointer transition-all ${isExpanded ? 'max-h-none' : 'max-h-64'}`}
            onClick={() => setIsExpanded(!isExpanded)}
          />
          <button 
            className="absolute bottom-2 right-2 p-2 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Maximize2 size={18} />
          </button>
        </div>
      )}

      {video_url && (
        <div className="bg-black rounded-xl overflow-hidden aspect-video">
          <video 
            src={`${baseURL}${video_url}`} 
            controls 
            preload="metadata"
            className="w-full h-full"
          />
        </div>
      )}

      {audio_url && (
        <div className="bg-blue-50 dark:bg-slate-700/50 p-4 rounded-xl flex items-center space-x-4 border border-blue-100 dark:border-slate-700">
          <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
            <Volume2 size={20} />
          </div>
          <audio 
            src={`${baseURL}${audio_url}`} 
            controls 
            className="flex-1"
          />
        </div>
      )}
    </div>
  );
};

export default MediaViewer;
