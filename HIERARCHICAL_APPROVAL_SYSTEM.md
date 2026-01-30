# Hierarchical Approval System - Complete Implementation

## 🎯 Overview / अवलोकन

This document describes the **5-level hierarchical approval system** implemented for InfraReport, designed specifically for government municipal infrastructure management.

यह डॉक्यूमेंट InfraReport के लिए बनाए गए **5-स्तरीय अनुमोदन प्रणाली** का विवरण देता है, जो विशेष रूप से सरकारी नगरपालिका infrastructure प्रबंधन के लिए डिज़ाइन किया गया है।

---

## 👥 User Roles / उपयोगकर्ता भूमिकाएं

### 1. **Citizen / नागरिक** (`role: 'citizen'`)
- **Access / पहुंच:**
  - Report issues / समस्याएं रिपोर्ट करें
  - View map / मानचित्र देखें
  - Track their reports / अपनी रिपोर्ट ट्रैक करें
  
- **Restrictions / प्रतिबंध:**
  - No dashboard access
  - Cannot approve/forward reports

---

### 2. **City Manager / शहर प्रबंधक** (`role: 'city_manager'`)
- **Responsibility / जिम्मेदारी:**
  - First level of approval
  - Review all incoming citizen reports
  - Forward approved reports to Infrastructure Manager
  
- **Dashboard:** `/dashboard/city-manager`
- **Icon:** Building2 (🏢)
- **Actions / कार्य:**
  - ✅ Approve & Forward to Infra Manager
  - ❌ Reject with reason
  - 📝 Add notes/comments

---

### 3. **Infrastructure Manager / इन्फ्रास्ट्रक्चर प्रबंधक** (`role: 'infra_manager'`)
- **Responsibility / जिम्मेदारी:**
  - Second level of approval
  - Technical review of infrastructure issues
  - Forward approved reports to Issue Resolver
  
- **Dashboard:** `/dashboard/infra-manager`
- **Icon:** Wrench (🔧)
- **Actions / कार्य:**
  - ✅ Approve & Forward to Issue Resolver
  - 📝 Add technical notes

---

### 4. **Issue Resolver / समस्या समाधानकर्ता** (`role: 'issue_resolver'`)
- **Responsibility / जिम्मेदारी:**
  - Third level - on-ground assessment
  - Validate issue severity and requirements
  - Assign to appropriate contractor
  
- **Dashboard:** `/dashboard/issue-resolver`
- **Icon:** Target (🎯)
- **Actions / कार्य:**
  - ✅ Approve & Assign to Contractor
  - 📝 Add assessment notes

---

### 5. **Contractor / ठेकेदार** (`role: 'contractor'`)
- **Responsibility / जिम्मेदारी:**
  - Final level - actual work execution
  - Start work and mark progress
  - Upload completion photos
  
- **Dashboard:** `/dashboard/contractor`
- **Icon:** Hammer (🔨)
- **Actions / कार्य:**
  - 🔨 Start Work
  - ✅ Complete Work (with photos)
  - 📸 Upload before/after images

---

## 🔄 Approval Workflow / अनुमोदन कार्यप्रवाह

```
User Reports Issue
      ⬇️
[pending_city_manager]
City Manager Reviews → Approves/Rejects
      ⬇️
[pending_infra_manager]
Infra Manager Reviews → Approves
      ⬇️
[pending_issue_resolver]
Issue Resolver Reviews → Assigns
      ⬇️
[pending_contractor]
Contractor Accepts → Starts Work
      ⬇️
[work_in_progress]
Contractor Working → Uploads Photos
      ⬇️
[completed] ✅
```

---

## 📊 Approval Stages / अनुमोदन चरण

| Stage | Description | Assigned To | Next Stage |
|-------|-------------|-------------|------------|
| `pending_city_manager` | Initial review | City Manager | `pending_infra_manager` or `rejected` |
| `pending_infra_manager` | Technical review | Infra Manager | `pending_issue_resolver` |
| `pending_issue_resolver` | Ground assessment | Issue Resolver | `pending_contractor` |
| `pending_contractor` | Ready for work | Contractor | `work_in_progress` |
| `work_in_progress` | Active work | Contractor | `completed` |
| `completed` | Work finished | - | Final stage |

---

## 🌍 City-Based Filtering / शहर-आधारित फ़िल्टरिंग

### For Citizens / नागरिकों के लिए:
- Can report from any city
- Can view reports from all cities

### For Employees / कर्मचारियों के लिए:
- Each employee has a `city` field in their profile
- Can ONLY see reports from their assigned city
- Automatic filtering in dashboards and APIs

**Example:**
```typescript
// User metadata
{
  role: "city_manager",
  city: "Mumbai"
}

// This manager will only see reports where report.city === "Mumbai"
```

---

## 🔐 Authentication & Route Protection / प्रमाणीकरण और मार्ग सुरक्षा

### Public Routes (No signin required):
- `/` - Home page
- `/en`, `/hi`, `/mr` - Localized home pages
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page

### Protected Routes (Signin required):
- `/reports/new` - Report issue (citizens only)
- `/reports/[id]` - View report details
- `/map` - Heat map view
- `/dashboard/*` - All dashboards (role-based)

### Implementation:
- **Middleware:** `middleware.ts` using Clerk
- Automatic redirect to signin for unauthenticated users
- Role-based access control in each dashboard

---

## 💾 Database Schema Changes / डेटाबेस स्कीमा परिवर्तन

### User Model Updates:
```typescript
interface IUser {
  role: 'citizen' | 'city_manager' | 'infra_manager' | 'issue_resolver' | 'contractor';
  city?: string; // For employees only
  // ... other fields
}
```

### Report Model Updates:
```typescript
interface IReport {
  // New approval workflow fields
  currentStage: ApprovalStage;
  approvalHistory: IApprovalHistory[];
  
  // Assignment tracking
  assignedCityManager?: string;
  assignedInfraManager?: string;
  assignedIssueResolver?: string;
  assignedContractor?: string;
  
  // City-based filtering
  city: string;
  
  // Completion evidence
  workCompletionImages?: string[];
  
  // ... existing fields
}

interface IApprovalHistory {
  stage: ApprovalStage;
  approvedBy: string;
  approverName: string;
  approverRole: string;
  action: 'approve' | 'reject' | 'forward' | 'start_work' | 'complete';
  note: string;
  timestamp: Date;
}
```

---

## 🛠️ API Endpoints / API एंडपॉइंट

### 1. **GET /api/reports**
**Query Parameters:**
- `stage` - Filter by approval stage (e.g., `pending_city_manager`)
- `city` - Filter by city (automatic for employees)
- `status` - Filter by status
- `category` - Filter by category

**Example:**
```
GET /api/reports?stage=pending_city_manager
GET /api/reports?stage=pending_contractor,work_in_progress
```

---

### 2. **POST /api/reports**
**Create new report with automatic workflow initialization**
```json
{
  "title": "Broken Road",
  "description": "Road damaged near XYZ",
  "category": "Roads and Pavements",
  "location": { "coordinates": [72.8777, 19.0760] },
  "address": "123 Main St",
  "city": "Mumbai",
  "priority": "high"
}
```

**Response includes:**
- `currentStage: 'pending_city_manager'`
- `approvalHistory: []` (empty initially)

---

### 3. **POST /api/reports/[id]/approve**
**Approve/forward report to next stage**
```json
{
  "action": "approve",
  "note": "Reviewed and approved. Forwarding to infra team.",
  "nextStage": "pending_infra_manager"
}
```

**For contractors completing work:**
```json
{
  "action": "complete",
  "note": "Work completed successfully",
  "nextStage": "completed",
  "completionImages": ["url1", "url2"]
}
```

---

## 🎨 UI Components / UI घटक

### Dashboard Features / डैशबोर्ड सुविधाएं:
- ✅ Pending reports grid
- 📋 Report detail modal
- 📝 Note/comment textarea (required)
- ✅ Approve/Forward button
- ❌ Reject button (city manager only)
- 📸 Image upload (contractor only)
- ⏳ Loading states
- 🎯 Empty states

### Navbar Updates / नेवबार अपडेट:
- Role-based menu items
- Different dashboard icons per role
- Hide "Report" button for employees
- Show appropriate dashboard link

---

## 🌐 Transparency Features / पारदर्शिता सुविधाएं

### 1. **Complete History Tracking**
Every action is recorded in `approvalHistory`:
```typescript
{
  stage: "pending_city_manager",
  approvedBy: "user_abc123",
  approverName: "Rajesh Kumar",
  approverRole: "city_manager",
  action: "approve",
  note: "Approved after verification",
  timestamp: "2024-01-15T10:30:00Z"
}
```

### 2. **Public Visibility**
- Citizens can view approval history on report detail page
- See who approved and when
- Read notes from each approver
- Track current stage

### 3. **Accountability**
- Each approval tied to specific user
- Name and role recorded
- Mandatory notes ensure documented decisions
- Timestamp for audit trail

---

## 🚀 Setup Instructions / सेटअप निर्देश

### 1. **Set User Roles in Clerk**
Go to Clerk Dashboard → Users → Select User → Public Metadata:
```json
{
  "role": "city_manager",
  "city": "Mumbai"
}
```

### 2. **Available Roles:**
- `citizen` (default)
- `city_manager`
- `infra_manager`
- `issue_resolver`
- `contractor`

### 3. **Set City for Employees:**
Make sure to add `city` field for all non-citizen roles.

---

## 📱 Testing Workflow / वर्कफ़्लो परीक्षण

### Test Scenario / परीक्षण परिदृश्य:

1. **As Citizen:**
   - Sign in
   - Create a report (auto-assigned to `pending_city_manager`)
   - View report on map

2. **As City Manager:**
   - See report in dashboard
   - Review details
   - Approve with note → moves to `pending_infra_manager`

3. **As Infra Manager:**
   - See report in dashboard
   - Technical review
   - Approve → moves to `pending_issue_resolver`

4. **As Issue Resolver:**
   - See report in dashboard
   - Ground assessment
   - Approve → moves to `pending_contractor`

5. **As Contractor:**
   - See report in dashboard
   - Start work → status becomes `work_in_progress`
   - Upload completion photos
   - Complete work → status becomes `completed`

6. **As Citizen (check back):**
   - View report details
   - See complete approval history
   - View completion photos

---

## 🔧 Configuration / कॉन्फ़िगरेशन

### Environment Variables Required:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# MongoDB
MONGODB_URI=mongodb+srv://...

# Mapbox (for location/maps)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.ey...
```

---

## 📈 Future Enhancements / भविष्य के सुधार

### Planned Features:
- [ ] Email notifications at each stage
- [ ] SMS alerts to citizens on status change
- [ ] Deadline tracking (SLA management)
- [ ] Automated contractor assignment based on workload
- [ ] Mobile app for contractors
- [ ] Real-time chat between stakeholders
- [ ] Analytics dashboard for administrators
- [ ] Performance metrics per city/role

---

## 🤝 Support / सहायता

For questions or issues:
- Check existing reports in your dashboard
- Contact your supervisor for role/city assignment
- Technical issues: Contact IT support

सवालों या समस्याओं के लिए:
- अपने डैशबोर्ड में मौजूदा रिपोर्ट देखें
- भूमिका/शहर असाइनमेंट के लिए अपने पर्यवेक्षक से संपर्क करें
- तकनीकी समस्याएं: IT support से संपर्क करें

---

**System Status:** ✅ Fully Implemented and Ready for Use
**Last Updated:** January 2025
