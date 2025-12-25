import { useState } from "react";
import {
  Search,
  Clock,
  Trash2,
  MoreHorizontal,
  Calendar,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface SearchHistoryItem {
  id: string;
  query: string;
  resultsCount: number;
  searchedAt: string;
  tab: string;
}

// Mock data - replace with actual API call
const mockHistory: SearchHistoryItem[] = [
  {
    id: "1",
    query: "SEPLAT drilling contracts 2023",
    resultsCount: 24,
    searchedAt: "2024-12-25T10:30:00Z",
    tab: "all",
  },
  {
    id: "2",
    query: "Offshore maintenance services",
    resultsCount: 12,
    searchedAt: "2024-12-25T09:15:00Z",
    tab: "contracts",
  },
  {
    id: "3",
    query: "NNPC wireline agreements",
    resultsCount: 8,
    searchedAt: "2024-12-24T16:45:00Z",
    tab: "documents",
  },
  {
    id: "4",
    query: "Environmental compliance contracts",
    resultsCount: 31,
    searchedAt: "2024-12-24T14:20:00Z",
    tab: "all",
  },
  {
    id: "5",
    query: "Subsea installation services",
    resultsCount: 5,
    searchedAt: "2024-12-23T11:00:00Z",
    tab: "contracts",
  },
];

const History = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>(mockHistory);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);

  const filteredHistory = history.filter((item) =>
    item.query.toLowerCase().includes(filter.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    // Simulate API call - replace with actual API
    await new Promise((resolve) => setTimeout(resolve, 500));
    setHistory((prev) => prev.filter((item) => item.id !== id));
    setIsLoading(false);
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    toast.success("Search removed from history");
  };

  const handleClearAll = async () => {
    setIsLoading(true);
    // Simulate API call - replace with actual API
    await new Promise((resolve) => setTimeout(resolve, 500));
    setHistory([]);
    setIsLoading(false);
    setClearAllDialogOpen(false);
    toast.success("Search history cleared");
  };

  const handleSearchAgain = (query: string) => {
    // Navigate to search with query
    const searchUrl = `/app/search?q=${encodeURIComponent(query)}`;
    window.open(searchUrl, "_self");
  };

  const groupedHistory = filteredHistory.reduce((groups, item) => {
    const date = new Date(item.searchedAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let key: string;
    if (date.toDateString() === today.toDateString()) {
      key = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      key = "Yesterday";
    } else {
      key = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {} as Record<string, SearchHistoryItem[]>);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Search History</h1>
          <p className="text-muted-foreground">
            View and manage your recent searches
          </p>
        </div>
        {history.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setClearAllDialogOpen(true)}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Filter */}
      {history.length > 0 && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter history..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Empty State */}
      {history.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No search history</h3>
            <p className="text-muted-foreground mb-4">
              Your search history will appear here
            </p>
            <Button onClick={() => window.open("/app/search", "_self")}>
              <Search className="h-4 w-4 mr-2" />
              Start Searching
            </Button>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {history.length > 0 && filteredHistory.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              No searches match "{filter}"
            </p>
          </CardContent>
        </Card>
      )}

      {/* History List */}
      {Object.entries(groupedHistory).map(([date, items]) => (
        <div key={date} className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {date}
          </div>
          <Card>
            <CardContent className="p-0 divide-y">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group"
                >
                  <div
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                    onClick={() => handleSearchAgain(item.query)}
                  >
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{item.query}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.resultsCount} results • {item.tab} •{" "}
                        {formatDate(item.searchedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleSearchAgain(item.query)}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleSearchAgain(item.query)}
                        >
                          <ArrowUpRight className="h-4 w-4 mr-2" />
                          Search again
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setItemToDelete(item.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}

      {/* Delete Single Item Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from history?</AlertDialogTitle>
            <AlertDialogDescription>
              This search will be removed from your history. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => itemToDelete && handleDelete(itemToDelete)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear All Dialog */}
      <AlertDialog
        open={clearAllDialogOpen}
        onOpenChange={setClearAllDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all search history?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your search history. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Clear All"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default History;
