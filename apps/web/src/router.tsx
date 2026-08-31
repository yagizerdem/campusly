import { createBrowserRouter, redirect } from "react-router";
import AuthPage from "@components/auth";
import PasswordResetPage from "@components/auth/password-reset";
import HomePage from "@components/home";

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => redirect("/auth"),
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/password-reset",
    element: <PasswordResetPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
]);

export default router;
