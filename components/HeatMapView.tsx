/**
 * HeatMapView Component
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
import Map, { Marker, Popup, Source, Layer } from 'react-map-gl';
import type { LayerProps } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Report {
  _id: string;
  title: string;
  location: {
    coordinates: [number, number];
  };
  status: string;
  categoryId: {
    name: string;
    icon: string;
    color: string;
  };
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

export default function HeatMapView({ initialViewState }: HeatMapViewProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewState, setViewState] = useState(
    initialViewState || {
      longitude: 77.5946, // Default to India (Delhi)
      latitude: 12.9716,
      zoom: 12,
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
        10,
        1,
      ],
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(33,102,172,0)',
        0.2,
        'rgb(103,169,207)',
        0.4,
        'rgb(209,229,240)',
        0.6,
        'rgb(253,219,199)',
        0.8,
        'rgb(239,138,98)',
        1,
        'rgb(178,24,43)',
      ],
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
      'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0.5],
    },
  };

  if (loading) {
    return (
      <div className="w-full h-[600px] bg-card rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex gap-4">
      {/* Map - 70% width */}
      <div className="w-[70%] h-[600px] rounded-lg overflow-hidden border">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        >
          <Source
            id="heatmap-data"
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: heatmapData.map((point) => ({
                type: 'Feature',
                properties: {
                  totalCount: point.totalCount,
                  resolvedCount: point.resolvedCount,
                  resolutionRate: point.resolutionRate,
                },
                geometry: {
                  type: 'Point',
                  coordinates: [point.lng, point.lat],
                },
              })),
            }}
          >
            <Layer {...heatmapLayer} />
          </Source>

          {reports.map((report) => (
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
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-lg transform hover:scale-110 transition-transform"
                style={{ backgroundColor: getMarkerColor(report.status) }}
              >
                <span className="text-white text-xs">
                  {report.categoryId?.icon || '📍'}
                </span>
              </div>
            </Marker>
          ))}

          {selectedReport && (
            <Popup
              longitude={selectedReport.location.coordinates[0]}
              latitude={selectedReport.location.coordinates[1]}
              anchor="top"
              onClose={() => setSelectedReport(null)}
              closeOnClick={false}
            >
              <div className="p-2 min-w-[200px]">
                <h4 className="font-semibold text-sm mb-1">{selectedReport.title}</h4>
                <p className="text-xs text-gray-600 mb-2">
                  Status: <span className="font-medium">{selectedReport.status}</span>
                </p>
                <p className="text-xs text-gray-600">
                  Category: {selectedReport.categoryId?.name}
                </p>
              </div>
            </Popup>
          )}
        </Map>
      </div>

      {/* Info Panel - 30% width */}
      <div className="w-[30%] h-[600px] space-y-4 overflow-y-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">🗺️ Heat Map Guide</h3>
          <p className="text-sm text-blue-100">
            Interactive visualization of infrastructure issues across your city
          </p>
        </div>

        {/* Statistics Card */}
        <div className="bg-card border rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            📊 Map Statistics
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Total Reports</span>
              <span className="text-sm font-bold text-blue-500">{reports.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Heat Zones</span>
              <span className="text-sm font-bold text-blue-500">{heatmapData.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Avg Resolution</span>
              <span className="text-sm font-bold text-green-500">
                {heatmapData.length > 0
                  ? Math.round(
                      heatmapData.reduce((acc, curr) => acc + curr.resolutionRate, 0) /
                        heatmapData.length
                    )
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* How to Read Card */}
        <div className="bg-card border rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            💡 How to Read
          </h4>
          <div className="space-y-3 text-xs">
            <div>
              <p className="font-medium mb-1">Heat Intensity</p>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ background: 'rgb(178,24,43)' }}></div>
                <span className="text-muted-foreground">High density areas</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-4 h-4 rounded" style={{ background: 'rgb(103,169,207)' }}></div>
                <span className="text-muted-foreground">Low density areas</span>
              </div>
            </div>
            <div>
              <p className="font-medium mb-1">Marker Colors</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-muted-foreground">Submitted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-muted-foreground">Under Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-muted-foreground">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-muted-foreground">Resolved</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interaction Tips Card */}
        <div className="bg-card border rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            🎮 Interactions
          </h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Click markers to view report details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Drag to pan, scroll to zoom</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Red zones indicate high issue density</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Zoom in for more precise locations</span>
            </li>
          </ul>
        </div>

        {/* Key Insights Card */}
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-950/50 border border-blue-800/50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2 text-blue-400">
            ✨ Key Insights
          </h4>
          <ul className="space-y-1.5 text-xs text-blue-200">
            <li className="flex items-start gap-2">
              <span>🔥</span>
              <span>Heatmap shows real-time issue distribution</span>
            </li>
            <li className="flex items-start gap-2">
              <span>📍</span>
              <span>Each marker represents a reported issue</span>
            </li>
            <li className="flex items-start gap-2">
              <span>📈</span>
              <span>Track progress through color-coded statuses</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
