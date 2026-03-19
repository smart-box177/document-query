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

interface ProcurementRecord {
    id: string
    procurementItem: string
    manufacturedInCountry: string
    inCountryVendor: string
    outCountryVendor: string
    uom: string
    procuredInCountry: string
    procuredOutCountry: string
    ncPercent: string
    ncValue: string
    foreignValue: string
    totalValue: string
    ncSpendPercent: string
}

const emptyRecord = (): ProcurementRecord => ({
    id: Date.now().toString(),
    procurementItem: '',
    manufacturedInCountry: '',
    inCountryVendor: '',
    outCountryVendor: '',
    uom: '',
    procuredInCountry: '',
    procuredOutCountry: '',
    ncPercent: '',
    ncValue: '',
    foreignValue: '',
    totalValue: '',
    ncSpendPercent: '',
})



const sumField = (records: ProcurementRecord[], field: keyof ProcurementRecord): number => {
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

const SectionB2 = () => {
    const [records, setRecords] = useState<ProcurementRecord[]>([])
    const [open, setOpen] = useState(false)
    const [newRecord, setNewRecord] = useState<Omit<ProcurementRecord, 'id'>>(emptyRecord())

    const addRecord = () => setRecords((prev) => [...prev, emptyRecord()])

    const removeRecord = (id: string) => {
        if (records.length > 1) setRecords((prev) => prev.filter((r) => r.id !== id))
    }

    const update = (id: string, field: keyof ProcurementRecord, value: string) => {
        setRecords((prev) =>
            prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
        )
    }

    const handleAddRecord = () => {
        const record: ProcurementRecord = {
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
                        B2 – Procurement
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Procurement of Contractor Items, Materials and Equipment
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
                            <DrawerTitle>Add New Procurement Record</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4 space-y-6">
                            {/* Procurement Information */}
                            <div className="space-y-4">
                                <FloatingInput
                                    label="Procurement Items (List of Procurement Items)"
                                    value={newRecord.procurementItem}
                                    onChange={(e) => setNewRecord({ ...newRecord, procurementItem: e.target.value })}
                                />
                            </div>

                            {/* Manufactured In Country */}
                            <div className="space-y-4">
                                <FloatingInput
                                    label="Manufactured In-Country (YES OR NO)"
                                    value={newRecord.manufacturedInCountry}
                                    onChange={(e) => setNewRecord({ ...newRecord, manufacturedInCountry: e.target.value })}
                                    placeholder="YES or NO"
                                />
                            </div>

                            {/* Vendor Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FloatingInput
                                    label="Name & Address of In-Country Vendor"
                                    value={newRecord.inCountryVendor}
                                    onChange={(e) => setNewRecord({ ...newRecord, inCountryVendor: e.target.value })}
                                />
                                <FloatingInput
                                    label="Name & Address of Out-Country Manufacturer/OEM"
                                    value={newRecord.outCountryVendor}
                                    onChange={(e) => setNewRecord({ ...newRecord, outCountryVendor: e.target.value })}
                                />
                            </div>

                            {/* Unit of Measure */}
                            <div className="space-y-4">
                                <FloatingInput
                                    label="UoM (Tones/Numbers of Items/Length, etc.)"
                                    value={newRecord.uom}
                                    onChange={(e) => setNewRecord({ ...newRecord, uom: e.target.value })}
                                    placeholder="e.g., kg, pcs, liters"
                                />
                            </div>

                            {/* Procurement Domiciliation */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FloatingInput
                                    label="% Procured (In-Country)"
                                    type="number"
                                    step="0.01"
                                    value={newRecord.procuredInCountry}
                                    onChange={(e) => setNewRecord({ ...newRecord, procuredInCountry: e.target.value })}
                                    placeholder="0.00"
                                />
                                <FloatingInput
                                    label="% Procured (Out-Country)"
                                    type="number"
                                    step="0.01"
                                    value={newRecord.procuredOutCountry}
                                    onChange={(e) => setNewRecord({ ...newRecord, procuredOutCountry: e.target.value })}
                                    placeholder="0.00"
                                />
                                <FloatingInput
                                    label="NC %"
                                    type="number"
                                    step="0.01"
                                    value={newRecord.ncPercent}
                                    onChange={(e) => setNewRecord({ ...newRecord, ncPercent: e.target.value })}
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
                            <TableHead rowSpan={3} className="w-10 text-center border border-border/50 px-2 py-2 font-semibold">
                                S/N
                            </TableHead>
                            {/* Procurement Items */}
                            <TableHead rowSpan={3} className="w-32 text-center border border-border/50 px-2 py-2 font-semibold">
                                PROCUREMENT ITEMS <br />(List of Procurement Items)
                            </TableHead>
                            {/* Manufactured In Country */}
                            <TableHead rowSpan={3} className="w-24 text-center border border-border/50 px-2 py-2 font-semibold">
                                MANUFACTURED IN-COUNTRY <br />(YES OR NO)
                            </TableHead>
                            {/* Vendor Details */}
                            <TableHead colSpan={2} className="text-center border border-border/50 px-2 py-2 font-semibold">
                                VENDOR DETAILS & LOCATION
                            </TableHead>
                            {/* UoM */}
                            <TableHead rowSpan={3} className="w-20 text-center border border-border/50 px-2 py-2 font-semibold">
                                UoM <br />(Tonnes/Numbers of Items/Length, etc.)
                            </TableHead>
                            {/* Procurement Domiciliation */}
                            <TableHead colSpan={3} className="text-center border border-border/50 px-2 py-2 font-semibold">
                                PROCUREMENT DOMICILIATION
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
                                NAME & ADDRESS OF IN-COUNTRY VENDOR
                            </TableHead>
                            <TableHead className="text-center border border-border/50 px-2 py-1 font-medium">
                                NAME & ADDRESS OF OUT-COUNTRY MANUFACTURER/OEM
                            </TableHead>
                            {/* Procurement domiciliation sub-columns */}
                            <TableHead className="text-center border border-border/50 px-2 py-1 font-medium">
                                % Procured <br />(In-Country)
                            </TableHead>
                            <TableHead className="text-center border border-border/50 px-2 py-1 font-medium">
                                % Procured <br />(Out-Country)
                            </TableHead>
                            <TableHead className="text-center border border-border/50 px-2 py-1 font-medium">
                                NC%
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
                                            value={record.procurementItem}
                                            onChange={(v) => update(record.id, 'procurementItem', v)}
                                            placeholder="Enter item"
                                        />
                                    </TableCell>
                                    <TableCell className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.manufacturedInCountry}
                                            onChange={(v) => update(record.id, 'manufacturedInCountry', v)}
                                            placeholder="YES or NO"
                                        />
                                    </TableCell>
                                    <TableCell className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.inCountryVendor}
                                            onChange={(v) => update(record.id, 'inCountryVendor', v)}
                                            placeholder="Vendor details"
                                        />
                                    </TableCell>
                                    <TableCell className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.outCountryVendor}
                                            onChange={(v) => update(record.id, 'outCountryVendor', v)}
                                            placeholder="Manufacturer details"
                                        />
                                    </TableCell>
                                    <TableCell className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.uom}
                                            onChange={(v) => update(record.id, 'uom', v)}
                                            placeholder="Unit"
                                        />
                                    </TableCell>
                                    <TableCell className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.procuredInCountry}
                                            onChange={(v) => update(record.id, 'procuredInCountry', v)}
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                        />
                                    </TableCell>
                                    <TableCell className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.procuredOutCountry}
                                            onChange={(v) => update(record.id, 'procuredOutCountry', v)}
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                        />
                                    </TableCell>
                                    <TableCell className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.ncPercent}
                                            onChange={(v) => update(record.id, 'ncPercent', v)}
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
                            <TableCell colSpan={9} className="text-left uppercase tracking-wide text-xs px-3 py-2 border border-border/60">
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
                    <span className="font-semibold">Note:</span> All procurement must comply with the NOGICD Act 2010 
                    Section 27 on preferential local content. Evidence of local sourcing attempts must be documented 
                    and Nigerian content requirements must be met.
                </p>
            </div>
        </div>
    )
}

export default SectionB2
