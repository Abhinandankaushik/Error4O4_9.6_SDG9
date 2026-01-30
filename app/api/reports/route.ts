import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Report from '@/models/Report';
import ReportHistory from '@/models/ReportHistory';
import { auth, currentUser } from '@clerk/nextjs/server';

// GET /api/reports - Get all reports with filters
export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { userId } = await auth();
    const user = userId ? await currentUser() : null;
    const userRole = user?.publicMetadata?.role as string;
    const userCity = user?.publicMetadata?.city as string;
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const assignedTo = searchParams.get('assignedTo');
    const reportedBy = searchParams.get('reportedBy');
    const area = searchParams.get('area');
    const stage = searchParams.get('stage');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = {};
    if (status) query.status = status;
    if (category) query.category = { $regex: category, $options: 'i' };
    if (assignedTo) query.assignedTo = assignedTo;
    if (reportedBy) query.reportedBy = reportedBy;
    if (area) query.area = { $regex: area, $options: 'i' };
    
    // Filter by approval stage for role-based dashboards
    if (stage) {
      const stages = stage.split(',');
      if (stages.length > 1) {
        query.currentStage = { $in: stages };
      } else {
        query.currentStage = stage;
      }
    }
    
    // City-based filtering for employees (not citizens)
    if (userRole && userRole !== 'citizen' && userCity) {
      query.city = userCity;
    }
    
    const reports = await Report.find(query)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Report.countDocuments(query);
    
    return NextResponse.json(
      reports.map(report => ({
        _id: report._id,
        title: report.title,
        description: report.description,
        category: report.category,
        priority: report.priority,
        status: report.status,
        currentStage: report.currentStage,
        location: report.location,
        address: report.address,
        city: report.city,
        area: report.area,
        landmark: report.landmark,
        images: report.images,
        createdAt: report.createdAt,
        userId: report.reportedBy,
        userName: report.reportedBy?.name || 'Unknown',
        userEmail: report.reportedBy?.email || '',
        assignedCityManager: report.assignedCityManager,
        assignedInfraManager: report.assignedInfraManager,
        assignedIssueResolver: report.assignedIssueResolver,
        assignedContractor: report.assignedContractor,
        approvalHistory: report.approvalHistory,
        workCompletionImages: report.workCompletionImages,
      }))
    );
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

// POST /api/reports - Create new report
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const user = await currentUser();
    
    await connectDB();
    
    const body = await request.json();
    const {
      title,
      description,
      category,
      location,
      address,
      city,
      area,
      landmark,
      images,
      priority,
    } = body;
    console.log(body)
    // Validate required fields
    if (!title || !description || !category || !location || !address) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate location format
    if (!location.coordinates || location.coordinates.length !== 2) {
      return NextResponse.json(
        { success: false, error: 'Invalid location format' },
        { status: 400 }
      );
    }
    
    // Create report with approval workflow
    const report = await Report.create({
      title,
      description,
      category,
      location: {
        type: 'Point',
        coordinates: location.coordinates,
      },
      address,
      city: city || area, // Use city if provided, otherwise use area
      area,
      landmark,
      images: images || [],
      priority: priority || 'medium',
      reportedBy: userId,
      userId: userId,
      userName: user?.firstName && user?.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user?.emailAddresses[0]?.emailAddress || "Unknown",
      userEmail: user?.emailAddresses[0]?.emailAddress || '',
      status: 'submitted',
      currentStage: 'pending_city_manager', // Initial stage
      approvalHistory: [],
    });
    
    // Create history entry
    await ReportHistory.create({
      reportId: report._id,
      actionType: 'created',
      performedBy: userId,
      newValue: 'submitted',
      timestamp: new Date(),
    });
    
    const populatedReport = await Report.findById(report._id)
      .populate('reportedBy', 'name email');
    
    return NextResponse.json(
      {
        success: true,
        data: populatedReport,
        message: 'Report created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create report' },
      { status: 500 }
    );
  }
}
