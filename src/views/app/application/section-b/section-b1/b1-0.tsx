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
import { useApplicationFormStore } from '@/store/application-form.store'

interface PersonnelRecord {
    id: string
    jobPosition: string
    companyName: string
    totalPersonnel: string
    nigerianNationality: string
    foreignNationality: string
    inCountryNigerian: string
    inCountryExpat: string
    outCountryNigerian: string
    outCountryExpat: string
    ncManhours: string
    ncSpendValue: string
    foreignSpendValue: string
    totalSpendValue: string
    ncSpendPercent: string
}

const emptyRecord = (): PersonnelRecord => ({
    id: Date.now().toString(),
    jobPosition: '',
    companyName: '',
    totalPersonnel: '',
    nigerianNationality: '',
    foreignNationality: '',
    inCountryNigerian: '',
    inCountryExpat: '',
    outCountryNigerian: '',
    outCountryExpat: '',
    ncManhours: '',
    ncSpendValue: '',
    foreignSpendValue: '',
    totalSpendValue: '',
    ncSpendPercent: '',
})

const calcNC = (nigerian: string, total: string): string => {
    const n = parseFloat(nigerian)
    const t = parseFloat(total)
    if (!isNaN(n) && !isNaN(t) && t > 0) return ((n / t) * 100).toFixed(1) + '%'
    return '—'
}

const sumField = (records: PersonnelRecord[], field: keyof PersonnelRecord): number => {
    return records.reduce((acc, r) => acc + (parseFloat(r[field] as string) || 0), 0)
}

const CellInput = ({
    value,
    onChange,
    type = 'text',
    placeholder = '',
}: {
    value: string
    onChange: (v: string) => void
    type?: string
    placeholder?: string
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

const SectionB10 = () => {
    const { formData, updateSectionB } = useApplicationFormStore()
    const [records, setRecords] = useState<PersonnelRecord[]>(
        formData.sectionB?.b1?.b1_0 ? [formData.sectionB.b1.b1_0] : []
    )
    const [open, setOpen] = useState(false)
    const [newRecord, setNewRecord] = useState<Omit<PersonnelRecord, 'id'>>(emptyRecord())

    // Update store when records change
    const updateRecords = (newRecords: PersonnelRecord[]) => {
        setRecords(newRecords)
        updateSectionB({
            b1: {
                ...formData.sectionB?.b1,
                b1_0: newRecords[0]
            }
        })
    }

    const addRecord = () => updateRecords([...records, emptyRecord()])

    const removeRecord = (id: string) => {
        if (records.length > 1) updateRecords(records.filter((r) => r.id !== id))
    }

    const update = (id: string, field: keyof PersonnelRecord, value: string) => {
        updateRecords(
            records.map((r) => (r.id === id ? { ...r, [field]: value } : r))
        )
    }

    const handleAddRecord = () => {
        const record: PersonnelRecord = {
            ...newRecord,
            id: Date.now().toString()
        }
        updateRecords([...records, record])
        setNewRecord(emptyRecord())
        setOpen(false)
    }

    const totals = {
        totalPersonnel: sumField(records, 'totalPersonnel'),
        nigerianNationality: sumField(records, 'nigerianNationality'),
        foreignNationality: sumField(records, 'foreignNationality'),
        inCountryNigerian: sumField(records, 'inCountryNigerian'),
        inCountryExpat: sumField(records, 'inCountryExpat'),
        outCountryNigerian: sumField(records, 'outCountryNigerian'),
        outCountryExpat: sumField(records, 'outCountryExpat'),
        ncSpendValue: sumField(records, 'ncSpendValue'),
        foreignSpendValue: sumField(records, 'foreignSpendValue'),
        totalSpendValue: sumField(records, 'totalSpendValue'),
    }

    const totalNCManhours = calcNC(
        String(totals.inCountryNigerian + totals.outCountryNigerian),
        String(
            totals.inCountryNigerian +
            totals.inCountryExpat +
            totals.outCountryNigerian +
            totals.outCountryExpat
        )
    )

    const totalNCSpend =
        totals.totalSpendValue > 0
            ? ((totals.ncSpendValue / totals.totalSpendValue) * 100).toFixed(1) + '%'
            : '—'

    return (
        <div className="flex flex-col gap-4 py-2">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                        B1.0 – Personnel
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Project Management, Administration and Services to Company
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
                            <DrawerTitle>Add New Personnel Record</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4 space-y-6">
                             {/* Personnel Information */}
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                 <FloatingInput
                                     label="Job Position"
                                     value={newRecord.jobPosition}
                                     onChange={(e) => setNewRecord({ ...newRecord, jobPosition: e.target.value })}
                                 />
                                 <FloatingInput
                                     label="Name and Address of Company"
                                     value={newRecord.companyName}
                                     onChange={(e) => setNewRecord({ ...newRecord, companyName: e.target.value })}
                                 />
                                 <FloatingInput
                                     label="Total Number of Personnel"
                                     type="number"
                                     value={newRecord.totalPersonnel}
                                     onChange={(e) => setNewRecord({ ...newRecord, totalPersonnel: e.target.value })}
                                 />
                             </div>

                             {/* Nationality */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <FloatingInput
                                     label="Nigerian"
                                     type="number"
                                     value={newRecord.nigerianNationality}
                                     onChange={(e) => setNewRecord({ ...newRecord, nigerianNationality: e.target.value })}
                                 />
                                 <FloatingInput
                                     label="Foreign"
                                     type="number"
                                     value={newRecord.foreignNationality}
                                     onChange={(e) => setNewRecord({ ...newRecord, foreignNationality: e.target.value })}
                                 />
                             </div>

                             {/* Work Scope Domiciliation (Manhours) */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div className="space-y-4">
                                     <h6 className="font-medium text-sm text-muted-foreground">IN-COUNTRY (MANHOURS)</h6>
                                     <FloatingInput
                                         label="Nigerian"
                                         type="number"
                                         value={newRecord.inCountryNigerian}
                                         onChange={(e) => setNewRecord({ ...newRecord, inCountryNigerian: e.target.value })}
                                     />
                                     <FloatingInput
                                         label="Expat"
                                         type="number"
                                         value={newRecord.inCountryExpat}
                                         onChange={(e) => setNewRecord({ ...newRecord, inCountryExpat: e.target.value })}
                                     />
                                 </div>
                                 <div className="space-y-4">
                                     <h6 className="font-medium text-sm text-muted-foreground">OUT-COUNTRY (MANHOURS)</h6>
                                     <FloatingInput
                                         label="Nigerians"
                                         type="number"
                                         value={newRecord.outCountryNigerian}
                                         onChange={(e) => setNewRecord({ ...newRecord, outCountryNigerian: e.target.value })}
                                     />
                                     <FloatingInput
                                         label="Expat"
                                         type="number"
                                         value={newRecord.outCountryExpat}
                                         onChange={(e) => setNewRecord({ ...newRecord, outCountryExpat: e.target.value })}
                                     />
                                 </div>
                             </div>

                             {/* NC% (Manhours) */}
                             <div className="space-y-4">
                                 <FloatingInput
                                     label="NC% (manhours)"
                                     type="number"
                                     step="0.01"
                                     value={newRecord.ncManhours}
                                     onChange={(e) => setNewRecord({ ...newRecord, ncManhours: e.target.value })}
                                 />
                             </div>

                              {/* FUSD */}
                              <div className="space-y-4">
                                  <h6 className="font-medium text-sm text-muted-foreground">FUSD</h6>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <FloatingInput
                                          label="NC Spend Value (FUSD)"
                                          type="number"
                                          step="0.01"
                                          value={newRecord.ncSpendValue}
                                          onChange={(e) => setNewRecord({ ...newRecord, ncSpendValue: e.target.value })}
                                      />
                                      <FloatingInput
                                          label="Foreign Spend Value (FUSD)"
                                          type="number"
                                          step="0.01"
                                          value={newRecord.foreignSpendValue}
                                          onChange={(e) => setNewRecord({ ...newRecord, foreignSpendValue: e.target.value })}
                                      />
                                      <FloatingInput
                                          label="Total Spend Value (FUSD)"
                                          type="number"
                                          step="0.01"
                                          value={newRecord.totalSpendValue}
                                          onChange={(e) => setNewRecord({ ...newRecord, totalSpendValue: e.target.value })}
                                      />
                                  </div>
                              </div>

                             {/* NC% (Spend) */}
                             <div className="space-y-4">
                                 <FloatingInput
                                     label="NC% (spend)"
                                     type="number"
                                     step="0.01"
                                     value={newRecord.ncSpendPercent}
                                     onChange={(e) => setNewRecord({ ...newRecord, ncSpendPercent: e.target.value })}
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
                <table className="w-full text-xs border-collapse" style={{ minWidth: 1100 }}>
                    <thead>
                        <tr className="bg-muted/60 text-muted-foreground">
                            {/* S/N */}
                            <th
                                rowSpan={3}
                                className="border border-border/50 px-2 py-2 text-center font-semibold w-10"
                            >
                                S/N
                            </th>
                            {/* Job Position */}
                            <th
                                rowSpan={3}
                                className="border border-border/50 px-2 py-2 text-center font-semibold w-28"
                            >
                                Job Position
                            </th>
                            {/* Company */}
                            <th
                                rowSpan={3}
                                className="border border-border/50 px-2 py-2 text-center font-semibold w-36 whitespace-normal"
                            >
                                Name & Address of Company Providing Each Job Position
                            </th>
                            {/* Total Personnel */}
                            <th
                                rowSpan={3}
                                className="border border-border/50 px-2 py-2 text-center font-semibold w-20"
                            >
                                Total No. of Personnel
                            </th>
                            {/* Nationality */}
                            <th
                                colSpan={2}
                                className="border border-border/50 px-2 py-2 text-center font-semibold whitespace-normal"
                            >
                                Nationality of Personnel (State in Figures)
                            </th>
                            {/* Work Scope */}
                            <th
                                colSpan={4}
                                className="border border-border/50 px-2 py-2 text-center font-semibold whitespace-normal"
                            >
                                Work Scope Domiciliation (Manhours)
                            </th>
                            {/* NC% */}
                            <th
                                rowSpan={3}
                                className="border border-border/50 px-2 py-2 text-center font-semibold w-20"
                            >
                                NC% (Manhours)
                            </th>
                            {/* FUSD columns */}
                            <th
                                colSpan={3}
                                className="border border-border/50 px-2 py-2 text-center font-semibold whitespace-normal"
                            >
                                FUSD
                            </th>
                            {/* NC% spend */}
                            <th
                                rowSpan={3}
                                className="border border-border/50 px-2 py-2 text-center font-semibold w-20"
                            >
                                NC% (Spend)
                            </th>
                        </tr>

                        <tr className="bg-muted/40 text-muted-foreground">
                            {/* Nationality sub */}
                            <th className="border border-border/50 px-2 py-1 text-center font-medium" rowSpan={2}>Nigerian</th>
                            <th className="border border-border/50 px-2 py-1 text-center font-medium" rowSpan={2}>Foreign</th>
                            {/* Work scope sub */}
                            <th colSpan={2} className="border border-border/50 px-2 py-1 text-center font-medium whitespace-normal">
                                In-Country (Manhours)
                            </th>
                            <th colSpan={2} className="border border-border/50 px-2 py-1 text-center font-medium whitespace-normal">
                                Out-Country (Manhours)
                            </th>
                            {/* FUSD sub */}
                            <th className="border border-border/50 px-2 py-1 text-center font-medium" rowSpan={2}>NC Spend Value</th>
                            <th className="border border-border/50 px-2 py-1 text-center font-medium" rowSpan={2}>Foreign Spend Value</th>
                            <th className="border border-border/50 px-2 py-1 text-center font-medium" rowSpan={2}>Total Spend Value</th>
                        </tr>

                        <tr className="bg-muted/30 text-muted-foreground">
                            <th className="border border-border/50 px-2 py-1 text-center font-medium">Nigerian</th>
                            <th className="border border-border/50 px-2 py-1 text-center font-medium">Expat</th>
                            <th className="border border-border/50 px-2 py-1 text-center font-medium">Nigerians</th>
                            <th className="border border-border/50 px-2 py-1 text-center font-medium">Expat</th>
                        </tr>
                    </thead>

                    <tbody>
                        {records.map((record, index) => {
                            const ncManhours = calcNC(
                                String(
                                    (parseFloat(record.inCountryNigerian) || 0) +
                                    (parseFloat(record.outCountryNigerian) || 0)
                                ),
                                String(
                                    (parseFloat(record.inCountryNigerian) || 0) +
                                    (parseFloat(record.inCountryExpat) || 0) +
                                    (parseFloat(record.outCountryNigerian) || 0) +
                                    (parseFloat(record.outCountryExpat) || 0)
                                )
                            )
                            const total = parseFloat(record.totalSpendValue) || 0
                            const ncVal = parseFloat(record.ncSpendValue) || 0
                            const ncSpendPct =
                                total > 0 ? ((ncVal / total) * 100).toFixed(1) + '%' : '—'

                            return (
                                <tr
                                    key={record.id}
                                    className="hover:bg-muted/20 transition-colors group"
                                >
                                    <td className="border border-border/40 px-2 py-1 text-center text-muted-foreground">
                                        {index + 1}
                                    </td>
                                    <td className="border border-border/40 px-1 py-0.5 text-wrap">
                                        <CellInput
                                            value={record.jobPosition}
                                            onChange={(v) => update(record.id, 'jobPosition', v)}
                                            placeholder="Enter position"
                                        />
                                    </td>
                                    <td className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.companyName}
                                            onChange={(v) => update(record.id, 'companyName', v)}
                                            placeholder="Company name & address"
                                        />
                                    </td>
                                    <td className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.totalPersonnel}
                                            onChange={(v) => update(record.id, 'totalPersonnel', v)}
                                            type="number"
                                            placeholder="0"
                                        />
                                    </td>
                                    <td className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.nigerianNationality}
                                            onChange={(v) => update(record.id, 'nigerianNationality', v)}
                                            type="number"
                                            placeholder="0"
                                        />
                                    </td>
                                    <td className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.foreignNationality}
                                            onChange={(v) => update(record.id, 'foreignNationality', v)}
                                            type="number"
                                            placeholder="0"
                                        />
                                    </td>
                                    <td className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.inCountryNigerian}
                                            onChange={(v) => update(record.id, 'inCountryNigerian', v)}
                                            type="number"
                                            placeholder="0"
                                        />
                                    </td>
                                    <td className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.inCountryExpat}
                                            onChange={(v) => update(record.id, 'inCountryExpat', v)}
                                            type="number"
                                            placeholder="0"
                                        />
                                    </td>
                                    <td className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.outCountryNigerian}
                                            onChange={(v) => update(record.id, 'outCountryNigerian', v)}
                                            type="number"
                                            placeholder="0"
                                        />
                                    </td>
                                    <td className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.outCountryExpat}
                                            onChange={(v) => update(record.id, 'outCountryExpat', v)}
                                            type="number"
                                            placeholder="0"
                                        />
                                    </td>
                                    {/* Auto-calculated NC% manhours */}
                                    <td className="border border-border/40 px-2 py-1 text-center font-medium text-primary/80 bg-muted/10">
                                        {ncManhours}
                                    </td>
                                    <td className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.ncSpendValue}
                                            onChange={(v) => update(record.id, 'ncSpendValue', v)}
                                            type="number"
                                            placeholder="0.00"
                                        />
                                    </td>
                                    <td className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.foreignSpendValue}
                                            onChange={(v) => update(record.id, 'foreignSpendValue', v)}
                                            type="number"
                                            placeholder="0.00"
                                        />
                                    </td>
                                    <td className="border border-border/40 px-1 py-0.5">
                                        <CellInput
                                            value={record.totalSpendValue}
                                            onChange={(v) => update(record.id, 'totalSpendValue', v)}
                                            type="number"
                                            placeholder="0.00"
                                        />
                                    </td>
                                    {/* Auto-calculated NC% spend */}
                                    <td className="border border-border/40 px-2 py-1 text-center font-medium text-primary/80 bg-muted/10">
                                        {ncSpendPct}
                                    </td>
                                    <td className="border border-border/40 px-2 py-1 text-center">
                                        <button
                                            onClick={() => removeRecord(record.id)}
                                            disabled={records.length === 1}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-destructive hover:bg-destructive/10 disabled:opacity-20 disabled:cursor-not-allowed"
                                            title="Remove row"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>

                    {/* Totals row */}
                    <tfoot>
                        <tr className="bg-muted/60 font-semibold text-foreground">
                            <td
                                colSpan={3}
                                className="border border-border/60 px-3 py-2 text-left uppercase tracking-wide text-xs"
                            >
                                Total
                            </td>
                            <td className="border border-border/60 px-2 py-2 text-center">
                                {totals.totalPersonnel || 0}
                            </td>
                            <td className="border border-border/60 px-2 py-2 text-center">
                                {totals.nigerianNationality || 0}
                            </td>
                            <td className="border border-border/60 px-2 py-2 text-center">
                                {totals.foreignNationality || 0}
                            </td>
                            <td className="border border-border/60 px-2 py-2 text-center">
                                {totals.inCountryNigerian || 0}
                            </td>
                            <td className="border border-border/60 px-2 py-2 text-center">
                                {totals.inCountryExpat || 0}
                            </td>
                            <td className="border border-border/60 px-2 py-2 text-center">
                                {totals.outCountryNigerian || 0}
                            </td>
                            <td className="border border-border/60 px-2 py-2 text-center">
                                {totals.outCountryExpat || 0}
                            </td>
                            <td className="border border-border/60 px-2 py-2 text-center text-primary/80">
                                {totalNCManhours}
                            </td>
                            <td className="border border-border/60 px-2 py-2 text-center">
                                {totals.ncSpendValue.toFixed(2)}
                            </td>
                            <td className="border border-border/60 px-2 py-2 text-center">
                                {totals.foreignSpendValue.toFixed(2)}
                            </td>
                            <td className="border border-border/60 px-2 py-2 text-center">
                                {totals.totalSpendValue.toFixed(2)}
                            </td>
                            <td className="border border-border/60 px-2 py-2 text-center text-primary/80">
                                {totalNCSpend}
                            </td>
                            <td className="border border-border/60" />
                        </tr>
                    </tfoot>
                </table>
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
                    <span className="font-semibold">Note:</span> No expatriate shall be deployed in this
                    project without obtaining expatriate quota from the Board consistent with sections 31
                    and 33 of the NOGICD Act 2010 on expatriate quota applications and approval.
                </p>
            </div>
        </div>
    )
}

export default SectionB10
