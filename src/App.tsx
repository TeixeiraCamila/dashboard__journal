import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Dashboard } from "@/pages/Dashboard";
import { Top10 } from "@/pages/Top10";
import { Series } from "@/pages/Series";
import { List } from "@/pages/List";

const query_client = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

const nav_items = [
  { path: "/", label: "Dashboard" },
  { path: "/top10", label: "Top10" },
  { path: "/series", label: "Series" },
  { path: "/list", label: "List" },
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
        {nav_items.map((item) => (
          <Link key={item.path} to={item.path}>
            {item.label}
          </Link>
        ))}
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
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </main>
      </div>
    </div>
  );
}
