import Dashboard from "@/views/app";
import Query from "@/views/app/query";
import Search from "@/views/app/search";
import History from "@/views/app/history";
import Archive from "@/views/app/archive";
import Setting from "@/views/app/settings";
import Bookmarks from "@/views/app/bookmarks";
import NewApplicationSubmission from "@/views/app/new-application";
import OperatorComplianceReports from "@/views/app/operator-compliance-reports";

export const appRoutes = [
  {
    index: true,
    element: <Dashboard />,
  },
  {
    path: "nccc-portal",
    element: <Search />,
  },
  {
    path: "query",
    element: <Query />,
  },
  {
    path: "new-application",
    element: <NewApplicationSubmission />,
  },
  {
    path: "compliance-reports",
    element: <OperatorComplianceReports />,
  },
  {
    path: "history",
    element: <History />,
  },
  {
    path: "archive",
    element: <Archive />,
  },
  {
    path: "bookmarks",
    element: <Bookmarks />,
  },
  {
    path: "settings",
    element: <Setting />,
  },
];
