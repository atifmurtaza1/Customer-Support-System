
import { useCallback, useEffect, useState } from "react";
import {
  account,
  tablesDB,
  DATABASE_ID,
  TABLE_ID,
  Query,
} from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Dashboard() {
  const [tickets, setTickets] = useState([]);
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
      console.error("Dashboard error:", err);
      setError(err.message || "Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const stats = [
    {
      title: "Total Tickets",
      value: tickets.length,
      description: "Tickets submitted by you",
    },
    {
      title: "Open",
      value: tickets.filter((ticket) => ticket.status === "Open").length,
      description: "Waiting for support",
    },
    {
      title: "In Progress",
      value: tickets.filter((ticket) => ticket.status === "In Progress").length,
      description: "Being worked on",
    },
    {
      title: "Resolved",
      value: tickets.filter((ticket) => ticket.status === "Resolved").length,
      description: "Successfully resolved",
    },
  ];

  if (loading) {
    return <p className="text-slate-300">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-red-400">{error}</p>
        <Button onClick={fetchTickets}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Customer Dashboard
        </h1>
        <p className="mt-2 text-slate-400">
          Track your support requests and their current status.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-slate-800 bg-slate-900 text-white"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="mt-2 text-xs text-slate-500">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <p className="text-sm text-slate-400">
              You haven't created any tickets yet.
            </p>
          ) : (
            <div className="space-y-4">
              {tickets.slice(0, 5).map((ticket) => (
                <div
                  key={ticket.$id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{ticket.title}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {ticket.$createdAt
                        ? new Date(ticket.$createdAt).toLocaleString()
                        : "Date unavailable"}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs">
                    {ticket.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
