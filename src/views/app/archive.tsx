import { useState } from "react";
import {
  Archive as ArchiveIcon,
  Search,
  RotateCcw,
  Trash2,
  MoreHorizontal,
  Calendar,
  Building2,
  FileText,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface ArchivedContract {
  id: string;
  contractTitle: string;
  operator: string;
  contractorName: string;
  contractNumber: string;
  year: string;
  contractValue: number;
  archivedAt: string;
  archivedBy: string;
}

// Mock data - replace with actual API
const mockArchived: ArchivedContract[] = [
  {
    id: "1",
    contractTitle: "Legacy Drilling Services Agreement",
    operator: "NNPC",
    contractorName: "Baker Hughes",
    contractNumber: "NNPC/BH/2020/045",
    year: "2020",
    contractValue: 12000000,
    archivedAt: "2024-12-20T10:30:00Z",
    archivedBy: "John Doe",
  },
  {
    id: "2",
    contractTitle: "Expired Pipeline Inspection Contract",
    operator: "Shell",
    contractorName: "TechnipFMC",
    contractNumber: "SHELL/TFM/2019/012",
    year: "2019",
    contractValue: 5500000,
    archivedAt: "2024-12-18T14:20:00Z",
    archivedBy: "Jane Smith",
  },
  {
    id: "3",
    contractTitle: "Completed Subsea Installation Project",
    operator: "Chevron",
    contractorName: "Subsea 7",
    contractNumber: "CVX/SS7/2021/008",
    year: "2021",
    contractValue: 28000000,
    archivedAt: "2024-12-15T09:15:00Z",
    archivedBy: "Admin User",
  },
  {
    id: "4",
    contractTitle: "Old Environmental Assessment",
    operator: "SEPLAT",
    contractorName: "ERM Nigeria",
    contractNumber: "SEPLAT/ERM/2018/003",
    year: "2018",
    contractValue: 800000,
    archivedAt: "2024-12-10T16:45:00Z",
    archivedBy: "John Doe",
  },
];

const Archive = () => {
  const [archived, setArchived] = useState<ArchivedContract[]>(mockArchived);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [emptyArchiveDialogOpen, setEmptyArchiveDialogOpen] = useState(false);

  const filteredArchived = archived.filter(
    (item) =>
      item.contractTitle.toLowerCase().includes(filter.toLowerCase()) ||
      item.operator.toLowerCase().includes(filter.toLowerCase()) ||
      item.contractorName.toLowerCase().includes(filter.toLowerCase()) ||
      item.contractNumber.toLowerCase().includes(filter.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleRestore = async (id: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setArchived((prev) => prev.filter((item) => item.id !== id));
    setIsLoading(false);
    setRestoreDialogOpen(false);
    setSelectedItem(null);
    toast.success("Contract restored successfully");
  };

  const handlePermanentDelete = async (id: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setArchived((prev) => prev.filter((item) => item.id !== id));
    setIsLoading(false);
    setDeleteDialogOpen(false);
    setSelectedItem(null);
    toast.success("Contract permanently deleted");
  };

  const handleEmptyArchive = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setArchived([]);
    setIsLoading(false);
    setEmptyArchiveDialogOpen(false);
    toast.success("Archive emptied successfully");
  };

  const getSelectedContract = () => {
    return archived.find((item) => item.id === selectedItem);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Archive</h1>
          <p className="text-muted-foreground">
            Archived NCCC contracts • {archived.length} item
            {archived.length !== 1 ? "s" : ""}
          </p>
        </div>
        {archived.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEmptyArchiveDialogOpen(true)}
            disabled={isLoading}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Empty Archive
          </Button>
        )}
      </div>

      {/* Filter */}
      {archived.length > 0 && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter archived contracts..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Empty State */}
      {archived.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ArchiveIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Archive is empty</h3>
            <p className="text-muted-foreground mb-4">
              Archived contracts will appear here
            </p>
            <Button onClick={() => window.open("/app", "_self")}>
              <Search className="h-4 w-4 mr-2" />
              Search Contracts
            </Button>
          </CardContent>
        </Card>
      )}

      {/* No Filter Results */}
      {archived.length > 0 && filteredArchived.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              No archived contracts match "{filter}"
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info Banner */}
      {archived.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Archived contracts</p>
            <p className="text-muted-foreground">
              Items in the archive are hidden from search results. You can
              restore them at any time or permanently delete them.
            </p>
          </div>
        </div>
      )}

      {/* Archived List */}
      {filteredArchived.length > 0 && (
        <div className="space-y-3">
          {filteredArchived.map((item) => (
            <Card
              key={item.id}
              className="hover:shadow-md transition-shadow opacity-80 hover:opacity-100"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <ArchiveIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <h3
                        className="font-medium truncate"
                        title={item.contractTitle}
                      >
                        {item.contractTitle}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.contractNumber}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedItem(item.id);
                          setRestoreDialogOpen(true);
                        }}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Restore
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setSelectedItem(item.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Permanently
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span className="truncate">{item.operator}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="truncate">{item.contractorName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{item.year}</span>
                  </div>
                  <div className="text-right font-medium">
                    {formatCurrency(item.contractValue)}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                  <span>Archived {formatDate(item.archivedAt)}</span>
                  <span>by {item.archivedBy}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Restore Dialog */}
      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore contract?</AlertDialogTitle>
            <AlertDialogDescription>
              "{getSelectedContract()?.contractTitle}" will be restored and
              visible in search results again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedItem && handleRestore(selectedItem)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Restore"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              "{getSelectedContract()?.contractTitle}" will be permanently
              deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedItem && handlePermanentDelete(selectedItem)}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete Permanently"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Empty Archive Dialog */}
      <AlertDialog
        open={emptyArchiveDialogOpen}
        onOpenChange={setEmptyArchiveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Empty archive?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all {archived.length} archived
              contract{archived.length !== 1 ? "s" : ""}. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEmptyArchive}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Empty Archive"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Archive;
