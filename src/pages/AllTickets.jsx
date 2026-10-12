
// src/pages/AllTickets.jsx

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  account,
  tablesDB,
  DATABASE_ID,
  TABLE_ID,
  Query,
} from "@/lib/appwrite";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function AllTickets() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const user = await account.get();

      const response = await tablesDB.listRows({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        queries: [
          Query.equal("customerId", user.$id),
          Query.orderDesc("$createdAt"),
          Query.limit(100),
        ],
      });

      setTickets(response.rows);
    } catch (err) {
      console.error("Fetch tickets error:", err);
      setError(err.message || "Unable to load your tickets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title?.toLowerCase().includes(search.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, search, statusFilter, priorityFilter]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-500/10 text-blue-400";
      case "In Progress":
        return "bg-amber-500/10 text-amber-400";
      case "Resolved":
        return "bg-emerald-500/10 text-emerald-400";
      default:
        return "bg-slate-500/10 text-slate-400";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-400";
      case "Medium":
        return "text-amber-400";
      case "Low":
        return "text-emerald-400";
      default:
        return "text-slate-400";
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            My Tickets
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Track your support requests and check their current status.
          </p>
        </div>

        <Button asChild>
          <Link to="/create-ticket">+ Create Ticket</Link>
        </Button>
      </div>

      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <CardTitle className="text-lg">Find a ticket</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets..."
              className="border-slate-700 bg-slate-950"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            >
              <option value="All">All statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            >
              <option value="All">All priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="py-12 text-center text-slate-400">
          Loading your tickets...
        </div>
      ) : error ? (
        <Card className="border-red-900 bg-slate-900 text-white">
          <CardContent className="space-y-4 py-6">
            <p className="text-red-400">{error}</p>
            <Button onClick={fetchTickets} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : filteredTickets.length === 0 ? (
        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardContent className="py-12 text-center">
            <h2 className="text-lg font-semibold">No tickets found</h2>
            <p className="mt-2 text-sm text-slate-400">
              {tickets.length === 0
                ? "You haven't created any tickets yet."
                : "Try changing your search or filters."}
            </p>

            {tickets.length === 0 && (
              <Button asChild className="mt-5">
                <Link to="/create-ticket">Create Your First Ticket</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTickets.map((ticket) => (
            <Card
              key={ticket.$id}
              className="border-slate-800 bg-slate-900 text-white transition-colors hover:border-slate-600"
            >
              <CardContent className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="break-words text-lg font-semibold">
                      {ticket.title}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-sm text-slate-400">
                    {ticket.description}
                  </p>

                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                    <span>
                      Priority:{" "}
                      <span className={getPriorityStyle(ticket.priority)}>
                        {ticket.priority}
                      </span>
                    </span>

                    <span>
                      Created:{" "}
                      {new Date(ticket.$createdAt).toLocaleDateString()}
                    </span>

                    <span>
                      ID: {ticket.$id.slice(0, 8)}
                    </span>
                  </div>
                </div>

                <Button asChild variant="outline" className="shrink-0 bg-slate-900">
                  <Link to={`/tickets/${ticket.$id}`}>
                    View Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && tickets.length > 0 && (
        <p className="text-sm text-slate-500">
          Showing {filteredTickets.length} of {tickets.length} tickets.
        </p>
      )}
    </div>
  );
}

export default AllTickets;
