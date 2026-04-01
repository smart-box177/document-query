import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CheckCircle, XCircle, AlertCircle, FileText, Search, Loader2 } from "lucide-react";
import { useApplicationStore } from "@/store/application.store";
import { type IApplication } from "@/interface/application";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ApplicationPreview from "./application/preview";
import { useApplicationFormStore } from "@/store/application-form.store";
import { Label } from "@/components/ui/label";

const ApplicationReviewQueue = () => {
  const { applications, fetchApplications, reviewApplication, isLoading } = useApplicationStore();
  const { updateFormData } = useApplicationFormStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedApp, setSelectedApp] = useState<IApplication | null>(null);
  
  // Modal states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"APPROVED" | "REJECTED" | "REVISION_REQUESTED" | null>(null);
  const [adminComments, setAdminComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.sectionA?.contractProjectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.sectionA?.operatorOrProjectPromoter?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.sectionA?.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    
    // Only show submitted apps or those in review process, not drafts
    const isSubmittable = app.status !== "DRAFT";
    
    return matchesSearch && matchesStatus && isSubmittable;
  });

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "SUBMITTED":
        return <Badge variant="secondary">Submitted</Badge>;
      case "REVIEWING":
        return <Badge variant="destructive">Under Review</Badge>;
      case "APPROVED":
        return <Badge variant="outline">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      case "REVISION_REQUESTED":
        return <Badge variant="outline" className="text-orange-500 border-orange-500">Revision Required</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleActionClick = (app: IApplication, action: "APPROVED" | "REJECTED" | "REVISION_REQUESTED") => {
    setSelectedApp(app);
    setActionType(action);
    setAdminComments(app.adminComments || "");
    setIsReviewModalOpen(true);
  };

  const handlePreviewClick = (app: IApplication) => {
    updateFormData(app);
    setSelectedApp(app);
    setIsPreviewModalOpen(true);
  };

  const submitReview = async () => {
    if (!selectedApp?.id || !actionType) return;
    
    if ((actionType === "REJECTED" || actionType === "REVISION_REQUESTED") && !adminComments.trim()) {
      toast.error("Comments are required for rejections or revision requests.");
      return;
    }

    setIsSubmitting(true);
    const success = await reviewApplication(selectedApp.id, actionType, adminComments);
    setIsSubmitting(false);

    if (success) {
      toast.success(`Application ${actionType.toLowerCase().replace('_', ' ')} successfully`);
      setIsReviewModalOpen(false);
      setSelectedApp(null);
      setActionType(null);
      setAdminComments("");
    }
  };

  const getActionTitle = () => {
    if (actionType === "APPROVED") return "Approve Application";
    if (actionType === "REJECTED") return "Reject Application";
    if (actionType === "REVISION_REQUESTED") return "Request Revision";
    return "Review Application";
  };

  const getActionDescription = () => {
    if (actionType === "APPROVED") return "Are you sure you want to approve this application? The operator will be notified.";
    if (actionType === "REJECTED") return "Please provide a reason for rejecting this application.";
    if (actionType === "REVISION_REQUESTED") return "Please specify what needs to be revised by the operator.";
    return "";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Application Review Queue</h1>
          <p className="text-muted-foreground">
            Review, approve, or request revisions for operator applications
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardTitle>Applications</CardTitle>
            <div className="flex w-full sm:w-auto items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or operator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="SUBMITTED">Pending Review</SelectItem>
                  <SelectItem value="REVIEWING">Under Review</SelectItem>
                  <SelectItem value="REVISION_REQUESTED">Revision Requested</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && applications.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-medium">No applications found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                There are no applications matching your current filters.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference / Title</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div className="font-medium">{app.sectionA?.referenceNumber || "N/A"}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {app.sectionA?.contractProjectTitle || "Untitled"}
                        </div>
                      </TableCell>
                      <TableCell>{app.sectionA?.operatorOrProjectPromoter || "Unknown"}</TableCell>
                      <TableCell>
                        {app.updatedAt ? format(new Date(app.updatedAt), "MMM d, yyyy") : "N/A"}
                      </TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePreviewClick(app)}
                        >
                          <FileText className="h-4 w-4 mr-1" /> View
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-orange-950"
                          onClick={() => handleActionClick(app, "REVISION_REQUESTED")}
                        >
                          <AlertCircle className="h-4 w-4 mr-1" /> Revise
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                          onClick={() => handleActionClick(app, "REJECTED")}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>

                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950"
                          onClick={() => handleActionClick(app, "APPROVED")}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Review Modal */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getActionTitle()}</DialogTitle>
            <DialogDescription>
              {getActionDescription()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="comments">Admin Comments</Label>
            <Textarea
              id="comments"
              placeholder="Provide detailed feedback for the operator..."
              className="mt-2 min-h-[100px]"
              value={adminComments}
              onChange={(e) => setAdminComments(e.target.value)}
              required={actionType === "REJECTED" || actionType === "REVISION_REQUESTED"}
            />
            {(actionType === "REJECTED" || actionType === "REVISION_REQUESTED") && (
              <p className="text-xs text-destructive mt-1">* Comments are required for this action.</p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={submitReview} 
              disabled={isSubmitting || ((actionType === "REJECTED" || actionType === "REVISION_REQUESTED") && !adminComments.trim())}
              variant={actionType === "APPROVED" ? "default" : actionType === "REJECTED" ? "destructive" : "secondary"}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Confirm {actionType === "REVISION_REQUESTED" ? "Revision" : actionType === "APPROVED" ? "Approval" : "Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-5xl h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Application Preview</DialogTitle>
            <DialogDescription>
              {selectedApp?.sectionA?.referenceNumber} - {selectedApp?.sectionA?.operatorOrProjectPromoter}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
             <ApplicationPreview />
          </div>
          
          <DialogFooter className="mt-4 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>
              Close
            </Button>
            <Button variant="secondary" onClick={() => {
              setIsPreviewModalOpen(false);
              if(selectedApp) handleActionClick(selectedApp, "REVISION_REQUESTED");
            }}>
              Request Revision
            </Button>
            <Button onClick={() => {
              setIsPreviewModalOpen(false);
              if(selectedApp) handleActionClick(selectedApp, "APPROVED");
            }}>
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationReviewQueue;
