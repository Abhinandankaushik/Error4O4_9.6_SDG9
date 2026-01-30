import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userRole = user.publicMetadata?.role as string;
    if (!userRole || userRole === "citizen") {
      return NextResponse.json(
        { error: "You don't have permission to perform this action" },
        { status: 403 }
      );
    }

    await connectDB();

    const { id: reportId } = await params;
    const body = await req.json();
    const { action, note, nextStage, completionImages } = body;

    const report = await Report.findById(reportId);
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Add approval history entry
    const approvalEntry = {
      stage: report.currentStage,
      approvedBy: userId,
      approverName: user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.emailAddresses[0]?.emailAddress || "Unknown",
      approverRole: userRole,
      action: action,
      note: note,
      timestamp: new Date(),
    };

    report.approvalHistory.push(approvalEntry);

    // Update current stage
    report.currentStage = nextStage;

    // Assign to appropriate role
    if (nextStage === "pending_infra_manager") {
      report.assignedCityManager = userId;
    } else if (nextStage === "pending_issue_resolver") {
      report.assignedInfraManager = userId;
    } else if (nextStage === "pending_contractor") {
      report.assignedIssueResolver = userId;
    } else if (nextStage === "work_in_progress") {
      report.assignedContractor = userId;
      report.status = "in-progress";
    } else if (nextStage === "completed") {
      if (completionImages && completionImages.length > 0) {
        report.workCompletionImages = completionImages;
      }
      report.status = "resolved";
      report.resolvedAt = new Date();
    }

    await report.save();

    return NextResponse.json({
      message: "Report updated successfully",
      report,
    });
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}
