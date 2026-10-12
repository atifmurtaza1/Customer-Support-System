
import { useCallback, useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";

function AgentDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      await account.get();

      const response = await tablesDB.listRows({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        queries: [
          Query.orderDesc("$createdAt"),
          Query.limit(100),
        ],
      });

      setTickets(response.rows);
    } catch (err) {
      console.error("Agent dashboard error:", err);
      setError(err.message || "Could not load tickets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  async function updateStatus(ticketId, newStatus) {
    try {
      setUpdatingId(ticketId);
      setError("");
      setMessage("");

      const updatedTicket = await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ticketId,
        data: {
          status: newStatus,
        },
      });

      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket.$id === ticketId ? updatedTicket : ticket
        )
      );

      setMessage(`Ticket status changed to ${newStatus}.`);
    } catch (err) {
      console.error("Status update error:", err);
      setError(
        err.message ||
          "Could not update the ticket. Check your Appwrite permissions."
      );
    } finally {
      setUpdatingId("");
    }
  }

  const openCount = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const progressCount = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  const statusStyle = {
    Open: "text-blue-400",
    "In Progress": "text-amber-400",
    Resolved: "text-emerald-400",
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-blue-400">
            SUPPORT OPERATIONS
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Agent Dashboard
          </h1>
          <p className="mt-2 text-slate-400">
            Review support requests and manage their progress.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchTickets}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh Tickets"}
        </Button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          className="rounded-lg border border-emerald-900 bg-emerald-950/40 p-4 text-sm text-emerald-300"
        >
          {message}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Tickets", value: tickets.length },
          { label: "Open", value: openCount },
          { label: "In Progress", value: progressCount },
          { label: "Resolved", value: resolvedCount },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="border-slate-800 bg-slate-900 text-white"
          >
            <CardContent className="p-6">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="mt-3 text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <CardTitle>All Support Tickets</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-slate-400">
              Loading tickets...
            </p>
          ) : tickets.length === 0 ? (
            <p className="py-8 text-center text-slate-400">
              No tickets are available.
            </p>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.$id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-slate-800 p-4 lg:flex-row lg:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <h2 className="break-words font-semibold">
                      {ticket.title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      Customer: {ticket.customerName || "Unknown"}
                    </p>

                    <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                      {ticket.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs">
                      <span className={statusStyle[ticket.status] || "text-slate-400"}>
                        {ticket.status}
                      </span>

                      <span className="text-slate-500">
                        Priority: {ticket.priority}
                      </span>

                      <span className="text-slate-500">
                        {new Date(ticket.$createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <Link
                      to={`/tickets/${ticket.$id}`}
                      className="mt-3 inline-block text-sm text-blue-400 hover:text-blue-300"
                    >
                      View ticket details →
                    </Link>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row lg:w-64 lg:shrink-0">
                    <select
                      aria-label={`Update status for ${ticket.title}`}
                      value={ticket.status}
                      disabled={updatingId === ticket.$id}
                      onChange={(event) =>
                        updateStatus(ticket.$id, event.target.value)
                      }
                      className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white disabled:opacity-50"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>

                    {updatingId === ticket.$id && (
                      <span className="self-center text-xs text-slate-400">
                        Saving...
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AgentDashboard;
