
'use client';
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import Supercluster from "supercluster";
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

// Custom marker component
const RiskMarker = ({ 
  longitude, 
  latitude, 
  riskScore, 
  onClick 
}: {
  longitude: number;
  latitude: number;
  riskScore: number;
  onClick: () => void;
}) => {
  const color = getRiskColor(riskScore);
  
  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      onClick={onClick}
    >
      <div
        style={{
          backgroundColor: color,
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
        {Math.round(riskScore)}
      </div>
    </Marker>
  );
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
  const [viewState, setViewState] = useState({
    longitude: 36.8219,
    latitude: -1.2921,
    zoom: 10
  });

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

  // Clustering logic
  const supercluster = useMemo(() => {
    const cluster = new Supercluster({
      radius: 40,
      maxZoom: 16
    });
    
    const points = properties.map(property => ({
      type: 'Feature' as const,
      properties: {
        cluster: false,
        property
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [property.longitude, property.latitude]
      }
    }));
    
    cluster.load(points);
    return cluster;
  }, [properties]);
  
  const clusters = useMemo(() => {
    return supercluster.getClusters([
      viewState.longitude - (180 / Math.pow(2, viewState.zoom)),
      viewState.latitude - (85 / Math.pow(2, viewState.zoom)),
      viewState.longitude + (180 / Math.pow(2, viewState.zoom)),
      viewState.latitude + (85 / Math.pow(2, viewState.zoom))
    ], Math.floor(viewState.zoom));
  }, [supercluster, viewState]);

  // Handle map clicks
  const handleMapClick = (event: any) => {
    const { lng, lat } = event.lngLat;
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
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: '100%', height: 'calc(100vh - 100px)' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.your_mapbox_token_here'}
        onClick={handleMapClick}
      >
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount } = cluster.properties;
          
          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                longitude={longitude}
                latitude={latitude}
                onClick={() => {
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id as number),
                    20
                  );
                  setViewState({
                    ...viewState,
                    longitude,
                    latitude,
                    zoom: expansionZoom
                  });
                }}
              >
                <div
                  style={{
                    backgroundColor: '#4285f4',
                    width: `${20 + (pointCount / properties.length) * 20}px`,
                    height: `${20 + (pointCount / properties.length) * 20}px`,
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {pointCount}
                </div>
              </Marker>
            );
          }
          
          const property = cluster.properties.property;
          return (
            <RiskMarker
              key={property.id}
              longitude={longitude}
              latitude={latitude}
              riskScore={property.risk_score}
              onClick={() => setSelectedProperty(property)}
            />
          );
        })}
        
        {selectedProperty && (
          <Popup
            longitude={selectedProperty.longitude}
            latitude={selectedProperty.latitude}
            onClose={() => setSelectedProperty(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="w-64">
              <h3 className="font-bold mb-2">{selectedProperty.address}</h3>
              
              <div className="space-y-2">
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
          </Popup>
        )}
      </Map>

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

