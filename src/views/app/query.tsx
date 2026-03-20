/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FileText, RefreshCw, Filter, MoreHorizontalIcon } from "lucide-react";
import { columns as contractColumns } from "./contracts/columns";
import { DataTable } from "./contracts/data-table";
import { useContractStore } from "@/store/contract.store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dummy application data
interface Application {
  id: string;
  contractId: string;
  contractTitle: string;
  contractorName: string;
  status: "APPROVED" | "REJECTED" | "REVIEWING" | "DRAFT" | "SUBMITTED";
  submittedDate: string;
  reviewedBy: string;
}

const dummyApplications: Application[] = [
  {
    id: "1",
    contractId: "123",
    contractTitle: "Oil Pipeline Construction",
    contractorName: "Nigerian Construction Company",
    status: "APPROVED",
    submittedDate: "2024-01-15",
    reviewedBy: "John Doe",
  },
  {
    id: "2",
    contractId: "456",
    contractTitle: "Refinery Maintenance",
    contractorName: "Global Engineering Services",
    status: "REJECTED",
    submittedDate: "2024-01-18",
    reviewedBy: "Jane Smith",
  },
  {
    id: "3",
    contractId: "789",
    contractTitle: "Offshore Platform Installation",
    contractorName: "Marine Engineering Ltd",
    status: "REVIEWING",
    submittedDate: "2024-01-20",
    reviewedBy: "Pending",
  },
  {
    id: "4",
    contractId: "101",
    contractTitle: "Gas Processing Plant Upgrade",
    contractorName: "Energy Solutions Inc",
    status: "DRAFT",
    submittedDate: "2024-01-22",
    reviewedBy: "Pending",
  },
  {
    id: "5",
    contractId: "102",
    contractTitle: "Drilling Rig Maintenance",
    contractorName: "Drilling Services Co.",
    status: "SUBMITTED",
    submittedDate: "2024-01-25",
    reviewedBy: "Pending",
  },
];

const Query = () => {
  const [activeStatus, setActiveStatus] = useState("all");
  const {
    contracts,
    isLoading,
    fetchContracts,
  } = useContractStore();

  // Filter applications by status
  const filteredApplications = activeStatus === "all" 
    ? dummyApplications 
    : dummyApplications.filter(app => app.status === activeStatus);

  // Table columns for applications
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
    },
    {
      header: "Contract Title",
      accessorKey: "contractTitle",
    },
    {
      header: "Contractor",
      accessorKey: "contractorName",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info: { getValue: () => unknown }) => {
        const status = info.getValue() as Application["status"];
        const colors = {
          APPROVED: "bg-green-100 text-green-800",
          REJECTED: "bg-red-100 text-red-800",
          REVIEWING: "bg-yellow-100 text-yellow-800",
          DRAFT: "bg-blue-100 text-blue-800",
          SUBMITTED: "bg-purple-100 text-purple-800",
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}>
            {status}
          </span>
        );
      },
    },
    {
      header: "Submitted Date",
      accessorKey: "submittedDate",
    },
    {
      header: "Reviewed By",
      accessorKey: "reviewedBy",
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
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            All ({dummyApplications.length})
          </TabsTrigger>
          <TabsTrigger value="APPROVED" className="flex items-center gap-2">
            Approved ({dummyApplications.filter(app => app.status === "APPROVED").length})
          </TabsTrigger>
          <TabsTrigger value="REJECTED" className="flex items-center gap-2">
            Rejected ({dummyApplications.filter(app => app.status === "REJECTED").length})
          </TabsTrigger>
          <TabsTrigger value="REVIEWING" className="flex items-center gap-2">
            Reviewing ({dummyApplications.filter(app => app.status === "REVIEWING").length})
          </TabsTrigger>
          <TabsTrigger value="DRAFT" className="flex items-center gap-2">
            Draft ({dummyApplications.filter(app => app.status === "DRAFT").length})
          </TabsTrigger>
          <TabsTrigger value="SUBMITTED" className="flex items-center gap-2">
            Submitted ({dummyApplications.filter(app => app.status === "SUBMITTED").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeStatus} className="mt-0">
          {/* Applications Table */}
          <div className="bg-white rounded-lg shadow p-3">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">
                {activeStatus === "all" ? "All Applications" : `${activeStatus} Applications`}
              </h2>
              <p className="text-sm text-muted-foreground">
                Showing {filteredApplications.length} application{filteredApplications.length !== 1 ? "s" : ""}
              </p>
            </div>
            
            <DataTable columns={applicationColumns} data={filteredApplications} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Contracts Information */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">NCCC Contracts</h2>
            <Button
            onClick={() => fetchContracts({})}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
        
        {contracts.length > 0 ? (
          <DataTable columns={contractColumns} data={contracts} />
        ) : (
          <div className="flex flex-col items-center justify-center py-10 bg-white rounded-lg shadow">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No contracts found</h3>
            <p className="text-muted-foreground mb-4">
              There are no NCCC contracts in the database yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Query;
