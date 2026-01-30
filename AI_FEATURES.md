# AI-Powered AR Features Documentation

## Overview
The infrastructure reporting platform now includes advanced AI-powered object detection in the AR camera view, providing real-time analysis of the environment to help identify infrastructure issues.

## Features

### 🤖 Real-Time Object Detection
- **Technology**: TensorFlow.js with COCO-SSD model
- **Model**: MobileNet V2 (optimized for mobile/web performance)
- **Detection Speed**: 2 FPS (500ms intervals)
- **Confidence Threshold**: 70%+

### 🎯 Detected Object Categories
The AI system detects infrastructure-related objects including:
- **Vehicles**: Cars, trucks, buses, motorcycles, bicycles
- **Traffic Infrastructure**: Traffic lights, stop signs, parking meters
- **Public Amenities**: Fire hydrants, benches
- **People & Context**: Pedestrians, umbrellas
- **High-Confidence Objects**: Any object with >70% confidence score

### 🎨 Beautiful UI Features

#### AI Status Banner (Top Center)
- Real-time status indicator with pulsing animation
- Live count of detected objects
- Cyan gradient design with backdrop blur

#### Object Detection List (Top Right)
- Displays up to 5 detected objects
- Confidence score with animated progress bars
- Glass morphism design with cyan accents
- Auto-scrollable for more detections

#### Canvas Overlay
- Cyan bounding boxes around detected objects
- Class labels with confidence percentages
- Non-intrusive, semi-transparent display

#### Enhanced Crosshair
- Cyan color with glow effects
- Center dot for precise targeting
- Shadow effects for better visibility

## Installation

### Required Dependencies
```bash
npm install @tensorflow/tfjs @tensorflow-models/coco-ssd
```

### Package Versions
- `@tensorflow/tfjs`: ^4.17.0
- `@tensorflow-models/coco-ssd`: ^2.2.3

## Usage

### Enabling AI Detection
1. Open AR Camera View from the navigation menu
2. Grant camera and location permissions
3. Click "🤖 Enable AI" button at the bottom
4. Wait for model to load (first time only, ~2-3 seconds)
5. AI will start detecting objects in real-time

### Understanding the UI
- **Top Banner**: Shows AI status and object count
- **Right Panel**: Lists detected objects with confidence scores
- **Canvas Overlay**: Shows bounding boxes on camera feed
- **Bottom Controls**: Toggle AI, refresh location, close AR

### Performance Tips
- AI detection runs every 500ms to balance accuracy and performance
- First load downloads ~5MB model (cached afterwards)
- Better lighting improves detection accuracy
- Keep camera steady for better results

## Technical Implementation

### Architecture
```
ARCameraView Component
├── Video Stream (getUserMedia)
├── Canvas Overlay (TensorFlow.js)
├── Object Detection Loop (setInterval)
├── Model Management (lazy loading)
└── UI State Management (React hooks)
```

### Key Functions

#### `loadAIModel()`
- Dynamically imports TensorFlow.js libraries
- Loads COCO-SSD model with MobileNet V2
- Handles errors gracefully if dependencies not installed

#### `detectObjects()`
- Runs inference on video frame
- Filters for infrastructure-related objects
- Updates state with detected objects

#### `drawDetections(predictions)`
- Renders bounding boxes on canvas
- Draws labels with confidence scores
- Uses cyan color scheme (#06b6d4)

#### `toggleAI()`
- Enables/disables AI detection
- Manages detection interval
- Clears canvas when disabled

### State Management
```typescript
const [aiEnabled, setAiEnabled] = useState(false);
const [modelLoading, setModelLoading] = useState(false);
const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
const modelRef = useRef<any>(null);
const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
```

## Error Handling

### Camera Errors
- `NotAllowedError`: Permission denied message
- `NotFoundError`: No camera detected message
- `NotReadableError`: Camera in use message

### Location Errors
- `PERMISSION_DENIED`: Location permission message
- `POSITION_UNAVAILABLE`: Location unavailable message
- `TIMEOUT`: Request timeout message

### Model Loading Errors
- Shows alert if dependencies not installed
- Continues AR view without AI if model fails
- Graceful degradation to basic AR features

## Performance Optimization

### Model Selection
- MobileNet V2: 3.4MB, faster inference
- Alternative: MobileNet V1 (smaller, less accurate)

### Detection Frequency
- 500ms interval = 2 FPS
- Can be adjusted: 1000ms for slower devices, 250ms for faster

### Canvas Optimization
- Clears canvas before each draw
- Only draws when AI is enabled
- Uses requestAnimationFrame for smooth rendering

## Future Enhancements

### Potential Improvements
1. **Custom Model Training**
   - Train on infrastructure-specific dataset
   - Detect potholes, cracks, broken lights directly
   - Higher accuracy for Indian infrastructure

2. **Advanced Analytics**
   - Track object frequency over time
   - Generate automatic issue reports
   - Severity assessment based on detection

3. **Offline Support**
   - Cache model for offline use
   - Local inference without internet

4. **Multi-Frame Analysis**
   - Temporal consistency checking
   - Reduce false positives
   - Better tracking of moving objects

## Troubleshooting

### "AI model not available" Error
**Solution**: Install dependencies
```bash
npm install @tensorflow/tfjs @tensorflow-models/coco-ssd
```

### Slow Detection Speed
**Possible Causes**:
- Low-end device
- Poor network (first load)
- Too many objects in frame

**Solutions**:
- Increase interval to 1000ms
- Use smaller model
- Clear browser cache

### No Objects Detected
**Possible Causes**:
- Poor lighting
- Camera out of focus
- No relevant objects in frame

**Solutions**:
- Improve lighting conditions
- Focus camera properly
- Point at relevant objects

### Camera Not Starting
**Solutions**:
1. Check browser permissions
2. Ensure HTTPS connection
3. Try different browser
4. Check if camera is used by another app

## Browser Compatibility

### Supported Browsers
- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Safari 14+ (iOS/macOS)
- ✅ Firefox 88+

### Required Features
- WebRTC (getUserMedia)
- WebGL 2.0
- ES6+ JavaScript
- Canvas API

## Credits

### Technologies Used
- **TensorFlow.js**: Google's ML library for JavaScript
- **COCO-SSD**: Pre-trained object detection model
- **MobileNet**: Efficient neural network architecture
- **React**: UI framework
- **Tailwind CSS**: Styling

### References
- [TensorFlow.js Docs](https://www.tensorflow.org/js)
- [COCO-SSD Model](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd)
- [MobileNet Paper](https://arxiv.org/abs/1704.04861)

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Maintainer**: Error4O4
