/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Filter, MoreHorizontalIcon } from "lucide-react";
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

// import type { IApplication } from "@/interface/application";

const Query = () => {
  const [activeStatus, setActiveStatus] = useState("all");

  const {
    applications,
    isLoading: appsLoading,
    fetchApplications,
  } = useApplicationStore();

  const {
    formData,
  } = useApplicationFormStore();

  const hasLocalDraft = Object.keys(formData).length > 1;

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Filter applications by status - any[] to handle local draft
  const tableData: any[] = activeStatus === "local" 
    ? hasLocalDraft ? [{
        id: "local-draft",
        status: "DRAFT",
        sectionA: formData.sectionA || { contractProjectTitle: "Unsaved Draft", mainContractor: "N/A" },
        createdAt: new Date().toISOString(),
      }] : []
    : applications;
    
  const filteredApplications = activeStatus === "all" 
    ? tableData 
    : tableData.filter((app: any) => app.status === activeStatus);

  const isLoadingTable = appsLoading;

  // Table columns for applications (updated for real IApplication data)
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
      accessorKey: "contractId",
      cell: ({ row }: any) => row.original.contractId || row.original.sectionA?.contractProjectNumber || "-",
    },
    {
      header: "Contract Title",
      accessorKey: "contractTitle",
      cell: ({ row }: any) => row.original.sectionA?.contractProjectTitle || "-",
    },
    {
      header: "Contractor",
      accessorKey: "contractorName",
      cell: ({ row }: any) => row.original.sectionA?.mainContractor || "-",
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
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
             <MoreHorizontalIcon/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <div className="container mx-auto py-10 space-y-6">
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
          {/* Applications Table */}
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
    </div>
  );
};

export default Query;
