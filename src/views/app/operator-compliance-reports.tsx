import { useState, useMemo } from "react";
import {
  BarChart3,
  Building2,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─── Types ────────────────────────────────────────────────────────────────────

type ComplianceStatus = "compliant" | "non-compliant" | "pending" | "partial";
type SortKey = "operator" | "submitted" | "approved" | "rejected" | "pending" | "rate";
type SortDir = "asc" | "desc";

interface OperatorReport {
  operator: string;
  submitted: number;
  approved: number;
  rejected: number;
  pending: number;
  revisionRequested: number;
  complianceRate: number; // percentage 0–100
  status: ComplianceStatus;
  trend: "up" | "down" | "stable";
}

// ─── Mock data (replace with API call when endpoint is ready) ─────────────────

const MOCK_REPORTS: OperatorReport[] = [
  {
    operator: "SEPLAT Energy",
    submitted: 34,
    approved: 28,
    rejected: 3,
    pending: 3,
    revisionRequested: 0,
    complianceRate: 82,
    status: "compliant",
    trend: "up",
  },
  {
    operator: "NNPC Limited",
    submitted: 58,
    approved: 41,
    rejected: 8,
    pending: 9,
    revisionRequested: 0,
    complianceRate: 71,
    status: "partial",
    trend: "stable",
  },
  {
    operator: "Shell SPDC",
    submitted: 22,
    approved: 10,
    rejected: 9,
    pending: 3,
    revisionRequested: 0,
    complianceRate: 45,
    status: "non-compliant",
    trend: "down",
  },
  {
    operator: "TotalEnergies EP",
    submitted: 47,
    approved: 43,
    rejected: 2,
    pending: 2,
    revisionRequested: 0,
    complianceRate: 91,
    status: "compliant",
    trend: "up",
  },
  {
    operator: "Chevron Nigeria",
    submitted: 19,
    approved: 14,
    rejected: 1,
    pending: 4,
    revisionRequested: 0,
    complianceRate: 74,
    status: "partial",
    trend: "up",
  },
  {
    operator: "ExxonMobil Nigeria",
    submitted: 31,
    approved: 6,
    rejected: 14,
    pending: 11,
    revisionRequested: 0,
    complianceRate: 19,
    status: "non-compliant",
    trend: "down",
  },
  {
    operator: "Oando PLC",
    submitted: 12,
    approved: 12,
    rejected: 0,
    pending: 0,
    revisionRequested: 0,
    complianceRate: 100,
    status: "compliant",
    trend: "stable",
  },
  {
    operator: "Aiteo Eastern E&P",
    submitted: 8,
    approved: 3,
    rejected: 0,
    pending: 5,
    revisionRequested: 0,
    complianceRate: 38,
    status: "pending",
    trend: "stable",
  },
];

const YEARS = ["2026", "2025", "2024", "2023", "2022"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusConfig: Record<
  ComplianceStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }
> = {
  compliant: { label: "Compliant", variant: "default", icon: CheckCircle2 },
  "non-compliant": { label: "Non-Compliant", variant: "destructive", icon: XCircle },
  pending: { label: "Pending", variant: "secondary", icon: Clock },
  partial: { label: "Partial", variant: "outline", icon: AlertCircle },
};

const TrendIcon = ({ trend }: { trend: OperatorReport["trend"] }) => {
  if (trend === "up") return <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5 text-destructive" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
};

const SortIcon = ({
  column,
  active,
  dir,
}: {
  column: SortKey;
  active: SortKey;
  dir: SortDir;
}) => {
  if (column !== active) return <ChevronsUpDown className="h-3 w-3 opacity-40" />;
  return dir === "asc" ? (
    <ChevronUp className="h-3 w-3" />
  ) : (
    <ChevronDown className="h-3 w-3" />
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const OperatorComplianceReports = () => {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("2025");
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("rate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const reports = MOCK_REPORTS; // swap for API data

  // ── Summary stats ────────────────────────────────────────────────────────
  const summary = useMemo(() => {
    const total = reports.reduce((s, r) => s + r.submitted, 0);
    const approved = reports.reduce((s, r) => s + r.approved, 0);
    const rejected = reports.reduce((s, r) => s + r.rejected, 0);
    const pending = reports.reduce((s, r) => s + r.pending, 0);
    const avgRate =
      reports.length > 0
        ? Math.round(reports.reduce((s, r) => s + r.complianceRate, 0) / reports.length)
        : 0;
    return { total, approved, rejected, pending, avgRate };
  }, [reports]);

  // ── Filter + sort ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let rows = reports.filter((r) => {
      const matchesSearch = r.operator
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    rows = [...rows].sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;
      switch (sortKey) {
        case "operator":
          aVal = a.operator;
          bVal = b.operator;
          break;
        case "submitted":
          aVal = a.submitted;
          bVal = b.submitted;
          break;
        case "approved":
          aVal = a.approved;
          bVal = b.approved;
          break;
        case "rejected":
          aVal = a.rejected;
          bVal = b.rejected;
          break;
        case "pending":
          aVal = a.pending;
          bVal = b.pending;
          break;
        default:
          aVal = a.complianceRate;
          bVal = b.complianceRate;
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return rows;
  }, [reports, search, statusFilter, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortableHead = ({
    col,
    label,
    className,
  }: {
    col: SortKey;
    label: string;
    className?: string;
  }) => (
    <TableHead
      className={`cursor-pointer select-none whitespace-nowrap ${className ?? ""}`}
      onClick={() => handleSort(col)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <SortIcon column={col} active={sortKey} dir={sortDir} />
      </span>
    </TableHead>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Operator Compliance Reports</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            NCCC application compliance by operator · {year}
          </p>
        </div>
        <Button variant="outline" size="sm" disabled>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* ── Summary cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Total Submitted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">{summary.total}</span>
              <FileText className="h-5 w-5 text-blue-500 mb-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-emerald-500">
                {summary.approved}
              </span>
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mb-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-destructive">
                {summary.rejected}
              </span>
              <XCircle className="h-5 w-5 text-destructive mb-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Avg. Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">{summary.avgRate}%</span>
              <BarChart3 className="h-5 w-5 text-purple-500 mb-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search operator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as ComplianceStatus | "all")}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="compliant">Compliant</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="non-compliant">Non-Compliant</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHead col="operator" label="Operator" className="pl-4" />
                <SortableHead col="submitted" label="Submitted" />
                <SortableHead col="approved" label="Approved" />
                <SortableHead col="rejected" label="Rejected" />
                <SortableHead col="pending" label="Pending" />
                <SortableHead col="rate" label="Compliance Rate" />
                <TableHead>Trend</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <Building2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    No operators match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row) => {
                  const cfg = statusConfig[row.status];
                  const StatusIcon = cfg.icon;

                  return (
                    <TableRow key={row.operator}>
                      <TableCell className="pl-4 font-medium">
                        {row.operator}
                      </TableCell>
                      <TableCell>{row.submitted}</TableCell>
                      <TableCell className="text-emerald-500 font-medium">
                        {row.approved}
                      </TableCell>
                      <TableCell className="text-destructive font-medium">
                        {row.rejected}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.pending}
                      </TableCell>

                      {/* Compliance rate bar */}
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-28">
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                row.complianceRate >= 75
                                  ? "bg-emerald-500"
                                  : row.complianceRate >= 50
                                  ? "bg-amber-500"
                                  : "bg-destructive"
                              }`}
                              style={{ width: `${row.complianceRate}%` }}
                            />
                          </div>
                          <span className="text-sm tabular-nums w-9 text-right font-medium">
                            {row.complianceRate}%
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <TrendIcon trend={row.trend} />
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={cfg.variant}
                          className="gap-1 text-xs"
                        >
                          <StatusIcon className="h-3 w-3" />
                          {cfg.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        Showing {filtered.length} of {reports.length} operators · Data as of {year} ·{" "}
        <span className="italic">Live data integration coming soon</span>
      </p>
    </div>
  );
};

export default OperatorComplianceReports;
