import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { FloatingInput } from "@/components/ui/floating-input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ResearchDevelopmentRecord {
  id: string;
  typeOfResearch: string;
  projectLocation: string;
  activityDuration: string;
  numberOfResearcher: string;
  typeOfResearcher: string;
  briefScopeOfWork: string;
  costOfActivity: string;
}

const emptyRecord = (): ResearchDevelopmentRecord => ({
  id: Date.now().toString(),
  typeOfResearch: "",
  projectLocation: "",
  activityDuration: "",
  numberOfResearcher: "",
  typeOfResearcher: "",
  briefScopeOfWork: "",
  costOfActivity: "",
});

const sumField = (
  records: ResearchDevelopmentRecord[],
  field: keyof ResearchDevelopmentRecord
): number => {
  return records.reduce(
    (acc, r) => acc + (parseFloat(r[field] as string) || 0),
    0
  );
};

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

const SectionC3 = () => {
  const [records, setRecords] = useState<ResearchDevelopmentRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<
    Omit<ResearchDevelopmentRecord, "id">
  >(emptyRecord());

  const addRecord = () => setRecords((prev) => [...prev, emptyRecord()]);

  const removeRecord = (id: string) => {
    if (records.length > 1)
      setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const update = (
    id: string,
    field: keyof ResearchDevelopmentRecord,
    value: string
  ) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleAddRecord = () => {
    const record: ResearchDevelopmentRecord = {
      ...newRecord,
      id: Date.now().toString(),
    };
    setRecords([...records, record]);
    setNewRecord(emptyRecord());
    setOpen(false);
  };

  const totals = {
    costOfActivity: sumField(records, "costOfActivity"),
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground">
            C3 – R & D (If Applicable)
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Research and Development - If Applicable
          </p>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Row
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New R&D Activity</SheetTitle>
            </SheetHeader>
            <div className="p-4 space-y-6">
              {/* Type of Research */}
              <div className="space-y-4">
                <FloatingInput
                  label="Type of Research"
                  value={newRecord.typeOfResearch}
                  onChange={(e) =>
                    setNewRecord({
                      ...newRecord,
                      typeOfResearch: e.target.value,
                    })
                  }
                  placeholder="Enter type of research"
                />
              </div>

              {/* Project Location */}
              <div className="space-y-4">
                <FloatingInput
                  label="Project Activity Location"
                  value={newRecord.projectLocation}
                  onChange={(e) =>
                    setNewRecord({
                      ...newRecord,
                      projectLocation: e.target.value,
                    })
                  }
                  placeholder="Enter location"
                />
              </div>

              {/* Activity Duration */}
              <div className="space-y-4">
                <FloatingInput
                  label="Activity Duration (Weeks/Months/Years)"
                  value={newRecord.activityDuration}
                  onChange={(e) =>
                    setNewRecord({
                      ...newRecord,
                      activityDuration: e.target.value,
                    })
                  }
                  placeholder="e.g., 6 months"
                />
              </div>

              {/* Number of Researchers */}
              <div className="space-y-4">
                <FloatingInput
                  label="Number of Researchers"
                  type="number"
                  value={newRecord.numberOfResearcher}
                  onChange={(e) =>
                    setNewRecord({
                      ...newRecord,
                      numberOfResearcher: e.target.value,
                    })
                  }
                  placeholder="0"
                />
              </div>

              {/* Type of Researcher */}
              <div className="space-y-4">
                <FloatingInput
                  label="Type of Researcher"
                  value={newRecord.typeOfResearcher}
                  onChange={(e) =>
                    setNewRecord({
                      ...newRecord,
                      typeOfResearcher: e.target.value,
                    })
                  }
                  placeholder="Enter type of researcher"
                />
              </div>

              {/* Brief Scope of Work */}
              <div className="space-y-4">
                <FloatingInput
                  label="Brief Scope of Work"
                  value={newRecord.briefScopeOfWork}
                  onChange={(e) =>
                    setNewRecord({
                      ...newRecord,
                      briefScopeOfWork: e.target.value,
                    })
                  }
                  placeholder="Enter scope of work"
                />
              </div>

              {/* Cost of Activity */}
              <div className="space-y-4">
                <FloatingInput
                  label="Cost of Activity"
                  type="number"
                  step="0.01"
                  value={newRecord.costOfActivity}
                  onChange={(e) =>
                    setNewRecord({
                      ...newRecord,
                      costOfActivity: e.target.value,
                    })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button onClick={handleAddRecord}>Add Record</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border/60 shadow-sm">
        <Table className="text-xs" style={{ minWidth: 1000 }}>
          <TableHeader>
            <TableRow className="bg-muted/60 text-muted-foreground">
              {/* S/N */}
              <TableHead className="w-10 text-center border border-border/50 px-2 py-2 font-semibold">
                S/N
              </TableHead>
              {/* Type of Research */}
              <TableHead className="w-32 text-center border border-border/50 px-2 py-2 font-semibold">
                TYPE OF RESEARCH
              </TableHead>
              {/* Project Location */}
              <TableHead className="w-32 text-center border border-border/50 px-2 py-2 font-semibold">
                PROJECT ACTIVITY LOCATION
              </TableHead>
              {/* Activity Duration */}
              <TableHead
                className="
                    text-center border border-border/50 px-2 font-semibold
                    whitespace-normal wrap-break-word leading-tight py-3
                  "
              >
                ACTIVITY DURATION (WEEKS/MONTHS/YEARS)
              </TableHead>
              {/* Number of Researchers */}
              <TableHead className="w-20 text-center border border-border/50 px-2 py-2 font-semibold">
                NUMBER OF RESEARCHERS
              </TableHead>
              {/* Type of Researcher */}
              <TableHead className="w-24 text-center border border-border/50 px-2 py-2 font-semibold">
                TYPE OF RESEARCHER
              </TableHead>
              {/* Brief Scope of Work */}
              <TableHead className="w-32 text-center border border-border/50 px-2 py-2 font-semibold">
                BRIEF SCOPE OF WORK
              </TableHead>
              {/* Cost of Activity */}
              <TableHead className="w-20 text-center border border-border/50 px-2 py-2 font-semibold">
                COST OF ACTIVITY
              </TableHead>
              {/* Actions */}
              <TableHead className="w-10 text-center border border-border/50 px-2 py-2 font-semibold">
                &nbsp;
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {records.map((record, index) => (
              <TableRow
                key={record.id}
                className="hover:bg-muted/20 transition-colors group"
              >
                <TableCell className="text-center text-muted-foreground border border-border/40 px-2 py-1">
                  {index + 1}
                </TableCell>
                <TableCell className="border border-border/40 px-1 py-0.5">
                  <CellInput
                    value={record.typeOfResearch}
                    onChange={(v) => update(record.id, "typeOfResearch", v)}
                    placeholder="Enter type of research"
                  />
                </TableCell>
                <TableCell className="border border-border/40 px-1 py-0.5">
                  <CellInput
                    value={record.projectLocation}
                    onChange={(v) => update(record.id, "projectLocation", v)}
                    placeholder="Enter location"
                  />
                </TableCell>
                <TableCell className="border border-border/40 px-1 py-0.5">
                  <CellInput
                    value={record.activityDuration}
                    onChange={(v) => update(record.id, "activityDuration", v)}
                    placeholder="e.g., 6 months"
                  />
                </TableCell>
                <TableCell className="border border-border/40 px-1 py-0.5">
                  <CellInput
                    value={record.numberOfResearcher}
                    onChange={(v) => update(record.id, "numberOfResearcher", v)}
                    type="number"
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="border border-border/40 px-1 py-0.5">
                  <CellInput
                    value={record.typeOfResearcher}
                    onChange={(v) => update(record.id, "typeOfResearcher", v)}
                    placeholder="Enter type of researcher"
                  />
                </TableCell>
                <TableCell className="border border-border/40 px-1 py-0.5">
                  <CellInput
                    value={record.briefScopeOfWork}
                    onChange={(v) => update(record.id, "briefScopeOfWork", v)}
                    placeholder="Enter scope of work"
                  />
                </TableCell>
                <TableCell className="border border-border/40 px-1 py-0.5">
                  <CellInput
                    value={record.costOfActivity}
                    onChange={(v) => update(record.id, "costOfActivity", v)}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                  />
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
            ))}
          </TableBody>

          <TableFooter>
            <TableRow className="bg-muted/60 font-semibold text-foreground">
              <TableCell
                colSpan={7}
                className="text-left uppercase tracking-wide text-xs px-3 py-2 border border-border/60"
              >
                Total Cost
              </TableCell>
              <TableCell className="text-center border border-border/60 px-2 py-2">
                ${totals.costOfActivity.toFixed(2)}
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
          <span className="font-semibold">Note:</span> Research and Development
          activities must be aligned with the requirements of the NOGICD Act
          2010 and NCDMB guidelines for local content development.
        </p>
      </div>
    </div>
  );
};

export default SectionC3;
