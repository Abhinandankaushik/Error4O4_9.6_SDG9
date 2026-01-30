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
  CheckCircle, 
  Building2,
  User,
  Clock,
  Hammer,
  Upload,
  Camera
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

export default function ContractorDashboard() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [note, setNote] = useState("");
  const [processing, setProcessing] = useState(false);
  const [completionImages, setCompletionImages] = useState<File[]>([]);
  const [action, setAction] = useState<"start" | "complete" | null>(null);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    } else if (isLoaded && user) {
      const role = user.publicMetadata?.role;
      if (role !== "contractor") {
        router.push("/");
      } else {
        fetchReports();
      }
    }
  }, [isLoaded, user, router]);

  const fetchReports = async () => {
    try {
      // Fetch both pending and in-progress reports
      const response = await fetch("/api/reports?stage=pending_contractor,work_in_progress");
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

  const handleStartWork = async (reportId: string) => {
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
          action: "start_work",
          note: note.trim(),
          nextStage: "work_in_progress",
        }),
      });

      if (response.ok) {
        alert("कार्य शुरू किया गया / Work started");
        setSelectedReport(null);
        setNote("");
        setAction(null);
        fetchReports();
      } else {
        alert("त्रुटि / Error starting work");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("त्रुटि / Error occurred");
    } finally {
      setProcessing(false);
    }
  };

  const handleCompleteWork = async (reportId: string) => {
    if (!note.trim()) {
      alert("कृपया टिप्पणी जोड़ें / Please add a note");
      return;
    }

    if (completionImages.length === 0) {
      alert("कृपया कम से कम एक पूर्ण कार्य की फोटो अपलोड करें / Please upload at least one completion photo");
      return;
    }

    setProcessing(true);
    try {
      // Upload images first
      const formData = new FormData();
      completionImages.forEach((file) => {
        formData.append("files", file);
      });

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload images");
      }

      const { urls } = await uploadResponse.json();

      // Then update report status
      const response = await fetch(`/api/reports/${reportId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete",
          note: note.trim(),
          nextStage: "completed",
          completionImages: urls,
        }),
      });

      if (response.ok) {
        alert("कार्य पूर्ण किया गया / Work completed");
        setSelectedReport(null);
        setNote("");
        setCompletionImages([]);
        setAction(null);
        fetchReports();
      } else {
        alert("त्रुटि / Error completing work");
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
          <Hammer className="w-8 h-8" />
          Contractor Dashboard / ठेकेदार डैशबोर्ड
        </h1>
        <p className="text-gray-600">कार्य शुरू करें और पूर्ण करें / Start and complete work</p>
      </div>

      {reports.length === 0 ? (
        <Card className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">कोई लंबित कार्य नहीं / No Pending Work</h2>
          <p className="text-gray-600">सभी कार्य पूर्ण हो चुके हैं / All work has been completed</p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <Card key={report._id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold flex-1">{report.title}</h3>
                <Badge variant={report.currentStage === "work_in_progress" ? "default" : "warning"}>
                  <Clock className="w-3 h-3 mr-1" />
                  {report.currentStage === "work_in_progress" ? "In Progress" : "Pending"}
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
                  onClick={() => {
                    setSelectedReport(report);
                    setAction(report.currentStage === "pending_contractor" ? "start" : "complete");
                  }}
                  className="flex-1"
                  variant="primary"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {report.currentStage === "pending_contractor" ? "Start Work" : "Complete Work"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {selectedReport && action && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedReport.title}</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold mb-1">विवरण / Description:</h3>
                <p className="text-gray-600">{selectedReport.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">स्थान / Location:</h3>
                <p className="text-gray-600">{selectedReport.address}</p>
                <p className="text-sm text-gray-500">{selectedReport.city}</p>
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

            {action === "complete" && (
              <div className="mb-6">
                <label className="block font-semibold mb-2">
                  पूर्ण कार्य की फोटो अपलोड करें / Upload Completion Photos: <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setCompletionImages(Array.from(e.target.files));
                      }
                    }}
                    className="hidden"
                    id="completion-images"
                  />
                  <label htmlFor="completion-images" className="cursor-pointer">
                    <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {completionImages.length > 0
                        ? `${completionImages.length} फोटो चयनित / ${completionImages.length} photos selected`
                        : "फोटो चुनने के लिए क्लिक करें / Click to select photos"}
                    </p>
                  </label>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() =>
                  action === "start"
                    ? handleStartWork(selectedReport._id)
                    : handleCompleteWork(selectedReport._id)
                }
                disabled={processing || !note.trim() || (action === "complete" && completionImages.length === 0)}
                className="flex-1"
                variant="primary"
              >
                {action === "start" ? <Hammer className="w-4 h-4 mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                {processing
                  ? "प्रोसेसिंग..."
                  : action === "start"
                  ? "कार्य शुरू करें"
                  : "कार्य पूर्ण करें"}
              </Button>
              <Button
                onClick={() => {
                  setSelectedReport(null);
                  setNote("");
                  setCompletionImages([]);
                  setAction(null);
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
