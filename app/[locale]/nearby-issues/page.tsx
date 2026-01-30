'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import ARNavigationOverlay from '@/components/ARNavigationOverlay';
import {
  MapPin, Navigation, Loader2, AlertCircle, Target,
  Radio, Eye, ArrowRight, Radar,
  Construction, Lightbulb, Droplet, Droplets, 
  Trash2, Milestone, Trees, Bus, Wrench
} from 'lucide-react';

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

interface IssueWithDistance extends Issue {
  distance: number; // in meters
  bearing: number; // in degrees
}

export default function NearbyIssuesPage() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [issues, setIssues] = useState<IssueWithDistance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<IssueWithDistance | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  // Get user-friendly error message
  const getLocationErrorMessage = (err: GeolocationPositionError): string => {
    switch (err.code) {
      case err.PERMISSION_DENIED:
        return 'Location access denied. Please enable location permissions in your browser settings.';
      case err.POSITION_UNAVAILABLE:
        return 'Location information unavailable. Please check your device\'s GPS settings.';
      case err.TIMEOUT:
        return 'Location request timed out. Please ensure you have a clear view of the sky and try again.';
      default:
        return `Location error: ${err.message || 'Unknown error occurred'}`;
    }
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Calculate bearing (direction) from user to issue
  const calculateBearing = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
      Math.cos(φ1) * Math.sin(φ2) -
      Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);

    return ((θ * 180) / Math.PI + 360) % 360; // Bearing in degrees
  };

  // Fetch nearby issues
  const fetchNearbyIssues = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/reports/nearby?lat=${lat}&lng=${lng}&radius=5&limit=50`
      );
      const data = await response.json();

      if (data.success) {
        const issuesWithDistance: IssueWithDistance[] = data.data.map((issue: Issue) => {
          const [issueLng, issueLat] = issue.location.coordinates;
          const distance = calculateDistance(lat, lng, issueLat, issueLng);
          const bearing = calculateBearing(lat, lng, issueLat, issueLng);

          return {
            ...issue,
            distance,
            bearing,
          };
        });

        // Sort by distance
        issuesWithDistance.sort((a, b) => a.distance - b.distance);
        setIssues(issuesWithDistance);

        // Check if any issue is within 10 meters
        const nearbyIssue = issuesWithDistance.find((issue) => issue.distance <= 10);
        if (nearbyIssue && !selectedIssue) {
          setSelectedIssue(nearbyIssue);
        }
      } else {
        setError(data.error || 'Failed to fetch nearby issues');
      }
    } catch (err: any) {
      console.error('Error fetching nearby issues:', err);
      setError(err.message || 'Failed to fetch nearby issues');
    } finally {
      setLoading(false);
    }
  };

  // Update distances as user moves
  const updateDistances = (lat: number, lng: number) => {
    setIssues((prevIssues) =>
      prevIssues
        .map((issue) => {
          const [issueLng, issueLat] = issue.location.coordinates;
          const distance = calculateDistance(lat, lng, issueLat, issueLng);
          const bearing = calculateBearing(lat, lng, issueLat, issueLng);

          return { ...issue, distance, bearing };
        })
        .sort((a, b) => a.distance - b.distance)
    );

    // Check if any issue is now within 10 meters
    const nearbyIssue = issues.find((issue) => {
      const [issueLng, issueLat] = issue.location.coordinates;
      const distance = calculateDistance(lat, lng, issueLat, issueLng);
      return distance <= 10;
    });

    if (nearbyIssue && !selectedIssue) {
      setSelectedIssue(nearbyIssue);
    }
  };

  // Request location and start tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);
    setIsTracking(true);

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng });
        fetchNearbyIssues(lat, lng);

        // Start continuous tracking
        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            const newLat = pos.coords.latitude;
            const newLng = pos.coords.longitude;
            setUserLocation({ lat: newLat, lng: newLng });
            updateDistances(newLat, newLng);
          },
          (err) => {
            console.error('Location tracking error:', err);
            // Don't stop tracking on temporary errors
            const errorMsg = getLocationErrorMessage(err);
            setError(errorMsg);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000, // Increased to 15 seconds
            maximumAge: 10000, // Allow cached position up to 10 seconds old
          }
        );
      },
      (err) => {
        console.error('Initial location error:', err);
        const errorMsg = getLocationErrorMessage(err);
        setError(errorMsg);
        setLoading(false);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000, // Increased to 30 seconds for initial position
        maximumAge: 10000, // Allow cached position up to 10 seconds old
      }
    );
  };

  // Stop tracking
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Radar className="w-8 h-8 text-blue-500" />
            Find Nearby Issues
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover and navigate to reported issues near your location using AR guidance
          </p>
        </div>

        {/* Location Status Card */}
        <Card className="border-blue-500/30 bg-linear-to-br from-blue-500/10 to-cyan-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/20 p-3 rounded-full">
                  {isTracking ? (
                    <Radio className="w-6 h-6 text-blue-400 animate-pulse" />
                  ) : (
                    <Target className="w-6 h-6 text-blue-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {isTracking ? 'Tracking Your Location' : 'Location Tracking'}
                  </h3>
                  {userLocation ? (
                    <p className="text-sm text-muted-foreground">
                      Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Click "Start Tracking" to find nearby issues
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {!isTracking ? (
                  <Button
                    onClick={startTracking}
                    className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <Navigation className="w-5 h-5 mr-2" />
                        Start Tracking
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={stopTracking}
                    variant="outline"
                    className="border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-400"
                  >
                    Stop Tracking
                  </Button>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Issues List */}
        {issues.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Nearby Issues ({issues.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {issues.map((issue) => {
                  const CategoryIcon = getCategoryIcon(issue.category);
                  const isVeryClose = issue.distance <= 10;

                  return (
                    <div
                      key={issue._id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isVeryClose
                          ? 'bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/20 animate-pulse'
                          : 'bg-secondary border-gray-700 hover:border-blue-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CategoryIcon className="w-5 h-5" />
                            <h3 className="font-semibold text-lg">{issue.title}</h3>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {issue.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge className={`${getStatusColor(issue.status)} px-2 py-1 text-xs border`}>
                              {issue.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-1 text-xs">
                              {issue.category}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {issue.address}
                            </span>
                          </div>
                        </div>

                        <div className="text-right space-y-2">
                          <div className={`text-2xl font-bold ${isVeryClose ? 'text-blue-400' : ''}`}>
                            {issue.distance < 1000
                              ? `${issue.distance.toFixed(0)}m`
                              : `${(issue.distance / 1000).toFixed(2)}km`}
                          </div>

                          {isVeryClose && userLocation && (
                            <Button
                              onClick={() => setSelectedIssue(issue)}
                              className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                              size="sm"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              AR View
                            </Button>
                          )}

                          <Button
                            onClick={() => router.push(`/en/reports/${issue._id}`)}
                            variant="outline"
                            size="sm"
                          >
                            Details
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>

                      {isVeryClose && (
                        <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <p className="text-sm text-blue-400 font-semibold text-center">
                            🎯 You're within 10 meters! Use AR View for real-time guidance
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No issues found */}
        {!loading && issues.length === 0 && userLocation && (
          <Card>
            <CardContent className="py-12 text-center">
              <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Issues Found Nearby</h3>
              <p className="text-muted-foreground">
                There are no reported issues within 5km of your current location
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* AR Navigation Overlay */}
      {selectedIssue && userLocation && (
        <ARNavigationOverlay
          issue={selectedIssue}
          userLocation={userLocation}
          distance={selectedIssue.distance}
          bearing={selectedIssue.bearing}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
}
