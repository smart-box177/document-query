import Users from "@/views/app/admin/users";
import Contracts from "@/views/app/contracts";
import Settings from "@/views/app/admin/settings";
import Dashboard from "@/views/app/admin/dashboard";
import ApplicationReviewQueue from "@/views/app/application-review-queue";

export const adminRoutes = [
  {
    index: true,
    element: <Dashboard />,
  },
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "contracts",
    element: <Contracts />,
  },
  {
    path: "review-queue",
    element: <ApplicationReviewQueue />,
  },
  {
    path: "users",
    element: <Users />,
  },
  {
    path: "settings",
    element: <Settings />,
  },
];
