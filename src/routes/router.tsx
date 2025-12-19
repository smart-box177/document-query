import AppLayout from "@/layout/app.layout";
import { publicRoutes } from "./public.routes";
import HomeLayout from "@/layout/public.layout";
import { createBrowserRouter } from "react-router-dom";
import { appRoutes } from "./app.routes";
import ErrorView from "@/views/error-view";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout/>,
        errorElement: <ErrorView/>,
        children: [...publicRoutes],
    },
    {
        path: "/app",
        element: <AppLayout/>,
        children: [...appRoutes]
    }
])