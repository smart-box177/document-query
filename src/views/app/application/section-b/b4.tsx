import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerFooter,
    DrawerClose
} from '@/components/ui/drawer'
import { FloatingInput } from '@/components/ui/floating-input'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'

interface FabricationRecord {
    id: string
    itemName: string
    inCountryFabricationYard: string
    outCountryFabricationYard: string
    uom: string
    fabricatedInCountry: string
    fabricatedOutCountry: string
    ncPercentTonage: string
    ncValue: string
    foreignValue: string
    totalValue: string
    ncSpendPercent: string
}

const emptyRecord = (): FabricationRecord => ({
    id: Date.now().toString(),
    itemName: '',
    inCountryFabricationYard: '',
    outCountryFabricationYard: '',
    uom: '',
    fabricatedInCountry: '',
    fabricatedOutCountry: '',
    ncPercentTonage: '',
    ncValue: '',
    foreignValue: '',
    totalValue: '',
    ncSpendPercent: '',
})

const sumField = (records: FabricationRecord[], field: keyof FabricationRecord): number => {
    return records.reduce((acc, r) => acc + (parseFloat(r[field] as string) || 0), 0)
}

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

const SectionB4 = () => {
    const [records, setRecords] = useState<FabricationRecord[]>([])
    const [open, setOpen] = useState(false)
    const [newRecord, setNewRecord] = useState<Omit<FabricationRecord, 'id'>>(emptyRecord())

    const addRecord = () => setRecords((prev) => [...prev, emptyRecord()])

    const removeRecord = (id: string) => {
        if (records.length > 1) setRecords((prev) => prev.filter((r) => r.id !== id))
    }

    const update = (id: string, field: keyof FabricationRecord, value: string) => {
        setRecords((prev) =>
            prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
        )
    }

    const handleAddRecord = () => {
        const record: FabricationRecord = {
            ...newRecord,
            id: Date.now().toString()
        }
        setRecords([...records, record])
        setNewRecord(emptyRecord())
        setOpen(false)
    }

    const totals = {
        ncValue: sumField(records, 'ncValue'),
        foreignValue: sumField(records, 'foreignValue'),
        totalValue: sumField(records, 'totalValue'),
    }

    const totalNCSpend =
        totals.totalValue > 0
            ? ((totals.ncValue / totals.totalValue) * 100).toFixed(1) + '%'
            : '—'

    return (
        <div className="flex flex-col gap-4 py-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                        B4 – Fabrication of Work Elements
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Construction & Installation
                    </p>
                </div>
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1.5 text-xs"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Row
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Add New Fabrication Record</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4 space-y-6">
                            {/* Item Information */}
                            <div className="space-y-4">
                                <FloatingInput
                                    label="Items (List items to be Fabricated)"
                                    value={newRecord.itemName}
                                    onChange={(e) => setNewRecord({ ...newRecord, itemName: e.target.value })}
                                />
                            </div>

                            {/* Vendor Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FloatingInput
                                    label="Name & Address of In-Country Fabrication Yard"
                                    value={newRecord.inCountryFabricationYard}
                                    onChange={(e) => setNewRecord({ ...newRecord, inCountryFabricationYard: e.target.value })}
                                />
                                <FloatingInput
                                    label="Name & Address of Out-Country Fabrication Yard"
                                    value={newRecord.outCountryFabricationYard}
                                    onChange={(e) => setNewRecord({ ...newRecord, outCountryFabricationYard: e.target.value })}
                                />
                            </div>

                            {/* UoM */}
                            <div className="space-y-4">
                                <FloatingInput
                                    label="UoM (Tonnage)"
                                    value={newRecord.uom}
                                    onChange={(e) => setNewRecord({ ...newRecord, uom: e.target.value })}
                                    placeholder="Tonnage"
                                />
                            </div>

                            {/* Fabrication Domiciliation */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FloatingInput
                                    label="% Fabricated (In-Country)"
                                    type="number"
                                    step="0.01"
                                    value={newRecord.fabricatedInCountry}
                                    onChange={(e) => setNewRecord({ ...newRecord, fabricatedInCountry: e.target.value })}
                                    placeholder="0.00"
                                />
                                <FloatingInput
                                    label="% Fabricated (Out-Country)"
                                    type="number"
                                    step="0.01"
                                    value={newRecord.fabricatedOutCountry}
                                    onChange={(e) => setNewRecord({ ...newRecord, fabricatedOutCountry: e.target.value })}
                                    placeholder="0.00"
                                />
                                <FloatingInput
                                    label="NC% (Tonnage)"
                                    type="number"
                                    step="0.01"
                                    value={newRecord.ncPercentTonage}
                                    onChange={(e) => setNewRecord({ ...newRecord, ncPercentTonage: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>

                            {/* Value */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FloatingInput
                                    label="NC Value (FUSD)"
                                    type="number"
                                    step="0.01"
                                    value={newRecord.ncValue}
                                    onChange={(e) => setNewRecord({ ...newRecord, ncValue: e.target.value })}
                                    placeholder="0.00"
                                />
                                <FloatingInput
                                    label="Foreign Value (FUSD)"
                                    type="number"
                                    step="0.01"
                                    value={newRecord.foreignValue}
                                    onChange={(e) => setNewRecord({ ...newRecord, foreignValue: e.target.value })}
                                    placeholder="0.00"
                                />
                                <FloatingInput
                                    label="Total Value (FUSD)"
                                    type="number"
                                    step="0.01"
                                    value={newRecord.totalValue}
                                    onChange={(e) => setNewRecord({ ...newRecord, totalValue: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>

                            {/* NC% Spend */}
                            <div className="space-y-4">
                                <FloatingInput
                                    label="NC% (Spend)"
                                    type="number"
                                    step="0.01"
                                    value={newRecord.ncSpendPercent}
                                    onChange={(e) => setNewRecord({ ...newRecord, ncSpendPercent: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <DrawerFooter>
                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                            <Button onClick={handleAddRecord}>Add Record</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-border/60 shadow-sm">
                <Table className="text-xs" style={{ minWidth: 1200 }}>
                    <TableHeader>
                        <TableRow className="bg-muted/60 text-muted-foreground">
                            {/* S/N */}
                            <TableHead rowSpan={2} className="w-10 text-center border border-border/50 px-2 py-2 font-semibold">
                                S/N
                            </TableHead>
                            {/* Item Name */}
                            <TableHead rowSpan={2} className="w-32 text-center border border-border/50 px-2 py-2 font-semibold">
                                ITEMS <br />(List items to be Fabricated)
                            </TableHead>
                            {/* Vendor Details */}
                            <TableHead colSpan={2} className="text-center border border-border/50 px-2 py-2 font-semibold">
                                VENDOR DETAILS & FABRICATION YARD LOCATION
                            </TableHead>
                            {/* UoM */}
                            <TableHead rowSpan={2} className="w-20 text-center border border-border/50 px-2 py-2 font-semibold">
                                UoM <br />(Tonnage)
                            </TableHead>
                            {/* Fabrication Domiciliation */}
                            <TableHead colSpan={3} className="text-center border border-border/50 px-2 py-2 font-semibold">
                                FABRICATION DOMICILIATION
                            </TableHead>
                            {/* Value */}
                            <TableHead colSpan={3} className="text-center border border-border/50 px-2 py-2 font-semibold">
                                VALUE <br />(FUSD)
                            </TableHead>
                            {/* NC% Spend */}
                            <TableHead rowSpan={3} className="w-20 text-center border border-border/50 px-2 py-2 font-semibold">
                                NC% (Spend)
                            </TableHead>
                            {/* Actions */}
                            <TableHead rowSpan={3} className="w-10 text-center border border-border/50 px-2 py-2 font-semibold">
                                &nbsp;
                            </TableHead>
                        </TableRow>

                        <TableRow className="bg-muted/40 text-muted-foreground">
                            {/* Vendor sub-columns */}
                            <TableHead className="text-center border border-border/50 px-2 py-1 font-medium">
                                NAME & ADDRESS OF IN-COUNTRY FABRICATION YARD
                            </TableHead>
                            <TableHead className="text-center border border-border/50 px-2 py-1 font-medium">
                                NAME & ADDRESS OF OUT-COUNTRY FABRICATION YARD
                            </TableHead>
                            {/* Fabrication domiciliation sub-columns */}
                            <TableHead className="text-center border border-border/50 px-2 py-1 font-medium">
                                % FABRICATED <br />(In-Country)
                            </TableHead>
                            <TableHead className="text-center border border-border/50 px-2 py-1 font-medium">
                                % FABRICATED <br />(Out-Country)
                            </TableHead>
                            <TableHead className="text-center border border-border/50 px-2 py-1 font-medium">
                                NC% (Tonnage)
                            </TableHead>
                            {/* Value sub-columns */}
                            <TableHead className="text-center border border-border/50 px-2 py-1 font-medium">
                                NC Value
                            </TableHead>
                            <TableHead className="text-center border border-border/50 px-2 py-1 font-medium">
                                Foreign Value
                            </TableHead>
                            <TableHead className="text-center border border-border/50 px-2 py-1 font-medium">
                                Total Value
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {records.map((record, index) => {
                            const total = parseFloat(record.totalValue) || 0
                            const ncVal = parseFloat(record.ncValue) || 0
                            const ncSpendPct =
                                total > 0 ? ((ncVal / total) * 100).toFixed(1) + '%' : '—'

                            return (
                                <TableRow key={record.id} className="hover:bg-muted/20 transition-colors group">
                                    <TableCell className="text-center text-muted-foreground border border-border/40 px-2 py-1">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.itemName}
                                            onChange={(v) => update(record.id, 'itemName', v)}
                                            placeholder="Enter item"
                                        />
                                    </TableCell>
                                    <TableCell className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.inCountryFabricationYard}
                                            onChange={(v) => update(record.id, 'inCountryFabricationYard', v)}
                                            placeholder="Yard details"
                                        />
                                    </TableCell>
                                    <TableCell className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.outCountryFabricationYard}
                                            onChange={(v) => update(record.id, 'outCountryFabricationYard', v)}
                                            placeholder="Yard details"
                                        />
                                    </TableCell>
                                    <TableCell className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.uom}
                                            onChange={(v) => update(record.id, 'uom', v)}
                                            placeholder="Tonnage"
                                        />
                                    </TableCell>
                                    <TableCell className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.fabricatedInCountry}
                                            onChange={(v) => update(record.id, 'fabricatedInCountry', v)}
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                        />
                                    </TableCell>
                                    <TableCell className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.fabricatedOutCountry}
                                            onChange={(v) => update(record.id, 'fabricatedOutCountry', v)}
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                        />
                                    </TableCell>
                                    <TableCell className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.ncPercentTonage}
                                            onChange={(v) => update(record.id, 'ncPercentTonage', v)}
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                        />
                                    </TableCell>
                                    <TableCell className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.ncValue}
                                            onChange={(v) => update(record.id, 'ncValue', v)}
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                        />
                                    </TableCell>
                                    <TableCell className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.foreignValue}
                                            onChange={(v) => update(record.id, 'foreignValue', v)}
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                        />
                                    </TableCell>
                                    <TableCell className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.totalValue}
                                            onChange={(v) => update(record.id, 'totalValue', v)}
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                        />
                                    </TableCell>
                                    {/* Auto-calculated NC% spend */}
                                    <TableCell className="text-center font-medium text-primary/80 bg-muted/10 border border-border/40 px-2 py-1">
                                        {ncSpendPct}
                                    </TableCell>
                                    <TableCell className="text-center border border-border/40 px-2 py-1">
                                        <button
                                            onClick={() => removeRecord(record.id)}
                                            disabled={records.length === 1}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-destructive hover:bg-destructive/10 disabled:opacity-20 disabled:cursor-not-allowed"
                                            title="Remove row"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>

                    <TableFooter>
                        <TableRow className="bg-muted/60 font-semibold text-foreground">
                            <TableCell colSpan={8} className="text-left uppercase tracking-wide text-xs px-3 py-2 border border-border/60">
                                Total
                            </TableCell>
                            <TableCell className="text-center border border-border/60 px-2 py-2">
                                {totals.ncValue.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-center border border-border/60 px-2 py-2">
                                {totals.foreignValue.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-center border border-border/60 px-2 py-2">
                                {totals.totalValue.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-center text-primary/80 border border-border/60 px-2 py-2">
                                {totalNCSpend}
                            </TableCell>
                            <TableCell className="border border-border/60" />
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>

            {/* Add Row button (bottom) */}
            <div className="flex">
                <Button
                    onClick={addRecord}
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add another row
                </Button>
            </div>

            {/* Declaration */}
            <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 p-4 rounded-lg">
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                    <span className="font-semibold">Note:</span> All fabrication works must comply with the NOGICD Act 2010 
                    requirements. Priority must be given to Nigerian fabrication yards and local content participation.
                </p>
            </div>
        </div>
    )
}

export default SectionB4
