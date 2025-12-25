import { useEffect } from "react";
import { Loader2, AlertCircle, FileText, RefreshCw } from "lucide-react";
import { columns } from "./contracts/columns";
import { DataTable } from "./contracts/data-table";
import { useContractStore } from "@/store/contract.store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Query = () => {
  const {
    contracts,
    pagination,
    isLoading,
    error,
    fetchContracts,
    clearError,
  } = useContractStore();

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleRefresh = () => {
    fetchContracts();
  };

  // Loading state
  if (isLoading && contracts.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading contracts...</p>
        </div>
      </div>
    );
  }

  // Error state with no data
  if (error && contracts.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-10 w-10 text-destructive mb-4" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!isLoading && contracts.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center py-20">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No contracts found</h3>
          <p className="text-muted-foreground mb-4">
            There are no NCCC contracts in the database yet.
          </p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">NCCC Contracts</h1>
          <p className="text-muted-foreground">
            {pagination.total} contract{pagination.total !== 1 ? "s" : ""} found
          </p>
        </div>
        <Button
          onClick={handleRefresh}
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
      <DataTable columns={columns} data={contracts} />
    </div>
  );
};

export default Query;
