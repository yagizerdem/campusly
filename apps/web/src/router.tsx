import { createBrowserRouter, redirect } from "react-router";
import AuthPage from "@components/auth";

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => redirect("/auth"),
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
]);

export default router;
