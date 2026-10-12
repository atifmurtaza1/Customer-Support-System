
import { Routes, Route } from "react-router";

import Sidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicRoute from "@/components/auth/PublicRoute";

import Dashboard from "@/pages/Dashboard";
import CreateTicket from "@/pages/CreateTicket";
import AllTickets from "@/pages/AllTickets";
import TicketDetails from "@/pages/TicketDetails";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import AgentDashboard from "@/pages/AgentDashboard";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-slate-950 text-white md:flex">
              <Sidebar />

              <main className="min-w-0 flex-1 p-4 md:p-8">
                <Routes>
                  <Route
                    path="/"
                    element={<Dashboard />}
                  />

                  <Route
                    path="/tickets"
                    element={<AllTickets />}
                  />

                  <Route
                    path="/create-ticket"
                    element={<CreateTicket />}
                  />

                  <Route
                    path="/tickets/:ticketId"
                    element={<TicketDetails />}
                  />

                  {/* Agent-only dashboard */}
                  <Route
                    path="/agent"
                    element={
                      <ProtectedRoute requireAgent>
                        <AgentDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 page */}
                  <Route
                    path="*"
                    element={
                      <div className="py-10 text-center">
                        <h1 className="text-2xl font-bold">
                          404 - Page Not Found
                        </h1>
                        <p className="mt-2 text-slate-400">
                          This page doesn't exist.
                        </p>
                      </div>
                    }
                  />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
