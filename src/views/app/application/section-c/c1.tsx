import { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'

interface HCDTrainingRecord {
    id: string
    trainingScope: string
    hcdPercentage: string
}

const emptyRecord = (): HCDTrainingRecord => ({
    id: Date.now().toString(),
    trainingScope: 'Training scope/ Certification, Training Provider(s) and Total number of Trainees will be agreed upon when the subject Training Plan is submitted to the Board for review and approval',
    hcdPercentage: '3',
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

const SectionC1 = () => {
    const [records, setRecords] = useState<HCDTrainingRecord[]>([emptyRecord()])

    const update = (id: string, field: keyof HCDTrainingRecord, value: string) => {
        setRecords((prev) =>
            prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
        )
    }

    return (
        <div className="flex flex-col gap-4 py-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                        C1 – HCD Training
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Human Capacity Development Training
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-border/60 shadow-sm">
                <Table className="text-xs" style={{ minWidth: 800 }}>
                    <TableHeader>
                        <TableRow className="bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-300">
                            <TableHead className="text-left border border-border/50 px-2 py-2 font-semibold">
                                TRAINING SCOPE / CERTIFICATION, TRAINING PROVIDER(S) AND TOTAL NUMBER OF TRAINEES
                            </TableHead>
                            <TableHead className="text-center border border-border/50 px-2 py-2 font-semibold">
                                HCD <br />(Input the applicable HCD% in the row below, in line with the NCDMB HCD Guideline)
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {records.map((record) => (
                            <TableRow key={record.id} className="hover:bg-muted/20 transition-colors group">
                                <TableCell className="border border-border/40 px-1 py-0.5">
                                    <CellInput
                                        value={record.trainingScope}
                                        onChange={(v) => update(record.id, 'trainingScope', v)}
                                        placeholder="Enter training scope"
                                    />
                                </TableCell>
                                <TableCell className="border border-border/40 px-1 py-0.5">
                                    <CellInput
                                        value={record.hcdPercentage}
                                        onChange={(v) => update(record.id, 'hcdPercentage', v)}
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                    <span className="text-xs text-muted-foreground ml-1">%</span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Declaration */}
            <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 p-4 rounded-lg">
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                    <span className="font-semibold">Note:</span> Human Capacity Development (HCD) training must comply with 
                    the NCDMB HCD Guidelines. The training plan must be submitted to the Board for review and approval.
                </p>
            </div>
        </div>
    )
}

export default SectionC1
