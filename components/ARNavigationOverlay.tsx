'use client';

import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Navigation2, MapPin, AlertCircle, Clock, 
  Construction, Lightbulb, Droplet, Droplets, 
  Trash2, Milestone, Trees, Bus, Wrench 
} from 'lucide-react';

// Extend DeviceOrientationEvent for iOS webkit properties
interface DeviceOrientationEventWithWebkit extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

interface Issue {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  address: string;
  location: {
    coordinates: [number, number]; // [lng, lat]
  };
  createdAt: string;
}

interface ARNavigationOverlayProps {
  issue: Issue;
  userLocation: { lat: number; lng: number };
  distance: number; // in meters
  bearing: number; // in degrees
  onClose: () => void;
}

export default function ARNavigationOverlay({
  issue,
  userLocation,
  distance,
  bearing,
  onClose
}: ARNavigationOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [deviceOrientation, setDeviceOrientation] = useState<number>(0);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [needsCalibration, setNeedsCalibration] = useState(false);

  useEffect(() => {
    // Request camera access
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Use back camera
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.error('Camera access error:', err);
        setCameraError(err.message || 'Failed to access camera');
      }
    };

    startCamera();

    // Handle device orientation for compass heading
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const eventWithWebkit = event as DeviceOrientationEventWithWebkit;
      
      if (event.alpha !== null) {
        // alpha gives compass heading (0-360)
        // 0 = North, 90 = East, 180 = South, 270 = West
        let heading = event.alpha;
        
        // For iOS, we need to adjust based on webkitCompassHeading if available
        if (eventWithWebkit.webkitCompassHeading !== undefined) {
          heading = eventWithWebkit.webkitCompassHeading;
        } else {
          // For Android, alpha is the compass heading
          heading = 360 - event.alpha; // Invert for proper direction
        }
        
        setDeviceOrientation(heading);
        setCompassHeading(heading);
        
        // Check if compass needs calibration (erratic readings)
        if (event.alpha === 0 || (event.absolute === false)) {
          setNeedsCalibration(true);
        } else {
          setNeedsCalibration(false);
        }
      }
    };

    // Try to use deviceorientationabsolute first (more accurate)
    const tryAbsoluteOrientation = () => {
      window.addEventListener('deviceorientationabsolute', handleOrientation as any, true);
    };

    // Request device orientation
    if (typeof DeviceOrientationEvent !== 'undefined') {
      if ('requestPermission' in DeviceOrientationEvent) {
        // iOS 13+ requires permission
        (DeviceOrientationEvent as any).requestPermission()
          .then((response: string) => {
            if (response === 'granted') {
              // Try absolute first, fallback to regular
              tryAbsoluteOrientation();
              window.addEventListener('deviceorientation', handleOrientation);
            }
          })
          .catch(console.error);
      } else {
        // Android and older iOS
        tryAbsoluteOrientation();
        window.addEventListener('deviceorientation', handleOrientation);
      }
    }

    return () => {
      // Cleanup
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('deviceorientationabsolute', handleOrientation as any);
    };
  }, []);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.alpha !== null) {
      setDeviceOrientation(event.alpha);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      potholes: Construction,
      'street lights': Lightbulb,
      'water supply': Droplet,
      drainage: Droplets,
      'garbage collection': Trash2,
      'roads & pavements': Milestone,
      'parks & gardens': Trees,
      'public transport': Bus,
      roads: Milestone,
      water: Droplet,
      electricity: Lightbulb,
      streetlight: Lightbulb,
      waste: Trash2,
    };
    const Icon = icons[category.toLowerCase()] || Wrench;
    return Icon;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      submitted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      under_review: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      in_progress: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  // Calculate arrow rotation relative to device orientation and target bearing
  const arrowRotation = bearing - deviceOrientation;
  
  // Calculate relative angle (normalized to -180 to 180)
  let relativeAngle = arrowRotation;
  while (relativeAngle > 180) relativeAngle -= 360;
  while (relativeAngle < -180) relativeAngle += 360;
  
  // Check if issue is in viewing cone (±45 degrees from forward direction)
  const VIEWING_ANGLE = 45; // degrees on each side
  const isInView = Math.abs(relativeAngle) <= VIEWING_ANGLE;

  const CategoryIcon = getCategoryIcon(issue.category);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {cameraError && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <Card className="max-w-md mx-4 bg-red-900/20 border-red-500">
            <div className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-400 mb-2">Camera Access Error</h3>
              <p className="text-sm text-gray-300">{cameraError}</p>
              <p className="text-xs text-gray-400 mt-4">
                Please grant camera permissions to use AR navigation
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* AR Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Show arrow only if issue is in viewing cone */}
        {isInView ? (
          <>
            {/* Directional Arrow - Points downward when issue is ahead */}
            <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div
                style={{ 
                  transform: `rotate(${relativeAngle}deg)`,
                  transition: 'transform 0.3s ease-out'
                }}
                className="relative"
              >
                {/* Outer glow */}
                <div className="absolute inset-0 animate-pulse">
                  <svg className="w-24 h-24 text-blue-400 drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L12 18M12 18L6 12M12 18L18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
                {/* Main arrow pointing down */}
                <svg className="w-24 h-24 text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,1)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L12 18M12 18L6 12M12 18L18 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
                
                {/* Distance indicator below arrow */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-sm px-3 py-1.5 rounded-full border-2 border-blue-400">
                  <p className="text-white font-bold text-sm whitespace-nowrap">
                    {distance.toFixed(1)}m
                  </p>
                </div>
              </div>
            </div>

            {/* Distance Display - Top Center */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2">
              <div className="bg-black/95 backdrop-blur-md px-3 py-1.5 rounded-lg border-2 border-green-500/50 shadow-xl shadow-green-500/20">
                <p className="text-xl font-bold text-white text-center">
                  {distance.toFixed(1)} <span className="text-sm text-green-400">m</span>
                </p>
              </div>
            </div>
          </>
        ) : (
          /* Show "Turn around" message when issue is not in view */
          <div className="absolute top-16 left-1/2 -translate-x-1/2 max-w-xs">
            <div className="bg-black/95 backdrop-blur-md px-3 py-2 rounded-lg border-2 border-yellow-500/50 shadow-xl shadow-yellow-500/20">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <div>
                  <p className="text-xs font-bold text-yellow-400">Turn Around</p>
                  <p className="text-xs text-gray-300">
                    {relativeAngle > 0 ? 'Right' : 'Left'} ({Math.abs(Math.round(relativeAngle))}°)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Issue Info Card - Bottom */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
          <Card className="bg-black/95 backdrop-blur-md border-2 border-blue-500/50 shadow-2xl shadow-blue-500/30">
            <div className="p-4">
              {/* Title and Category */}
              <div className="flex items-start gap-2 mb-2">
                <div className="bg-blue-500/20 p-1.5 rounded-lg shrink-0">
                  <CategoryIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white mb-1 line-clamp-1">{issue.title}</h3>
                  <p className="text-xs text-gray-300 line-clamp-1">{issue.description}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                <Badge className={`${getStatusColor(issue.status)} px-2 py-0.5 text-xs font-semibold border`}>
                  {issue.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 text-xs font-semibold">
                  {issue.category}
                </Badge>
              </div>

              {/* Details */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-start gap-2 text-gray-300">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span className="line-clamp-1">{issue.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Reported {new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Navigation hint */}
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-center text-xs text-blue-400 font-semibold">
                  📍 Follow the arrow to reach the issue
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Close button - Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm border-2 border-red-400 shadow-lg pointer-events-auto transition-all z-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Compass indicator - Bottom Left */}
        <div className="absolute bottom-32 left-4 bg-black/95 backdrop-blur-md px-2.5 py-2 rounded-lg border-2 border-blue-500/50">
          <div className="flex items-center gap-1.5">
            <Navigation2 
              className="w-4 h-4 text-blue-400"
              style={{ transform: `rotate(${-deviceOrientation}deg)` }}
            />
            <div>
              <p className="text-xs text-gray-400">You</p>
              <p className="text-xs font-bold text-white">{Math.round(deviceOrientation)}°</p>
            </div>
          </div>
          {needsCalibration && (
            <div className="mt-1 text-xs text-yellow-400">
              ⚠️ Calibrate
            </div>
          )}
        </div>

        {/* Compass Direction Indicator - Bottom Right */}
        <div className="absolute bottom-32 right-4 bg-black/95 backdrop-blur-md px-2.5 py-2 rounded-lg border-2 border-green-500/50">
          <div className="text-center">
            <p className="text-xs text-gray-400">Target</p>
            <p className="text-xs font-bold text-green-400">{Math.round(bearing)}°</p>
            <p className="text-xs text-gray-500">
              {bearing >= 337.5 || bearing < 22.5 ? 'N' : 
               bearing >= 22.5 && bearing < 67.5 ? 'NE' :
               bearing >= 67.5 && bearing < 112.5 ? 'E' :
               bearing >= 112.5 && bearing < 157.5 ? 'SE' :
               bearing >= 157.5 && bearing < 202.5 ? 'S' :
               bearing >= 202.5 && bearing < 247.5 ? 'SW' :
               bearing >= 247.5 && bearing < 292.5 ? 'W' : 'NW'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
