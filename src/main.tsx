import "./index.css";
import { StrictMode } from "react";
import { routes } from "./routes/router.tsx";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuthStore } from "@/store/auth.store";
import { Toaster } from "sonner";

// Initialize auth state from storage/server on app load
useAuthStore.getState().initializeFromStorage();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={routes}/>
      <Toaster />
    </ThemeProvider>
  </StrictMode>
);
