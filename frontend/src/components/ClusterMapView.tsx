import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

(L.Marker.prototype.options as any).icon = DefaultIcon;

interface ClusterMapViewProps {
  reports: any[];
}

const ClusterMapView: React.FC<ClusterMapViewProps> = ({ reports }) => {
  const center: [number, number] = [12.9716, 77.5946]; // Bengaluru default

  return (
    <MapContainer 
      center={center} 
      zoom={12} 
      scrollWheelZoom={false} 
      className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-slate-700"
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup>
        {reports.map((report) => (
          <Marker key={report.id} position={[report.latitude, report.longitude]}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-sm">{report.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{report.category} • {report.area}</p>
                <a 
                  href={`/report/${report.id}`} 
                  className="text-xs text-primary font-bold hover:underline"
                >
                  View Details
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default ClusterMapView;
