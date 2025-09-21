
'use client';
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Map, { Marker } from 'react-map-gl/mapbox';
import { Plus, MapPin, TrendingUp, AlertTriangle } from "lucide-react";
import 'mapbox-gl/dist/mapbox-gl.css';

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


// Risk-based marker colors
const getRiskColor = (riskScore: number) => {
  if (riskScore > 70) return '#EF4444'; // Red for high risk
  if (riskScore > 40) return '#F59E0B'; // Yellow for medium risk
  return '#10B981'; // Green for low risk
};



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
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Fetch properties from your API
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties', {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json',
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
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json',
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
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Refresh properties to show updated risk scores
      setTimeout(() => fetchProperties(), 1000);
    } catch (error) {
      console.error('Error assessing risk:', error);
    }
  };

  // Handle map click
  const handleMapClick = (evt: any) => {
    const { lng, lat } = evt.lngLat;
    setClickCoordinates({ lat, lng });
    setEditingProperty(null);
    setSelectedProperty(null);
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
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.your_mapbox_token_here'}
        initialViewState={{
          longitude: 36.8219,
          latitude: -1.2921,
          zoom: 10
        }}
        style={{
          height: 'calc(100vh - 100px)',
          width: '100%'
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onClick={handleMapClick}
      >
        {properties.map((property) => (
          <Marker
            key={property.id}
            longitude={property.longitude}
            latitude={property.latitude}
            anchor="bottom"
            onClick={() => setSelectedProperty(property)}
          >
            <div
              style={{
                backgroundColor: getRiskColor(property.risk_score),
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {Math.round(property.risk_score)}
            </div>
          </Marker>
        ))}
      </Map>
      
      {/* Property Popup */}
      {selectedProperty && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] bg-white p-4 rounded-lg shadow-lg border max-w-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-sm">{selectedProperty.address}</h3>
            <button 
              onClick={() => setSelectedProperty(null)}
              className="text-gray-400 hover:text-gray-600 text-lg font-bold leading-none"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Risk Score:</span>
              <span className={`font-bold ${
                selectedProperty.risk_score > 70 ? 'text-red-600' :
                selectedProperty.risk_score > 40 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {selectedProperty.risk_score}/100
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="capitalize">{selectedProperty.property_type}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="capitalize">{selectedProperty.status}</span>
            </div>
            
            {selectedProperty.estimated_value && (
              <div className="flex justify-between">
                <span>Value:</span>
                <span>${selectedProperty.estimated_value.toLocaleString()}</span>
              </div>
            )}
          </div>

          {selectedProperty.risk_factors && Object.keys(selectedProperty.risk_factors).length > 0 && (
            <div className="mt-3 pt-2 border-t">
              <div className="text-sm font-medium mb-1">Risk Factors:</div>
              {selectedProperty.risk_factors.flood && (
                <div className="text-xs">Flood: {selectedProperty.risk_factors.flood}</div>
              )}
              {selectedProperty.risk_factors.fire && (
                <div className="text-xs">Fire: {selectedProperty.risk_factors.fire}</div>
              )}
              {selectedProperty.risk_factors.crime && (
                <div className="text-xs">Crime: {selectedProperty.risk_factors.crime}</div>
              )}
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => handleEditProperty(selectedProperty)}
              className="flex-1 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => assessRisk(selectedProperty.id)}
              className="flex-1 bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
            >
              Re-assess Risk
            </button>
          </div>
        </div>
      )}

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

