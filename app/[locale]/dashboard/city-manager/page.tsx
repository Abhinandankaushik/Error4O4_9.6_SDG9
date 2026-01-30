"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { 
  FileText, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight,
  Building2,
  User,
  Clock
} from "lucide-react";

interface Report {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  address: string;
  city: string;
  currentStage: string;
  createdAt: string;
  userId: string;
  userName: string;
  userEmail: string;
}

export default function CityManagerDashboard() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [note, setNote] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    } else if (isLoaded && user) {
      // Check if user has city_manager role
      const role = user.publicMetadata?.role;
      if (role !== "city_manager") {
        router.push("/");
      } else {
        fetchReports();
      }
    }
  }, [isLoaded, user, router]);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports?stage=pending_city_manager");
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reportId: string) => {
    if (!note.trim()) {
      alert("कृपया टिप्पणी जोड़ें / Please add a note");
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`/api/reports/${reportId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          note: note.trim(),
          nextStage: "pending_infra_manager",
        }),
      });

      if (response.ok) {
        alert("रिपोर्ट स्वीकृत और आगे भेजी गई / Report approved and forwarded");
        setSelectedReport(null);
        setNote("");
        fetchReports();
      } else {
        alert("त्रुटि / Error approving report");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("त्रुटि / Error occurred");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (reportId: string) => {
    if (!note.trim()) {
      alert("कृपया अस्वीकृति का कारण बताएं / Please provide rejection reason");
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`/api/reports/${reportId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject",
          note: note.trim(),
          nextStage: "rejected",
        }),
      });

      if (response.ok) {
        alert("रिपोर्ट अस्वीकृत / Report rejected");
        setSelectedReport(null);
        setNote("");
        fetchReports();
      } else {
        alert("त्रुटि / Error rejecting report");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("त्रुटि / Error occurred");
    } finally {
      setProcessing(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p>लोड हो रहा है... / Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Building2 className="w-8 h-8" />
          City Manager Dashboard
        </h1>
        <p className="text-gray-600">स्वीकृत करें और इन्फ्रा मैनेजर को भेजें / Review and forward to Infrastructure Manager</p>
      </div>

      {reports.length === 0 ? (
        <Card className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">कोई लंबित रिपोर्ट नहीं / No Pending Reports</h2>
          <p className="text-gray-600">सभी रिपोर्ट प्रोसेस हो चुकी हैं / All reports have been processed</p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <Card key={report._id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold flex-1">{report.title}</h3>
                <Badge variant="warning">
                  <Clock className="w-3 h-3 mr-1" />
                  Pending
                </Badge>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{report.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="truncate">{report.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span>{report.city}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{report.userName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{new Date(report.createdAt).toLocaleDateString("hi-IN")}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedReport(report)}
                  className="flex-1"
                  variant="primary"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Review
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Approval Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedReport.title}</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold mb-1">विवरण / Description:</h3>
                <p className="text-gray-600">{selectedReport.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">श्रेणी / Category:</h3>
                <Badge>{selectedReport.category}</Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-1">प्राथमिकता / Priority:</h3>
                <Badge variant={
                  selectedReport.priority === "high" ? "destructive" :
                  selectedReport.priority === "medium" ? "warning" : "default"
                }>
                  {selectedReport.priority}
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-1">स्थान / Location:</h3>
                <p className="text-gray-600">{selectedReport.address}</p>
                <p className="text-sm text-gray-500">{selectedReport.city}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">रिपोर्टर / Reporter:</h3>
                <p className="text-gray-600">{selectedReport.userName}</p>
                <p className="text-sm text-gray-500">{selectedReport.userEmail}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-2">
                टिप्पणी / Note: <span className="text-red-500">*</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-3 border rounded-lg"
                rows={4}
                placeholder="अपनी टिप्पणी यहाँ लिखें / Enter your note here..."
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => handleApprove(selectedReport._id)}
                disabled={processing || !note.trim()}
                className="flex-1"
                variant="primary"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {processing ? "प्रोसेसिंग..." : "स्वीकृत करें और भेजें"}
              </Button>
              <Button
                onClick={() => handleReject(selectedReport._id)}
                disabled={processing || !note.trim()}
                variant="destructive"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                अस्वीकृत करें
              </Button>
              <Button
                onClick={() => {
                  setSelectedReport(null);
                  setNote("");
                }}
                variant="outline"
                disabled={processing}
              >
                बंद करें
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
