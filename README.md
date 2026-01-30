# 🏗️ InfraReport - Infrastructure Repair Crowdsourcing Platform

A comprehensive platform for crowdsourcing infrastructure repair reports with AR mapping, AI object detection, heat maps, and municipal SaaS features. Built for SDG3 Hackathon.

## ✨ Features

### 👥 Dual User Roles
- **Citizens**: Report infrastructure issues with photos, location, and real-time tracking
- **City Issue Managers**: Manage, assign, and track resolution of all reported issues

### 🤖 AI-Powered AR Visualization (NEW!)
- **Real-Time Object Detection**: TensorFlow.js with COCO-SSD model
- **Camera-Based AR**: Point camera to see all historical issues at a location
- **Smart Detection**: Identifies vehicles, traffic infrastructure, public amenities
- **Beautiful UI**: Glass morphism design with confidence scores and bounding boxes
- **Timeline View**: See complete history of reports with status badges
- **Before/After Photos**: Compare issue images with resolution photos

### 🗺️ Advanced Mapping
- **Heat Maps**: Visualize issue density by location with resolution rate percentages
- **Interactive Maps**: Click markers to view issue details
- **Geospatial Queries**: Find issues near any location

### 📊 Analytics Dashboard
- Resolution rate by area (%)
- Average resolution time
- Status distribution
- Daily/weekly trends
- Category-wise statistics

### 🎨 Modern Dark Theme UI
- Black (#000000) and charcoal palette
- Cyan/blue accents for AI features
- Smooth transitions and animations
- Custom scrollbars
- Fully responsive design
- Beautiful Clerk authentication integration

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- TensorFlow.js for AI object detection
- COCO-SSD model for real-time object recognition
- Mapbox for heat maps
- Clerk for authentication
- MongoDB/Mongoose for database

### 2. Set Up Environment Variables

Copy `.env.local` and add your API keys:

```env
# MongoDB
MONGODB_URI=your_mongodb_uri

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Mapbox (Maps)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token
```

### 3. Seed Initial Data

```bash
npm install -D tsx
npx tsx scripts/seed.ts
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
app/
├── [locale]/              # Internationalized routes
│   ├── reports/new/       # Report submission
│   ├── dashboard/manager/ # Manager dashboard
│   ├── map/              # Heat map view
│   └── ar-view/          # AR camera view
├── api/
│   ├── reports/          # Report CRUD
│   ├── analytics/        # Statistics
│   ├── categories/       # Categories
│   └── upload/           # Image uploads

components/
├── ui/                   # Reusable components
├── HeatMapView.tsx       # Mapbox heat map
├── ARCameraView.tsx      # AR implementation
├── ResolutionChart.tsx   # Analytics charts
└── AreaStatistics.tsx    # Area stats

models/
├── User.ts              # Dual-role users
├── Report.ts            # Issue reports
├── Category.ts          # Issue types
├── Municipality.ts      # Cities/areas
└── ReportHistory.ts     # Audit trail
```

## 🔧 Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **Styling**: Tailwind CSS 4
- **Maps**: Mapbox GL JS
- **Charts**: Recharts
- **Storage**: Cloudinary
- **Internationalization**: next-intl

## 📊 Database Models

### User
- Dual roles: `citizen` | `city_manager`
- Managed areas for city managers
- Integration with Clerk

### Report
- Geolocation (2dsphere indexed)
- Status workflow tracking
- Priority levels
- Image attachments
- Upvote system

### Category
- Icon and color coding
- Active/inactive status

### ReportHistory
- Complete audit trail
- Action tracking
- User attribution

## 🎯 Key Features Implementation

### Heat Mapping
```typescript
// Aggregates reports by grid cells
// Shows resolution rate by color intensity
// Tooltips display area statistics
```

### AR Mapping
```typescript
// Uses device camera + geolocation
// Queries nearby reports within radius
// Displays historical timeline
// Shows before/after photos
```

### Analytics
```typescript
// Resolution rate = (resolved / total) × 100
// Calculates average resolution time
// Trends by date, area, category
```

## 🔐 API Routes

### Reports
- `GET /api/reports` - List with filters
- `POST /api/reports` - Create report
- `GET /api/reports/[id]` - Single report
- `PATCH /api/reports/[id]` - Update status
- `GET /api/reports/nearby` - Geolocation query

### Analytics
- `GET /api/analytics/heatmap` - Heat map data
- `GET /api/analytics/resolution-rate` - Statistics

### Other
- `POST /api/upload` - Image upload
- `GET /api/categories` - List categories

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Environment Setup

Ensure MongoDB allows Vercel IPs or use `0.0.0.0/0` for development.

## 📝 Getting API Keys

- **MongoDB**: https://www.mongodb.com/cloud/atlas (Free)
- **Clerk**: https://clerk.com (Free)
- **Cloudinary**: https://cloudinary.com (Free - 25GB)
- **Mapbox**: https://account.mapbox.com (Free - 50k loads)

## 🎨 UI Components

Built with custom shadcn-style components:
- Button (variants: default, destructive, outline, ghost)
- Card (with header, content, footer)
- Badge (status indicators)
- Input, Textarea, Select
- Label

## 📖 Detailed Setup Guide

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for comprehensive documentation.

## 🐛 Troubleshooting

**Maps not showing?**
- Verify `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
- Uncomment Mapbox code in HeatMapView.tsx

**Images not uploading?**
- Check Cloudinary credentials
- Verify API key permissions

**Database errors?**
- Confirm MongoDB URI format
- Check network access in Atlas

**AR not working?**
- Requires HTTPS (camera permission)
- Enable location services

## 📄 License

MIT License - Built for SDG3 Hackathon

## 🤝 Contributing

Issues and pull requests welcome!

---

**Built with ❤️ for improving urban infrastructure through citizen participation**