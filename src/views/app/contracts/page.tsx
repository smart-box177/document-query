import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useApplicationStore } from "@/store/application.store";

export default function ContractsPage() {
  const { applications: contracts, isLoading, fetchApplications: fetchContracts } = useApplicationStore();

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  if (isLoading && contracts.length === 0) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={contracts} />
    </div>
  );
}
