
// 1. First, let's create the database schema (SQL)
/*
-- Add this to your database:
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL, -- Reference to your users table
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    property_type VARCHAR(50) DEFAULT 'residential',
    status VARCHAR(20) DEFAULT 'lead',
    estimated_value DECIMAL(12, 2),
    risk_score DECIMAL(4, 2) DEFAULT 0,
    risk_factors JSONB DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_properties_location ON properties(latitude, longitude);
*/

// 2. Enhanced MapView Component with all features
'use client';
import { useState, useCallback, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, MarkerClusterGroup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/lib/assets/MarkerCluster.css";
import "react-leaflet-cluster/lib/assets/MarkerCluster.Default.css";
import { Plus, MapPin, TrendingUp, AlertTriangle } from "lucide-react";

// Fix default marker icons
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

// Types
interface Property {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
  property_type: string;
  status: string;
  estimated_value?: number;
  risk_score: number;
  risk_factors: {
    flood?: number;
    fire?: number;
    crime?: number;
  };
  notes?: string;
  created_at: string;
}

// Risk-based marker icons
const createRiskIcon = (riskScore: number) => {
  let color = '#10B981'; // Green for low risk
  if (riskScore > 70) color = '#EF4444'; // Red for high risk
  else if (riskScore > 40) color = '#F59E0B'; // Yellow for medium risk

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: white;
        font-weight: bold;
      ">
        ${Math.round(riskScore)}
      </div>
    `,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Click handler component for adding properties
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Property Form Modal
function PropertyModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData = null,
  coordinates = null 
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: any) => void;
  initialData?: Property | null;
  coordinates?: { lat: number; lng: number } | null;
}) {
  const [formData, setFormData] = useState({
    address: '',
    property_type: 'residential',
    estimated_value: '',
    notes: '',
    latitude: coordinates?.lat || 0,
    longitude: coordinates?.lng || 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        address: initialData.address,
        property_type: initialData.property_type,
        estimated_value: initialData.estimated_value?.toString() || '',
        notes: initialData.notes || '',
        latitude: initialData.latitude,
        longitude: initialData.longitude,
      });
    } else if (coordinates) {
      setFormData(prev => ({
        ...prev,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      }));
    }
  }, [initialData, coordinates]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      estimated_value: parseFloat(formData.estimated_value) || 0,
      id: initialData?.id,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? 'Edit Property' : 'Add New Property'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Property Type</label>
            <select
              value={formData.property_type}
              onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estimated Value (USD)</label>
            <input
              type="number"
              value={formData.estimated_value}
              onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
              className="w-full p-2 border rounded-lg"
              min="0"
              step="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Latitude</label>
              <input
                type="number"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                className="w-full p-2 border rounded-lg"
                step="any"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Longitude</label>
              <input
                type="number"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                className="w-full p-2 border rounded-lg"
                step="any"
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Save Property
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Enhanced Map Component
export default function EnhancedMapView() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [clickCoordinates, setClickCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Fetch properties from your API
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust based on your auth
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save property (create or update)
  const saveProperty = async (propertyData: any) => {
    try {
      const url = propertyData.id ? `/api/properties/${propertyData.id}` : '/api/properties';
      const method = propertyData.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(propertyData),
      });

      if (response.ok) {
        await fetchProperties(); // Refresh the list
        
        // If it's a new property, trigger risk assessment
        if (!propertyData.id) {
          const newProperty = await response.json();
          assessRisk(newProperty.id);
        }
      }
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  // Assess risk for a property
  const assessRisk = async (propertyId: number) => {
    try {
      await fetch(`/api/risk/assess/${propertyId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Refresh properties to show updated risk scores
      setTimeout(() => fetchProperties(), 1000);
    } catch (error) {
      console.error('Error assessing risk:', error);
    }
  };

  // Handle map clicks
  const handleMapClick = (lat: number, lng: number) => {
    setClickCoordinates({ lat, lng });
    setEditingProperty(null);
    setIsModalOpen(true);
  };

  // Handle property edit
  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setClickCoordinates(null);
    setIsModalOpen(true);
  };

  // Load properties on mount
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return (
    <div className="relative">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-[1000] bg-white p-2 rounded-lg shadow-lg">
        <div className="text-sm font-medium mb-2">Properties: {properties.length}</div>
        <div className="text-xs text-gray-600">Click map to add property</div>
      </div>

      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={fetchProperties}
          disabled={loading}
          className="bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white p-3 rounded-lg shadow-lg">
        <div className="text-sm font-medium mb-2">Risk Levels</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Low Risk (0-40)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span>Medium Risk (41-70)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>High Risk (71-100)</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[-1.2921, 36.8219]} // Nairobi
        zoom={10}
        style={{ height: "calc(100vh - 100px)", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onMapClick={handleMapClick} />
        
        <MarkerClusterGroup>
          {properties.map((property) => (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={createRiskIcon(property.risk_score)}
            >
              <Popup>
                <div className="w-64">
                  <h3 className="font-bold mb-2">{property.address}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Risk Score:</span>
                      <span className={`font-bold ${
                        property.risk_score > 70 ? 'text-red-600' :
                        property.risk_score > 40 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {property.risk_score}/100
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="capitalize">{property.property_type}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="capitalize">{property.status}</span>
                    </div>
                    
                    {property.estimated_value && (
                      <div className="flex justify-between">
                        <span>Value:</span>
                        <span>${property.estimated_value.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {property.risk_factors && Object.keys(property.risk_factors).length > 0 && (
                    <div className="mt-3 pt-2 border-t">
                      <div className="text-sm font-medium mb-1">Risk Factors:</div>
                      {property.risk_factors.flood && (
                        <div className="text-xs">Flood: {property.risk_factors.flood}</div>
                      )}
                      {property.risk_factors.fire && (
                        <div className="text-xs">Fire: {property.risk_factors.fire}</div>
                      )}
                      {property.risk_factors.crime && (
                        <div className="text-xs">Crime: {property.risk_factors.crime}</div>
                      )}
                    </div>
                  )}

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleEditProperty(property)}
                      className="flex-1 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => assessRisk(property.id)}
                      className="flex-1 bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                    >
                      Re-assess Risk
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Property Modal */}
      <PropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={saveProperty}
        initialData={editingProperty}
        coordinates={clickCoordinates}
      />
    </div>
  );
}

// 'use client';

// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";

// // Fix default marker icons (works only in browser)
// if (typeof window !== "undefined") {
//   delete (L.Icon.Default.prototype as any)._getIconUrl;
//   L.Icon.Default.mergeOptions({
//     iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//     iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//     shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//   });
// }

// export default function MapView() {
//   return (
//     <MapContainer
//       center={[0.0236, 37.9062]} // Center on Kenya
//       zoom={6}
//       style={{ height: "100vh", width: "100%" }}
//     >
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       {/* Example marker */}
//       <Marker position={[-1.2921, 36.8219]}>
//         <Popup>Nairobi</Popup>
//       </Marker>
//     </MapContainer>
//   );
// }
