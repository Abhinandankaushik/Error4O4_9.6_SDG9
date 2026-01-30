'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Camera, X, MapPin } from 'lucide-react';

export default function NewReportPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    address: '',
    area: '',
    landmark: '',
    priority: 'medium',
    location: {
      coordinates: [0, 0], // [longitude, latitude]
    },
  });

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          location: {
            coordinates: [longitude, latitude],
          },
        }));
        
        // Reverse geocode to get address
        reverseGeocode(latitude, longitude);
        setLocationLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Failed to get your location. Please enter address manually.');
        setLocationLoading(false);
      }
    );
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // Using OpenStreetMap Nominatim for reverse geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      
      if (data.display_name) {
        setFormData((prev) => ({
          ...prev,
          address: data.display_name,
          area: data.address?.suburb || data.address?.neighbourhood || '',
        }));
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  };

  const startCamera = async () => {
    if (selectedImages.length >= 10) {
      alert('Maximum 10 photos allowed');
      return;
    }

    try {
      console.log('Requesting camera access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false,
      });
      
      console.log('Camera access granted, stream:', mediaStream);
      setStream(mediaStream);
      setCameraActive(true);
      
      // Wait for next render cycle
      setTimeout(() => {
        if (videoRef.current) {
          console.log('Setting video source...');
          videoRef.current.srcObject = mediaStream;
          
          videoRef.current.onloadedmetadata = async () => {
            console.log('Video metadata loaded');
            try {
              await videoRef.current?.play();
              console.log('Video playing, dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
            } catch (playError) {
              console.error('Error playing video:', playError);
            }
          };
        }
      }, 100);
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      alert(`Unable to access camera: ${error.message || 'Please check permissions.'}`);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas ref not available');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    console.log('Capturing photo, video dimensions:', video.videoWidth, 'x', video.videoHeight);
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      alert('Camera not ready. Please wait a moment and try again.');
      return;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
          const preview = canvas.toDataURL('image/jpeg');
          
          console.log('Photo captured successfully');
          setSelectedImages((prev) => [...prev, file]);
          setImagePreview((prev) => [...prev, preview]);
          
          // Capture satellite image if location is available
          if (formData.location.coordinates[0] !== 0 && formData.location.coordinates[1] !== 0) {
            await captureSatelliteImage();
          }
          
          stopCamera();
        } else {
          console.error('Failed to create blob from canvas');
          alert('Failed to capture photo. Please try again.');
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const captureSatelliteImage = async () => {
    try {
      const [lng, lat] = formData.location.coordinates;
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      
      if (!mapboxToken) {
        console.error('Mapbox token not found');
        return;
      }

      // Calculate bounding box for ~10 minute radius (approximately 10km)
      // At equator, 1 degree ≈ 111km, so 10km ≈ 0.09 degrees
      const radius = 0.09;
      const bbox = [
        lng - radius,
        lat - radius,
        lng + radius,
        lat + radius
      ].join(',');

      // Mapbox Static Images API - Satellite style with high resolution
      // Format: /styles/v1/{username}/{style_id}/static/{lon},{lat},{zoom},{bearing},{pitch}/{width}x{height}{@2x}
      const width = 1280;
      const height = 1280;
      const satelliteUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lng},${lat},14,0,0/${width}x${height}@2x?access_token=${mapboxToken}`;

      console.log('Fetching satellite image from:', satelliteUrl);

      // Fetch the satellite image
      const response = await fetch(satelliteUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch satellite image');
      }

      const imageBlob = await response.blob();
      const satelliteFile = new File(
        [imageBlob], 
        `satellite-${Date.now()}.jpg`, 
        { type: 'image/jpeg' }
      );

      // Create preview URL
      const satellitePreview = URL.createObjectURL(imageBlob);

      console.log('Satellite image captured successfully');
      setSelectedImages((prev) => [...prev, satelliteFile]);
      setImagePreview((prev) => [...prev, satellitePreview]);

    } catch (error) {
      console.error('Error capturing satellite image:', error);
      // Don't alert the user - satellite image is supplementary
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.description || !formData.category || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.location.coordinates[0] === 0 && formData.location.coordinates[1] === 0) {
      alert('Please set your location');
      return;
    }

    setLoading(true);

    try {
      // Upload images first
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        const imageFormData = new FormData();
        selectedImages.forEach((file) => {
          imageFormData.append('files', file);
        });

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        });

        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          imageUrls = uploadData.data;
        } else {
          throw new Error('Image upload failed');
        }
      }

      // Create report
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images: imageUrls,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Report submitted successfully!');
        router.push(`/${params.locale || 'en'}/reports`);
      } else {
        throw new Error(data.error || 'Failed to submit report');
      }
    } catch (error: any) {
      console.error('Error submitting report:', error);
      alert(error.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Report Infrastructure Issue</CardTitle>
            <CardDescription>
              Help improve your community by reporting infrastructure problems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Large pothole on Main Street"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  maxLength={200}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  maxLength={2000}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {formData.description.length}/2000 characters
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="category"
                  placeholder="e.g., Roads, Water Supply, Street Lights, Drainage, etc."
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  maxLength={100}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter the infrastructure category for this issue
                </p>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>
                    Location <span className="text-destructive">*</span>
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGetCurrentLocation}
                    disabled={locationLoading}
                  >
                    {locationLoading ? 'Getting location...' : <><MapPin className="w-4 h-4" /> Use Current Location</>}
                  </Button>
                </div>
                
                {formData.location.coordinates[0] !== 0 && (
                  <div className="p-3 bg-secondary rounded-md text-sm">
                    <p className="text-muted-foreground">
                      Coordinates: {formData.location.coordinates[1].toFixed(6)}, {formData.location.coordinates[0].toFixed(6)}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Address <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Full address of the issue"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area">Area/Ward</Label>
                    <Input
                      id="area"
                      placeholder="e.g., Ward 5"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="landmark">Nearby Landmark</Label>
                    <Input
                      id="landmark"
                      placeholder="e.g., Near City Hall"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Camera Photo Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Photos (Max 10)</Label>
                  <span className="text-sm text-muted-foreground">
                    {selectedImages.length}/10 photos
                  </span>
                </div>

                {/* Camera View */}
                {cameraActive ? (
                  <div className="space-y-4">
                    <div className="relative bg-black rounded-lg overflow-hidden min-h-[320px] flex items-center justify-center">
                      <video
                        ref={videoRef}
                        playsInline
                        muted
                        autoPlay
                        className="w-full h-auto max-h-[500px]"
                        style={{ display: 'block' }}
                      />
                      {!stream && (
                        <div className="absolute inset-0 flex items-center justify-center text-white">
                          Loading camera...
                        </div>
                      )}
                      <div className="absolute inset-0 border-2 border-cyan-500/30 pointer-events-none" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="w-16 h-16 border-2 border-cyan-500 rounded-full" />
                      </div>
                    </div>
                    
                    <div className="flex gap-3 justify-center">
                      <Button
                        type="button"
                        onClick={capturePhoto}
                        className="flex-1 bg-cyan-500 hover:bg-cyan-600"
                      >
                        <Camera className="w-5 h-5 mr-2" />
                        Capture Photo
                      </Button>
                      <Button
                        type="button"
                        onClick={stopCamera}
                        variant="outline"
                      >
                        <X className="w-5 h-5 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={startCamera}
                    variant="outline"
                    disabled={selectedImages.length >= 10}
                    className="w-full h-20 border-2 border-dashed hover:border-cyan-500 hover:bg-cyan-500/5 transition-all"
                  >
                    <Camera className="w-6 h-6 mr-2" />
                    Click Photo
                  </Button>
                )}

                {/* Canvas for capturing (hidden) */}
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Image Previews */}
                {imagePreview.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Captured photos:
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {imagePreview.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-secondary"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Submitting...' : 'Submit Report'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
