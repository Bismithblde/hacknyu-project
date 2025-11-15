import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import LandingPage from "./pages/LandingPage";
import ReportPage from "./pages/Report";
import PinsPage from "./pages/Pins";
import LeaderboardPage from "./pages/Leaderboard";
import DatasetPage from "./pages/Dataset";
import NotFoundPage from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "report", element: <ReportPage /> },
      { path: "pins", element: <PinsPage /> },
      { path: "leaderboard", element: <LeaderboardPage /> },
      { path: "dataset", element: <DatasetPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
