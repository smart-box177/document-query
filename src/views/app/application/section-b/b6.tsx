import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { useState, useRef } from 'react'
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
import { useApplicationFormStore } from '@/store/application-form.store'

interface ProfessionalServicesRecord {
    id: string
    itemName: string
    inCountryFirm: string
    outCountryFirm: string
    uom: string
    executedInCountry: string
    executedOutCountry: string
    ncPercent: string
    ncValue: string
    foreignValue: string
    totalValue: string
    ncSpendPercent: string
}

const emptyRecord = (): ProfessionalServicesRecord => ({
    id: Date.now().toString(),
    itemName: '',
    inCountryFirm: '',
    outCountryFirm: '',
    uom: '',
    executedInCountry: '',
    executedOutCountry: '',
    ncPercent: '',
    ncValue: '',
    foreignValue: '',
    totalValue: '',
    ncSpendPercent: '',
})

const sumField = (records: ProfessionalServicesRecord[], field: keyof ProfessionalServicesRecord): number => {
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
}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(value)

    const handleBlur = () => {
        setIsEditing(false)
        if (editValue !== value) {
            onChange(editValue)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setIsEditing(false)
            if (editValue !== value) {
                onChange(editValue)
            }
        } else if (e.key === 'Escape') {
            setIsEditing(false)
            setEditValue(value)
        }
    }

    const handleClick = () => {
        if (!isEditing) {
            setIsEditing(true)
            setEditValue(value)
        }
    }

    if (isEditing) {
        return (
            <input
                type={type}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                step={step}
                autoFocus
                className="w-full bg-transparent border-0 outline-none text-sm text-center px-1 py-1 placeholder:text-muted-foreground/40 focus:bg-primary/5 rounded transition-colors text-wrap"
                style={{ minWidth: 0 }}
            />
        )
    }

    return (
        <div
            onClick={handleClick}
            className="w-full text-sm text-center px-1 py-1 cursor-pointer hover:bg-muted/30 rounded transition-colors text-wrap min-h-[1.75rem] flex items-center justify-center"
        >
            {value || <span className="text-muted-foreground/40">{placeholder}</span>}
        </div>
    )
}

const SectionB6 = () => {
    const { formData, updateSectionB } = useApplicationFormStore()
    const [open, setOpen] = useState(false)
    const [newRecord, setNewRecord] = useState<Omit<ProfessionalServicesRecord, 'id'>>(emptyRecord())
    const idCounter = useRef(0)

    // Get existing records from store or initialize with empty
    const records = formData.sectionB?.b6 || []

    const addRecord = () => {
        idCounter.current += 1
        const updatedRecords = [...records, { ...emptyRecord(), id: idCounter.current.toString() }]
        updateSectionB({ b6: updatedRecords })
    }

    const removeRecord = (id: string) => {
        if (records.length > 1) {
            const updatedRecords = records.filter((r) => r.id !== id)
            updateSectionB({ b6: updatedRecords })
        }
    }

    const update = (id: string, field: keyof ProfessionalServicesRecord, value: string) => {
        const updatedRecords = records.map((r) => 
            r.id === id ? { ...r, [field]: value } : r
        )
        updateSectionB({ b6: updatedRecords })
    }

    const handleAddRecord = () => {
        idCounter.current += 1
        const record: ProfessionalServicesRecord = {
            ...newRecord,
            id: idCounter.current.toString()
        }
        const updatedRecords = [...records, record]
        updateSectionB({ b6: updatedRecords })
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
                        B6 – Professional Services
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Legal, Insurance & Financial Services
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
                            <DrawerTitle>Add New Professional Service Record</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4 space-y-6">
                            {/* Item Information */}
                            <div className="space-y-4">
                                <FloatingInput
                                    label="Items (List Services)"
                                    value={newRecord.itemName}
                                    onChange={(e) => setNewRecord({ ...newRecord, itemName: e.target.value })}
                                />
                            </div>

                            {/* Service Provider Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FloatingInput
                                    label="Name & Address of In-Country Firm"
                                    value={newRecord.inCountryFirm}
                                    onChange={(e) => setNewRecord({ ...newRecord, inCountryFirm: e.target.value })}
                                />
                                <FloatingInput
                                    label="Name & Address of Out-Country Firm"
                                    value={newRecord.outCountryFirm}
                                    onChange={(e) => setNewRecord({ ...newRecord, outCountryFirm: e.target.value })}
                                />
                            </div>

                            {/* UoM */}
                            <div className="space-y-4">
                                <FloatingInput
                                    label="UoM (Duration/Lump Sum/Volume, etc.)"
                                    value={newRecord.uom}
                                    onChange={(e) => setNewRecord({ ...newRecord, uom: e.target.value })}
                                    placeholder="e.g., months, USD"
                                />
                            </div>

                            {/* Other Related Services Activity */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FloatingInput
                                    label="% Executed (In-Country)"
                                    type="number"
                                    step="0.01"
                                    value={newRecord.executedInCountry}
                                    onChange={(e) => setNewRecord({ ...newRecord, executedInCountry: e.target.value })}
                                    placeholder="0.00"
                                />
                                <FloatingInput
                                    label="% Executed (Out-Country)"
                                    type="number"
                                    step="0.01"
                                    value={newRecord.executedOutCountry}
                                    onChange={(e) => setNewRecord({ ...newRecord, executedOutCountry: e.target.value })}
                                    placeholder="0.00"
                                />
                                <FloatingInput
                                    label="NC%"
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
                            <TableHead rowSpan={2} className="w-10 text-center border border-border/50 px-2 py-2 font-semibold">
                                S/N
                            </TableHead>
                            {/* Item Name */}
                            <TableHead rowSpan={2} className="w-32 text-center border border-border/50 px-2 py-2 font-semibold whitespace-normal">
                                ITEMS <br />(List Services)
                            </TableHead>
                            {/* Service Provider Details */}
                            <TableHead colSpan={2} className="text-center border border-border/50 px-2 py-2 font-semibold whitespace-normal">
                                SERVICE PROVIDER DETAILS & LOCATION
                            </TableHead>
                            {/* UoM */}
                            <TableHead rowSpan={2} className="w-24 text-center border border-border/50 px-2 py-2 font-semibold whitespace-normal">
                                UoM <br />(Duration/Lump Sum/Volume, etc.)
                            </TableHead>
                            {/* Other Related Services Activity */}
                            <TableHead colSpan={3} className="text-center border border-border/50 px-2 py-2 font-semibold whitespace-normal">
                                OTHER RELATED SERVICES ACTIVITY
                            </TableHead>
                            {/* Value */}
                            <TableHead colSpan={3} className="text-center border border-border/50 px-2 py-2 font-semibold whitespace-normal">
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
                            {/* Service Provider sub-columns */}
                            <TableHead className="text-center border border-border/50 px-2 py-1 font-medium whitespace-normal">
                                NAME & ADDRESS OF IN-COUNTRY FIRM
                            </TableHead>
                            <TableHead className="text-center border border-border/50 px-2 py-1 font-medium whitespace-normal">
                                NAME & ADDRESS OF OUT-COUNTRY FIRM
                            </TableHead>
                            {/* Other related services activity sub-columns */}
                            <TableHead className="text-center border border-border/50 px-2 py-1 font-medium whitespace-normal">
                                % EXECUTED <br />(In-Country)
                            </TableHead>
                            <TableHead className="text-center border border-border/50 px-2 py-1 font-medium whitespace-normal">
                                % EXECUTED <br />(Out-Country)
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
                                            value={record.itemName}
                                            onChange={(v) => update(record.id, 'itemName', v)}
                                            placeholder="Enter service"
                                        />
                                    </TableCell>
                                    <TableCell className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.inCountryFirm}
                                            onChange={(v) => update(record.id, 'inCountryFirm', v)}
                                            placeholder="Firm details"
                                        />
                                    </TableCell>
                                    <TableCell className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.outCountryFirm}
                                            onChange={(v) => update(record.id, 'outCountryFirm', v)}
                                            placeholder="Firm details"
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
                                            value={record.executedInCountry}
                                            onChange={(v) => update(record.id, 'executedInCountry', v)}
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                        />
                                    </TableCell>
                                    <TableCell className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.executedOutCountry}
                                            onChange={(v) => update(record.id, 'executedOutCountry', v)}
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
                    <span className="font-semibold">Note:</span> All professional services must comply with the NOGICD Act 2010 
                    requirements. Priority must be given to Nigerian legal, insurance, and financial service providers.
                </p>
            </div>
        </div>
    )
}

export default SectionB6
