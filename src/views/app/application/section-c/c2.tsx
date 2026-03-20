/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface CapacityDevelopmentRecord {
  id: string;
  scopeDetails: string;
  projectLocation: string;
  activityDuration: string;
  numberOfPersonnel: string;
  primaryActivity: string;
  outcome: string;
  costOfActivity: string;
}

const emptyRecord = (): CapacityDevelopmentRecord => ({
  id: Date.now().toString(),
  scopeDetails: "",
  projectLocation: "",
  activityDuration: "",
  numberOfPersonnel: "",
  primaryActivity: "",
  outcome: "",
  costOfActivity: "",
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

const columns: ColumnDef<CapacityDevelopmentRecord>[] = [
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
    accessorKey: "projectLocation",
    header: "PROJECT ACTIVITY LOCATION",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <CellInput
          value={record.projectLocation}
          onChange={(v) => (row.original.projectLocation = v)}
          placeholder="Enter location"
        />
      );
    },
  },
  {
    accessorKey: "activityDuration",
    header: "ACTIVITY DURATION (WEEKS/MONTHS/YEARS)",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <CellInput
          value={record.activityDuration}
          onChange={(v) => (row.original.activityDuration = v)}
          placeholder="e.g., 6 months"
        />
      );
    },
  },
  {
    accessorKey: "numberOfPersonnel",
    header: "NUMBER OF PERSONNEL",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <CellInput
          value={record.numberOfPersonnel}
          onChange={(v) => (row.original.numberOfPersonnel = v)}
          type="number"
          placeholder="0"
        />
      );
    },
  },
  {
    accessorKey: "primaryActivity",
    header: "PRIMARY ACTIVITY TO BE EMBARKED UPON",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <CellInput
          value={record.primaryActivity}
          onChange={(v) => (row.original.primaryActivity = v)}
          placeholder="Enter activity"
        />
      );
    },
  },
  {
    accessorKey: "outcome",
    header: "OUTCOME (INFRASTRUCTURE, LEARNING, ETC) OF ACTIVITY",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <CellInput
          value={record.outcome}
          onChange={(v) => (row.original.outcome = v)}
          placeholder="Enter outcome"
        />
      );
    },
  },
  {
    accessorKey: "costOfActivity",
    header: "COST OF ACTIVITY",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <CellInput
          value={record.costOfActivity}
          onChange={(v) => (row.original.costOfActivity = v)}
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
                const updatedData: CapacityDevelopmentRecord[] = rows
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
  setRecords: (data: CapacityDevelopmentRecord[]) => void;
}

function DataTable({
  columns,
  data,
  meta,
}: {
  columns: ColumnDef<CapacityDevelopmentRecord>[];
  data: CapacityDevelopmentRecord[];
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
    const cost = parseFloat(record.costOfActivity) || 0;
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

const SectionC2 = () => {
  const [records, setRecords] = useState<CapacityDevelopmentRecord[]>([
    emptyRecord(),
  ]);

  const addRecord = () => {
    setRecords([...records, emptyRecord()]);
  };

  const setRecordsHandler = (data: CapacityDevelopmentRecord[]) => {
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
            C2 – Capacity Development Initiative (CDI)
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Capacity Development Initiative - If Applicable
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
          <span className="font-semibold">Note:</span> The Capacity Development
          Initiative (CDI) activities must be aligned with the requirements of
          the NOGICD Act 2010 and NCDMB guidelines for local content
          development.
        </p>
      </div>
    </div>
  );
};

export default SectionC2;
