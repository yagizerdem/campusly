import { createBrowserRouter, redirect } from "react-router";
import AuthPage from "@components/auth";
import PasswordResetPage from "@components/auth/password-reset";

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
]);

export default router;
