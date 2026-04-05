/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Filter, MoreHorizontalIcon, FileSpreadsheet, Mail, Download } from "lucide-react";
import { DataTable } from "./contracts/data-table";
import { useApplicationStore } from "@/store/application.store";
import { useApplicationFormStore } from "@/store/application-form.store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const Query = () => {
  const [activeStatus, setActiveStatus] = useState("all");
  const navigate = useNavigate();

  // Export dialog state
  const [exportTarget, setExportTarget] = useState<{ id: string; title: string } | null>(null);
  const [exportMode, setExportMode] = useState<"download" | "email" | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const {
    applications,
    isLoading: appsLoading,
    fetchApplications,
    exportApplication,
  } = useApplicationStore();

  const {
    formData,
  } = useApplicationFormStore();

  const hasLocalDraft = Object.keys(formData).length > 1;

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleExportConfirm = async () => {
    if (!exportTarget || !exportMode) return;
    setIsExporting(true);
    const sendToEmail = exportMode === "email";
    const result = await exportApplication(exportTarget.id, sendToEmail);
    setIsExporting(false);
    setExportTarget(null);
    setExportMode(null);
    if (result.ok) {
      toast.success(sendToEmail ? result.message ?? "Export sent to your email" : "Excel file downloaded");
    } else {
      toast.error(result.message ?? "Export failed");
    }
  };

  // Filter applications by status - any[] to handle local draft
  const tableData: any[] = activeStatus === "local"
    ? hasLocalDraft ? [{
        id: "local-draft",
        status: "DRAFT",
        contractTitle: formData.contractTitle || "Unsaved Draft",
        contractorName: formData.contractorName || "N/A",
        createdAt: new Date().toISOString(),
      }] : []
    : applications;

  const filteredApplications = activeStatus === "all"
    ? tableData
    : tableData.filter((app: any) => app.status === activeStatus);

  const isLoadingTable = appsLoading;

  const applicationColumns = [
    {
      id: "select",
      header: ({ table }: { table: any }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: { row: any }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: "Contract ID",
      accessorKey: "contractNumber",
      cell: ({ row }: any) => row.original.contractNumber || "-",
    },
    {
      header: "Contract Title",
      accessorKey: "contractTitle",
      cell: ({ row }: any) => row.original.contractTitle || "-",
    },
    {
      header: "Contractor",
      accessorKey: "contractorName",
      cell: ({ row }: any) => row.original.contractorName || "-",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: any) => {
        const status = row.original.status;
        const colors: Record<string, string> = {
          APPROVED: "bg-green-100 text-green-800",
          REJECTED: "bg-red-100 text-red-800",
          REVIEWING: "bg-yellow-100 text-yellow-800",
          REVIWING: "bg-yellow-100 text-yellow-800",
          DRAFT: "bg-blue-100 text-blue-800",
          SUBMITTED: "bg-purple-100 text-purple-800",
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"}`}>
            {status}
          </span>
        );
      },
    },
    {
      header: "Submitted Date",
      accessorKey: "submittedDate",
      cell: ({ row }: any) => row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : "-",
    },
    {
      header: "Reviewed By",
      accessorKey: "reviewedBy",
      cell: () => "Pending",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const app = row.original;
        const isDraft = app.status === "DRAFT";
        const appId = app._id ?? app.id;
        const isLocal = appId === "local-draft";
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              {isDraft && (
                <DropdownMenuItem onClick={() => navigate(`/app/new-application/${appId}`)}>
                  Edit Draft
                </DropdownMenuItem>
              )}
              {!isLocal && (
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={() =>
                    setExportTarget({
                      id: appId,
                      title: app.contractTitle || app.sectionA?.contractProjectTitle || appId,
                    })
                  }
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Export to Excel
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <div className="container mx-auto py-10 space-y-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">NCCC Contract Applications</h1>
          <p className="text-muted-foreground">
            Manage and track contract applications
          </p>
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs value={activeStatus} onValueChange={setActiveStatus} className="w-full">
        <TabsList className="grid grid-cols-7 mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            All ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="APPROVED" className="flex items-center gap-2">
            Approved ({applications.filter(app => app.status === "APPROVED").length})
          </TabsTrigger>
          <TabsTrigger value="REJECTED" className="flex items-center gap-2">
            Rejected ({applications.filter(app => app.status === "REJECTED").length})
          </TabsTrigger>
          <TabsTrigger value="REVIEWING" className="flex items-center gap-2">
            Reviewing ({applications.filter(app => app.status === "REVIEWING").length})
          </TabsTrigger>
          <TabsTrigger value="DRAFT" className="flex items-center gap-2">
            Draft ({applications.filter(app => app.status === "DRAFT").length})
          </TabsTrigger>
          <TabsTrigger value="SUBMITTED" className="flex items-center gap-2">
            Submitted ({applications.filter(app => app.status === "SUBMITTED").length})
          </TabsTrigger>
          <TabsTrigger value="local" className="flex items-center gap-2">
            Local Drafts ({hasLocalDraft ? 1 : 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeStatus} className="mt-0">
          <div className="bg-card rounded-lg border shadow-sm">
            {isLoadingTable ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mr-2" />
                <span className="text-muted-foreground">Loading applications...</span>
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-border">
                  <h2 className="text-lg font-semibold text-foreground">
                    {activeStatus === "local" ? "Local Drafts" : activeStatus === "all" ? "All Applications" : `${activeStatus} Applications`}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredApplications.length} application{filteredApplications.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <DataTable columns={applicationColumns} data={filteredApplications} />
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Confirmation Dialog */}
      <Dialog open={!!exportTarget} onOpenChange={(open) => { if (!open) { setExportTarget(null); setExportMode(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
              Export Application to Excel
            </DialogTitle>
            <DialogDescription>
              <span className="font-medium text-foreground">{exportTarget?.title}</span>
              <br />
              Choose how you want to receive the exported Excel file.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 py-2">
            <button
              onClick={() => setExportMode("download")}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-sm transition-colors ${
                exportMode === "download"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50 hover:bg-accent"
              }`}
            >
              <Download className="h-6 w-6" />
              <span className="font-medium">Download File</span>
              <span className="text-xs text-muted-foreground text-center">Save directly to your device</span>
            </button>

            <button
              onClick={() => setExportMode("email")}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-sm transition-colors ${
                exportMode === "email"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50 hover:bg-accent"
              }`}
            >
              <Mail className="h-6 w-6" />
              <span className="font-medium">Send to Email</span>
              <span className="text-xs text-muted-foreground text-center">Receive as email attachment</span>
            </button>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setExportTarget(null); setExportMode(null); }}>
              Cancel
            </Button>
            <Button
              onClick={handleExportConfirm}
              disabled={!exportMode || isExporting}
              className="gap-2"
            >
              {isExporting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isExporting ? "Exporting…" : "Confirm Export"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Query;
