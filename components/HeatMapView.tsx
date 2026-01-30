/**
 * HeatMapView Component - Enhanced Mapbox Features
 * 
 * REQUIRED DEPENDENCIES:
 * Run: npm install mapbox-gl react-map-gl
 * Also add: npm install --save-dev @types/mapbox-gl
 * 
 * REQUIRED ENV VARIABLES:
 * NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
 * Get token from: https://account.mapbox.com/access-tokens/
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import Map, { Marker, Popup, Source, Layer, NavigationControl, GeolocateControl, FullscreenControl, ScaleControl } from 'react-map-gl';
import type { LayerProps, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  Map as MapIcon, Layers, BarChart3, RotateCcw, 
  Info, Satellite, Building, Moon, Sun, Trees, 
  Compass, Construction, Lightbulb, Droplet, 
  Droplets, Trash2, Milestone, Bus, Wrench
} from 'lucide-react';

interface Report {
  _id: string;
  title: string;
  description: string;
  location: {
    coordinates: [number, number];
  };
  status: string;
  priority: string;
  category: string;
  address: string;
  createdAt: string;
  upvotes: number;
}

interface HeatmapData {
  lng: number;
  lat: number;
  totalCount: number;
  resolvedCount: number;
  resolutionRate: number;
}

interface HeatMapViewProps {
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
}

const MAP_STYLES = {
  street: 'mapbox://styles/mapbox/streets-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  dark: 'mapbox://styles/mapbox/dark-v11',
  light: 'mapbox://styles/mapbox/light-v11',
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
  navigation: 'mapbox://styles/mapbox/navigation-day-v1',
};

export default function HeatMapView({ initialViewState }: HeatMapViewProps) {
  const mapRef = useRef<MapRef>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapStyle, setMapStyle] = useState<keyof typeof MAP_STYLES>('satellite');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [viewState, setViewState] = useState(
    initialViewState || {
      longitude: 77.5946,
      latitude: 12.9716,
      zoom: 12,
      pitch: 0,
      bearing: 0,
    }
  );

  useEffect(() => {
    fetchReports();
    fetchHeatmapData();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports?limit=100');
      const data = await response.json();
      if (data.success) {
        setReports(data.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHeatmapData = async () => {
    try {
      const response = await fetch('/api/analytics/heatmap');
      const data = await response.json();
      if (data.success) {
        setHeatmapData(data.data);
      }
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
    }
  };

  const getMarkerColor = (status: string) => {
    const colors: Record<string, string> = {
      submitted: '#3b82f6',
      under_review: '#eab308',
      in_progress: '#8b5cf6',
      resolved: '#22c55e',
      closed: '#6b7280',
      rejected: '#dc2626',
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: '#6b7280',
      medium: '#3b82f6',
      high: '#f59e0b',
      urgent: '#dc2626',
    };
    return colors[priority] || '#3b82f6';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      potholes: Construction,
      'street lights': Lightbulb,
      'water supply': Droplet,
      drainage: Droplets,
      'garbage collection': Trash2,
      'roads & pavements': Milestone,
      roads: Milestone,
      water: Droplet,
      streetlight: Lightbulb,
      waste: Trash2,
    };
    const Icon = icons[category.toLowerCase()] || Wrench;
    return <Icon className="w-5 h-5 text-white" />;
  };

  const flyToReport = (report: Report) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [report.location.coordinates[0], report.location.coordinates[1]],
        zoom: 16,
        duration: 2000,
        essential: true,
      });
      setSelectedReport(report);
    }
  };

  const resetView = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [viewState.longitude, viewState.latitude],
        zoom: 12,
        pitch: 0,
        bearing: 0,
        duration: 1500,
      });
    }
  };

  const heatmapLayer: LayerProps = {
    id: 'heatmap',
    type: 'heatmap',
    source: 'heatmap-data',
    paint: {
      'heatmap-weight': [
        'interpolate',
        ['linear'],
        ['get', 'totalCount'],
        0,
        0,
        20,
        1,
      ],
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 15, 2],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(0,0,255,0)',
        0.1,
        'royalblue',
        0.3,
        'cyan',
        0.5,
        'lime',
        0.7,
        'yellow',
        1,
        'red',
      ],
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 3, 15, 30],
      'heatmap-opacity': 0.8,
    },
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-black via-gray-950 to-blue-950/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading interactive map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-black via-gray-950 to-blue-950/20 relative overflow-hidden">
      {/* Map Container */}
      <div className="absolute inset-0 z-0">
        <Map
          ref={mapRef}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapStyle={MAP_STYLES[mapStyle]}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          style={{ width: '100%', height: '100%' }}
          maxZoom={20}
          minZoom={3}
        >
          {/* Heatmap Layer */}
          {showHeatmap && (
            <Source
              id="heatmap-data"
              type="geojson"
              data={{
                type: 'FeatureCollection',
                features: reports.map((report) => ({
                  type: 'Feature',
                  properties: {
                    totalCount: 1,
                    status: report.status,
                    priority: report.priority,
                  },
                  geometry: {
                    type: 'Point',
                    coordinates: [report.location.coordinates[0], report.location.coordinates[1]],
                  },
                })),
              }}
            >
              <Layer {...heatmapLayer} />
            </Source>
          )}

          {/* Report Markers */}
          {showMarkers && reports.map((report) => (
            <Marker
              key={report._id}
              longitude={report.location.coordinates[0]}
              latitude={report.location.coordinates[1]}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedReport(report);
              }}
            >
              <div
                className="relative w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-2xl transform hover:scale-125 transition-all duration-300 border-2 border-white"
                style={{ 
                  backgroundColor: getMarkerColor(report.status),
                  boxShadow: `0 0 20px ${getMarkerColor(report.status)}80`
                }}
              >
                {getCategoryIcon(report.category)}
                {report.priority === 'urgent' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                )}
              </div>
            </Marker>
          ))}

          {/* Popup for Selected Report */}
          {selectedReport && (
            <Popup
              longitude={selectedReport.location.coordinates[0]}
              latitude={selectedReport.location.coordinates[1]}
              anchor="bottom"
              onClose={() => setSelectedReport(null)}
              closeOnClick={false}
              className="custom-popup"
              offset={15}
            >
              <div className="p-4 min-w-[280px] max-w-[320px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-white text-base pr-2">{selectedReport.title}</h4>
                  <div className="text-2xl">{getCategoryIcon(selectedReport.category)}</div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Status:</span>
                    <span 
                      className="px-2 py-1 rounded text-xs font-semibold text-white"
                      style={{ backgroundColor: getMarkerColor(selectedReport.status) }}
                    >
                      {selectedReport.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Priority:</span>
                    <span 
                      className="px-2 py-1 rounded text-xs font-semibold text-white"
                      style={{ backgroundColor: getPriorityColor(selectedReport.priority) }}
                    >
                      {selectedReport.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white text-xs flex-1">{selectedReport.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Upvotes:</span>
                    <span className="text-cyan-400 font-semibold">👍 {selectedReport.upvotes}</span>
                  </div>
                  
                  <button
                    onClick={() => flyToReport(selectedReport)}
                    className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold text-sm transition-all"
                  >
                    📍 Center on Map
                  </button>
                </div>
              </div>
            </Popup>
          )}

          {/* Mapbox Built-in Controls */}
          <NavigationControl position="top-right" showCompass showZoom style={{ top: 10, right: 10 }} />
          <GeolocateControl position="top-right" trackUserLocation showUserHeading style={{ top: 100, right: 10 }} />
          <FullscreenControl position="top-right" style={{ top: 150, right: 10 }} />
          <ScaleControl position="bottom-right" style={{ bottom: 10, right: 10 }} />
        </Map>
      </div>

      {/* Left Control Panel - Scrollable */}
      <div className="absolute top-4 left-4 bottom-4 w-72 z-20 pointer-events-none">
        <div className="h-full overflow-y-auto overflow-x-hidden pointer-events-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-800">
          <div className="space-y-3">
            {/* Map Style Selector */}
            <div className="bg-gray-900/95 backdrop-blur-xl border-2 border-blue-500/30 rounded-xl p-4 shadow-2xl">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                <MapIcon className="w-5 h-5" />
                Map Style
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(MAP_STYLES) as Array<keyof typeof MAP_STYLES>).map((style) => (
                  <button
                    key={style}
                    onClick={() => setMapStyle(style)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 justify-center ${
                      mapStyle === style
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {style === 'satellite' && <Satellite className="w-4 h-4" />} 
                    {style === 'street' && <Building className="w-4 h-4" />} 
                    {style === 'dark' && <Moon className="w-4 h-4" />} 
                    {style === 'light' && <Sun className="w-4 h-4" />} 
                    {style === 'outdoors' && <Trees className="w-4 h-4" />} 
                    {style === 'navigation' && <Compass className="w-4 h-4" />} 
                    <span>{style.charAt(0).toUpperCase() + style.slice(1)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Layer Controls */}
            <div className="bg-gray-900/95 backdrop-blur-xl border-2 border-blue-500/30 rounded-xl p-4 shadow-2xl">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                <Layers className="w-5 h-5" />
                Layers
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={showHeatmap}
                    onChange={(e) => setShowHeatmap(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                  />
                  <span className="text-white text-sm group-hover:text-cyan-400 transition-colors">Show Heatmap</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={showMarkers}
                    onChange={(e) => setShowMarkers(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                  />
                  <span className="text-white text-sm group-hover:text-cyan-400 transition-colors">Show Markers</span>
                </label>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-900/95 backdrop-blur-xl border-2 border-blue-500/30 rounded-xl p-4 shadow-2xl">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                <BarChart3 className="w-5 h-5" />
                Statistics
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">Total Reports</span>
                  <span className="text-cyan-400 font-bold text-sm">{reports.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">Resolved</span>
                  <span className="text-green-400 font-bold text-sm">
                    {reports.filter(r => r.status === 'resolved').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">In Progress</span>
                  <span className="text-yellow-400 font-bold text-sm">
                    {reports.filter(r => r.status === 'in_progress').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">Urgent</span>
                  <span className="text-red-400 font-bold text-sm">
                    {reports.filter(r => r.priority === 'urgent').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900/95 backdrop-blur-xl border-2 border-blue-500/30 rounded-xl p-4 shadow-2xl">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                <RotateCcw className="w-5 h-5" />
                Quick Actions
              </h3>
              <button
                onClick={resetView}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <RotateCcw className="w-4 h-4" />
                Reset View
              </button>
            </div>

            {/* Legend */}
            <div className="bg-gray-900/95 backdrop-blur-xl border-2 border-blue-500/30 rounded-xl p-4 shadow-2xl">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                <Info className="w-5 h-5" />
                Legend
              </h3>
              <div className="space-y-2">
                <div className="text-xs text-gray-300 font-semibold mb-2">Status Colors:</div>
                {[
                  { status: 'submitted', label: 'Submitted', color: '#3b82f6' },
                  { status: 'under_review', label: 'Under Review', color: '#eab308' },
                  { status: 'in_progress', label: 'In Progress', color: '#8b5cf6' },
                  { status: 'resolved', label: 'Resolved', color: '#22c55e' },
                ].map((item) => (
                  <div key={item.status} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full border-2 border-white flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-300 text-xs">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions - Top Center */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-gray-900/90 backdrop-blur-xl border-2 border-blue-500/30 rounded-xl px-6 py-3 shadow-2xl">
          <p className="text-white text-sm font-semibold flex items-center gap-2">
            <Info className="w-5 h-5" />
            Click markers to view details • Use controls to navigate
          </p>
        </div>
      </div>
    </div>
  );
}
