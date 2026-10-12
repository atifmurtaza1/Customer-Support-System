
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  account,
  tablesDB,
  DATABASE_ID,
  TABLE_ID,
} from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function TicketDetails() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchTicket = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const user = await account.get();

      const row = await tablesDB.getRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ticketId,
      });

      // Verify ownership before displaying the ticket.
      if (row.customerId !== user.$id) {
        setError("You don't have permission to view this ticket.");
        setTicket(null);
        return;
      }

      setTicket(row);
    } catch (err) {
      console.error("Ticket details error:", err);
      setError("Ticket not found or you don't have permission to access it.");
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  function handleChange(field, value) {
    setTicket((current) => ({ ...current, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setMessage("");

    if (!ticket.title.trim() || !ticket.description.trim()) {
      setMessage("Title and description are required.");
      return;
    }

    try {
      setSaving(true);

      // Verify the signed-in user still owns this ticket.
      const user = await account.get();

      const currentRow = await tablesDB.getRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ticketId,
      });

      if (currentRow.customerId !== user.$id) {
        setMessage("You cannot edit another customer's ticket.");
        return;
      }

      const updatedRow = await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ticketId,
        data: {
          title: ticket.title.trim(),
          description: ticket.description.trim(),
          customerName: ticket.customerName.trim(),
          priority: ticket.priority,
        },
      });

      setTicket(updatedRow);
      setMessage("Ticket updated successfully.");
    } catch (err) {
      console.error("Ticket update error:", err);
      setMessage(err.message || "Could not update ticket.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-slate-300">Loading ticket...</p>;
  }

  if (error || !ticket) {
    return (
      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardContent className="space-y-4 py-8">
          <p className="text-red-400 " >
            {error || "Ticket not found."}
          </p>
          <Button  asChild variant="outline " >
            <Link to="/tickets">Back to My Tickets</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Ticket Details</h1>
          <p className="mt-2 text-sm text-slate-400">
            Ticket ID: {ticket.$id}
          </p>
        </div>

        <Button asChild variant="outline">
          <Link to="/tickets">Back to My Tickets</Link>
        </Button>
      </div>

      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <CardTitle>Edit Your Ticket</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={ticket.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                maxLength={150}
                required
                className="border-slate-700 bg-slate-950"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Name</label>
              <Input
                value={ticket.customerName || ""}
                onChange={(e) =>
                  handleChange("customerName", e.target.value)
                }
                maxLength={100}
                required
                className="border-slate-700 bg-slate-950"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={ticket.description || ""}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
                maxLength={2000}
                rows={6}
                required
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <select
                value={ticket.priority || "Medium"}
                onChange={(e) => handleChange("priority", e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="rounded-lg bg-slate-950 p-3 text-sm">
              <p>
                Status: <span className="font-medium">{ticket.status}</span>
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Only support staff should manage ticket status.
              </p>
            </div>

            {message && (
              <p className="text-sm text-blue-300" role="status">
                {message}
              </p>
            )}

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default TicketDetails;
