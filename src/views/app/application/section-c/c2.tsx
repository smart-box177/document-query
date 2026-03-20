import { useState } from 'react'
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
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface LocalContentPlanRecord {
  id: string
  activity: string
  description: string
  targetPercentage: string
}

const emptyRecord = (): LocalContentPlanRecord => ({
  id: Date.now().toString(),
  activity: '',
  description: '',
  targetPercentage: '',
})

const CellInput = ({
  value,
  onChange,
  type = 'text',
  placeholder = '',
  step = '',
}: {
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  step?: string
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
)

const columns: ColumnDef<LocalContentPlanRecord>[] = [
  {
    accessorKey: 'activity',
    header: 'ACTIVITY',
    cell: ({ row }) => {
      const record = row.original
      return (
        <CellInput
          value={record.activity}
          onChange={(v) => row.original.activity = v}
          placeholder="Enter activity"
        />
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'DESCRIPTION',
    cell: ({ row }) => {
      const record = row.original
      return (
        <CellInput
          value={record.description}
          onChange={(v) => row.original.description = v}
          placeholder="Enter description"
        />
      )
    },
  },
  {
    accessorKey: 'targetPercentage',
    header: 'TARGET NC%',
    cell: ({ row }) => {
      const record = row.original
      return (
        <div className="flex items-center justify-center">
          <CellInput
            value={record.targetPercentage}
            onChange={(v) => row.original.targetPercentage = v}
            type="number"
            step="0.01"
            placeholder="0.00"
          />
          <span className="text-xs text-muted-foreground ml-1">%</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'action',
    header: 'ACTION',
    cell: ({ row, table }) => {
      const record = row.original
      const dataLength = table.getRowModel().rows.length
      
      return (
        <div className="flex items-center justify-center">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (dataLength > 1) {
                const rows = table.getRowModel().rows;
                const updatedData: LocalContentPlanRecord[] = rows.filter(r => r.original.id !== record.id).map(r => r.original);
                (table.options.meta as unknown as TableMeta).setRecords(updatedData);
              }
            }}
            disabled={dataLength === 1}
            className="text-xs"
          >
            Remove
          </Button>
        </div>
      )
    },
  },
]

interface TableMeta {
  setRecords: (data: LocalContentPlanRecord[]) => void
}

function DataTable({
  columns,
  data,
  meta,
}: {
  columns: ColumnDef<LocalContentPlanRecord>[]
  data: LocalContentPlanRecord[]
  meta?: TableMeta
}) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

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
  })

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
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table className="border-collapse">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

const SectionC2 = () => {
  const [records, setRecords] = useState<LocalContentPlanRecord[]>([emptyRecord()])

  const addRecord = () => {
    setRecords([...records, emptyRecord()])
  }

  const setRecordsHandler = (data: LocalContentPlanRecord[]) => {
    setRecords(data)
  }

  const tableMeta = {
    setRecords: setRecordsHandler,
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground">
            C2 – Local Content Plan
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Detailed local content implementation plan
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={addRecord}
        >
          + Add Row
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={records}
        meta={tableMeta}
      />

      {/* Declaration */}
      <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 p-4 rounded-lg">
        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          <span className="font-semibold">Note:</span> The local content plan must detail all activities 
          and targets in line with the NOGICD Act 2010 and NCDMB guidelines.
        </p>
      </div>
    </div>
  )
}

export default SectionC2
