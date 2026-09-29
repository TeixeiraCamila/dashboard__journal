import { BrowserRouter, Routes, Route, Navigate, NavLink } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import BarChart from "@mui/icons-material/BarChart";
import ViewList from "@mui/icons-material/ViewList";
import EmojiEvents from "@mui/icons-material/EmojiEvents";
import LibraryBooks from "@mui/icons-material/LibraryBooks";

import { Dashboard } from "@/pages/Dashboard";
import { Top10 } from "@/pages/Top10";
import { Series } from "@/pages/Series";
import { List } from "@/pages/List";
import { NotFound } from "@/pages/NotFound";

const query_client = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

const nav_items = [
  { path: "/", label: "Dashboard", icon: BarChart },
  { path: "/top10", label: "Top10", icon: EmojiEvents },
  { path: "/series", label: "Series", icon: LibraryBooks },
  { path: "/list", label: "List", icon: ViewList },
];

const routes_items = [
  { path: "/", element: <Dashboard /> },
  { path: "/top10", element: <Top10 /> },
  { path: "/series", element: <Series /> },
  { path: "/list", element: <List /> },
];
export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={query_client}>
        <Layout />
      </QueryClientProvider>
    </BrowserRouter>
  );
}
function Layout() {
  return (
    <div className="dashboard">
      <nav className="sidebar">
        <div className="sidebar__nav">
          {nav_items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
                }
              >
                <Icon />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
      <div className="dashboard__content">
        <main className="main">
          <Routes>
            {routes_items.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
