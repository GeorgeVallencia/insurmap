'use client';
import { useState } from "react";
import Map from '@vis.gl/react-mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

// Simple Map Component - Just displays a zoomable map
export default function EnhancedMapView() {
  const [viewState, setViewState] = useState({
    longitude: 36.8219, // Nairobi, Kenya coordinates
    latitude: -1.2921,
    zoom: 10
  });

  return (
    <div className="relative w-full">
      {/* Map Info Panel */}
      <div className="absolute top-4 left-4 z-10 bg-white p-3 rounded-lg shadow-lg border">
        <div className="text-sm font-semibold text-gray-800 mb-1">
          Interactive Map
        </div>
        <div className="text-xs text-gray-600">
          Zoom Level: {Math.round(viewState.zoom * 10) / 10}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          • Mouse wheel to zoom
        </div>
        <div className="text-xs text-gray-500">
          • Click and drag to pan
        </div>
      </div>

      {/* Map Container */}
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoidmFsZW5jaWFnZW9yZ2UiLCJhIjoiY21mdHFzNG96MHl2aDJrc2RxOGZhemxwdyJ9.IGYdggPowFgd5cap8_g8tQ'}
        style={{
          width: '100%',
          height: 'calc(100vh - 100px)',
          minHeight: '500px'
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        // Enable all zoom/pan interactions
        dragPan={true}
        scrollZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        keyboard={true}
        dragRotate={false}
        pitchWithRotate={false}
      />
    </div>
  );
}
