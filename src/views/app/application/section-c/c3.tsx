import { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface RnDRecord {
  id: string;
  scopeDetails: string;
  rndPlan: string;
  rndCluster: string;
  rndLocation: string;
  rndDuration: string;
  expectedObjective: string;
  cost: string;
}

const emptyRecord = (): RnDRecord => ({
  id: Date.now().toString(),
  scopeDetails: "",
  rndPlan: "",
  rndCluster: "",
  rndLocation: "",
  rndDuration: "",
  expectedObjective: "",
  cost: "",
});

const CellInput = ({
  value,
  onChange,
  type = "text",
  placeholder = "",
  step = "",
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  step?: string;
}) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    step={step}
    className="w-full bg-transparent border-0 outline-none text-sm text-center px-1 py-1 placeholder:text-muted-foreground/40 focus:bg-primary/5 rounded transition-colors"
    style={{ minWidth: 0 }}
  />
);

const columns: ColumnDef<RnDRecord>[] = [
  {
    accessorKey: "scopeDetails",
    header: "SCOPE DETAILS",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <CellInput
          value={record.scopeDetails}
          onChange={(v) => (row.original.scopeDetails = v)}
          placeholder="Enter scope details"
        />
      );
    },
  },
  {
    accessorKey: "rndPlan",
    header: "R&D PLAN",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <CellInput
          value={record.rndPlan}
          onChange={(v) => (row.original.rndPlan = v)}
          placeholder="Enter R&D plan"
        />
      );
    },
  },
  {
    accessorKey: "rndCluster",
    header: "PROVIDE NAME & LOCATION OF R&D CLUSTER",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <CellInput
          value={record.rndCluster}
          onChange={(v) => (row.original.rndCluster = v)}
          placeholder="Enter cluster details"
        />
      );
    },
  },
  {
    accessorKey: "rndLocation",
    header: "NAME AND ADDRESS OF R&D LOCATION",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <CellInput
          value={record.rndLocation}
          onChange={(v) => (row.original.rndLocation = v)}
          placeholder="Enter location"
        />
      );
    },
  },
  {
    accessorKey: "rndDuration",
    header: "R&D DURATION (WEEKS/MONTHS/YEARS)",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <CellInput
          value={record.rndDuration}
          onChange={(v) => (row.original.rndDuration = v)}
          placeholder="e.g., 12 months"
        />
      );
    },
  },
  {
    accessorKey: "expectedObjective",
    header: "EXPECTED OBJECTIVE/OUTCOME OF R&D",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <CellInput
          value={record.expectedObjective}
          onChange={(v) => (row.original.expectedObjective = v)}
          placeholder="Enter objective"
        />
      );
    },
  },
  {
    accessorKey: "cost",
    header: "COST (IF APPLICABLE)",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <CellInput
          value={record.cost}
          onChange={(v) => (row.original.cost = v)}
          type="number"
          step="0.01"
          placeholder="0.00"
        />
      );
    },
  },
  {
    accessorKey: "action",
    header: "ACTION",
    cell: ({ row, table }) => {
      const record = row.original;
      const dataLength = table.getRowModel().rows.length;

      return (
        <div className="flex items-center justify-center">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (dataLength > 1) {
                const rows = table.getRowModel().rows;
                const updatedData: RnDRecord[] = rows
                  .filter((r) => r.original.id !== record.id)
                  .map((r) => r.original);
                (table.options.meta as unknown as TableMeta).setRecords(
                  updatedData
                );
              }
            }}
            disabled={dataLength === 1}
            className="text-xs"
          >
            Remove
          </Button>
        </div>
      );
    },
  },
];

interface TableMeta {
  setRecords: (data: RnDRecord[]) => void;
}

function DataTable({
  columns,
  data,
  meta,
}: {
  columns: ColumnDef<RnDRecord>[];
  data: RnDRecord[];
  meta?: TableMeta;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta,
  });

  // Calculate total cost
  const totalCost = data.reduce((sum, record) => {
    const cost = parseFloat(record.cost) || 0;
    return sum + cost;
  }, 0);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table className="border-collapse">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="">
                <TableHead className="text-center bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-white w-12">
                  S/N
                </TableHead>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="
                    text-center 
                    bg-yellow-50 dark:bg-yellow-950/20 
                    text-yellow-800 dark:text-white 
                    whitespace-normal wrap-break-word leading-tight py-3
                  "
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  <TableCell className="text-center w-12">
                    {index + 1}
                  </TableCell>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
            {/* Total Cost Row */}
            <TableRow className="bg-yellow-50 dark:bg-yellow-950/20 font-bold">
              <TableCell colSpan={7} className="text-left px-4 py-2">
                TOTAL COST
              </TableCell>
              <TableCell className="text-center">
                ${totalCost.toFixed(2)}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const SectionC3 = () => {
  const [records, setRecords] = useState<RnDRecord[]>([emptyRecord()]);

  const addRecord = () => {
    setRecords([...records, emptyRecord()]);
  };

  const setRecordsHandler = (data: RnDRecord[]) => {
    setRecords(data);
  };

  const tableMeta = {
    setRecords: setRecordsHandler,
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground">
            C3 – R&D (If Applicable)
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Research and Development Activities
          </p>
        </div>
        <Button variant="default" size="sm" onClick={addRecord}>
          + Add Row
        </Button>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={records} meta={tableMeta} />

      {/* Declaration */}
      <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 p-4 rounded-lg">
        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          <span className="font-semibold">Note:</span> Research and Development
          (R&D) activities must be aligned with the requirements of the NOGICD
          Act 2010 and NCDMB guidelines for local content development.
        </p>
      </div>
    </div>
  );
};

export default SectionC3;
