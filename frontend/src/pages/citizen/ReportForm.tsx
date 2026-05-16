import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

let DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

(L.Marker.prototype.options as any).icon = DefaultIcon;
import { Camera, Video, Mic, MapPin, Send, Loader2 } from 'lucide-react';
import client from '../../api/client';
import AIResultCard from '../../components/AIResultCard';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 'pothole', label: 'Pothole', icon: '🕳️' },
  { id: 'garbage', label: 'Garbage', icon: '🗑️' },
  { id: 'streetlight', label: 'Streetlight', icon: '💡' },
  { id: 'tree_fall', label: 'Tree Fall', icon: '🌳' },
  { id: 'other', label: 'Other', icon: '❓' },
];

const ReportForm: React.FC = () => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  // Form State
  const [location, setLocation] = useState({ lat: 12.9716, lng: 77.5946, address: '', area: '', road: '' });
  const [selectedCategory, setSelectedCategory] = useState('pothole');

  const [files, setFiles] = useState<{ image?: File, video?: File, audio?: Blob }>({});
  const [previews, setPreviews] = useState<{ image?: string, video?: string, audio?: string }>({});
  const [aiResult, setAIResult] = useState<any>(null);
  const [description, setDescription] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState('');

  // Voice Recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setLocation(prev => ({ ...prev, lat: latitude, lng: longitude }));
      // Reverse geocode
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
        .then(res => res.json())
        .then(data => {
          setLocation(prev => ({
            ...prev,
            address: data.display_name,
            area: data.address.suburb || data.address.neighbourhood || '',
            road: data.address.road || ''
          }));
        });
    });
  }, []);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setLocation(prev => ({ ...prev, lat: e.latlng.lat, lng: e.latlng.lng }));
      },
    });
    return <Marker position={[location.lat, location.lng] as [number, number]} />;
  };

  const handleFileUpload = async (type: 'image' | 'video' | 'audio', file: File | Blob) => {
    if (type === 'image') {
      setFiles(prev => ({ ...prev, image: file as File }));
      setPreviews(prev => ({ ...prev, image: URL.createObjectURL(file as Blob) }));

      // Trigger AI Pass
      setIsAIProcessing(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', selectedCategory);
      formData.append('lat', location.lat.toString());
      formData.append('lng', location.lng.toString());

      try {
        const res = await client.post('/reports/upload-media', formData);
        setAIResult(res.data);
        if (res.data?.ai_result) setDescription(prev => prev || res.data.ai_result);
      } catch (err: any) {
        toast.error(err.response?.data?.detail || "AI verification failed");
        setFiles(prev => ({ ...prev, image: undefined }));
        setPreviews(prev => ({ ...prev, image: undefined }));
      } finally {
        setIsAIProcessing(false);
      }
    } else if (type === 'video') {
      setFiles(prev => ({ ...prev, video: file as File }));
      setPreviews(prev => ({ ...prev, video: URL.createObjectURL(file as Blob) }));
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setPreviews(prev => ({ ...prev, audio: URL.createObjectURL(blob) }));
        setFiles(prev => ({ ...prev, audio: blob }));

        // Call Whisper
        const formData = new FormData();
        formData.append('audio', blob, 'desc.webm');
        const res = await client.post('/speech/transcribe', formData);
        setDescription(res.data.transcript);
        setVoiceLanguage(res.data.detected_language);
      };

      recorder.start();
      setIsRecordingVoice(true);
    } catch (err) {
      toast.error("Microphone access denied");
    }
  };

  const stopVoiceRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecordingVoice(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // First upload media if not already uploaded by AI pass
      let mediaUrls = { image_url: aiResult?.image_url, video_url: aiResult?.video_url, audio_url: aiResult?.audio_url };

      if (!mediaUrls.video_url && files.video) {
        const fd = new FormData();
        fd.append('video', files.video);
        const res = await client.post('/reports/upload-media', fd);
        mediaUrls.video_url = res.data.video_url;
      }

      if (!mediaUrls.audio_url && files.audio) {
        const fd = new FormData();
        fd.append('audio', files.audio, 'voice.webm');
        const res = await client.post('/reports/upload-media', fd);
        mediaUrls.audio_url = res.data.audio_url;
      }

      await client.post('/reports', {
        title: `${selectedCategory.toUpperCase()} Issue at ${location.road || location.area}`,
        description,
        category: selectedCategory,
        latitude: location.lat,
        longitude: location.lng,
        address: location.address,
        area: location.area,
        road_name: location.road,
        image_url: mediaUrls.image_url,
        video_url: mediaUrls.video_url,
        audio_url: mediaUrls.audio_url,
        severity: aiResult?.severity || 'low',
        ai_verified: aiResult?.ai_verified || false,
        ai_confidence: aiResult?.ai_confidence,
        ai_result: aiResult?.ai_result,
        ai_severity_assessment: aiResult?.ai_severity_assessment,
        ai_duplicate_flagged: aiResult?.ai_duplicate_flagged || false,
        ai_cluster_group_id: aiResult?.ai_cluster_group_id
      });

      toast.success("Report submitted successfully!");
      navigate('/citizen/dashboard');
    } catch (err) {
      toast.error("Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-4xl font-black">Report an Issue</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <MapPin size={16} />
          <span>{location.area || "Detecting location..."}</span>
        </div>
      </div>

      <div className="space-y-12 bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-xl">
        {/* Step 1: Location */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 text-primary rounded-full flex items-center justify-center font-bold">1</div>
            <h2 className="text-2xl font-bold">Location</h2>
          </div>
          <div className="h-80 rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-700 relative">
            <MapContainer center={[location.lat, location.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker />
            </MapContainer>
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-4 rounded-2xl border border-white dark:border-slate-700 shadow-lg z-[1000]">
              <p className="text-xs font-bold uppercase text-gray-500 mb-1">Detected Address</p>
              <p className="text-sm truncate">{location.address || "Fetching address..."}</p>
            </div>
          </div>
        </section>

        {/* Step 2: Category */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 text-primary rounded-full flex items-center justify-center font-bold">2</div>
            <h2 className="text-2xl font-bold">Issue Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center space-y-2 ${selectedCategory === cat.id
                  ? 'border-primary bg-blue-50 dark:bg-slate-700 text-primary scale-105'
                  : 'border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600'
                  }`}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-bold">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 3: Media */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 text-primary rounded-full flex items-center justify-center font-bold">3</div>
            <h2 className="text-2xl font-bold">Evidence</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Photo */}
            <div className="space-y-4">
              <label className="block p-8 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors relative overflow-hidden group">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload('image', e.target.files[0])} />
                {previews.image ? (
                  <img src={previews.image} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="space-y-2">
                    <Camera className="mx-auto text-gray-400 group-hover:text-primary transition-colors" size={32} />
                    <p className="text-sm font-bold">Upload Photo</p>
                  </div>
                )}
                {isAIProcessing && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="animate-spin text-primary" />
                    <p className="text-xs font-bold text-primary animate-pulse">AI Verification...</p>
                  </div>
                )}
              </label>
              {aiResult && <AIResultCard result={aiResult} />}
            </div>

            {/* Video */}
            <label className="block p-8 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors relative overflow-hidden group h-fit">
              <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload('video', e.target.files[0])} />
              {previews.video ? (
                <video src={previews.video} className="w-full h-full object-cover" />
              ) : (
                <div className="space-y-2">
                  <Video className="mx-auto text-gray-400 group-hover:text-primary transition-colors" size={32} />
                  <p className="text-sm font-bold">Upload Video</p>
                </div>
              )}
            </label>

            {/* Audio */}
            <div className="p-8 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl text-center space-y-4">
              <div className="space-y-2">
                <Mic className="mx-auto text-gray-400" size={32} />
                <p className="text-sm font-bold">Voice Description</p>
              </div>
              <button
                onClick={isRecordingVoice ? stopVoiceRecording : startVoiceRecording}
                className={`w-full py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all ${isRecordingVoice ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-slate-700 hover:bg-gray-200'
                  }`}
              >
                {isRecordingVoice ? <><span className="w-2 h-2 bg-white rounded-full animate-ping" /> <span>Stop Recording</span></> : <span>Start Recording</span>}
              </button>
              {previews.audio && (
                <div className="pt-2">
                  <audio src={previews.audio} controls className="w-full scale-90" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Step 4: Details */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 text-primary rounded-full flex items-center justify-center font-bold">4</div>
            <h2 className="text-2xl font-bold">Details</h2>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold ml-1">Description</label>
                {voiceLanguage && <span className="text-[10px] bg-blue-100 text-primary px-2 py-0.5 rounded-full font-bold uppercase">Detected: {voiceLanguage}</span>}
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
                placeholder="Describe the issue in detail..."
              />
            </div>
          </div>
        </section>

        {/* Step 5: Submit */}
        <div className="pt-8 border-t border-gray-100 dark:border-slate-700">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !previews.image}
            className="w-full bg-primary text-white py-5 rounded-3xl font-black text-xl hover:bg-blue-700 shadow-2xl shadow-blue-500/30 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>Submit Report <Send className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={24} /></>
            )}
          </button>
          {!previews.image && <p className="text-center text-xs text-red-500 font-bold mt-4 uppercase tracking-wider">At least one photo is required for AI verification</p>}
        </div>
      </div>
    </div>
  );
};

export default ReportForm;
