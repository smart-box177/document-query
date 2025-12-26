import Contracts from "@/views/app/contracts";
import Dashboard from "@/views/app/admin/dashboard";
import Users from "@/views/app/admin/users";
import Settings from "@/views/app/admin/settings";

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
    path: "users",
    element: <Users />,
  },
  {
    path: "settings",
    element: <Settings />,
  },
];
