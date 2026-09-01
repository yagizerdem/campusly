import { createBrowserRouter, redirect } from "react-router";
import AuthPage from "@components/auth";
import PasswordResetPage from "@components/auth/password-reset";
import HomePage from "@components/home";
import DiscoverPage from "@components/discover";

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
  {
    path: "/discover",
    element: <DiscoverPage />,
  },
]);

export default router;
