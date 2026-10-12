
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  account,
  tablesDB,
  DATABASE_ID,
  TABLE_ID,
  ID,
  Permission,
  Role,
} from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function CreateTicket() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!title.trim() || !description.trim() || !customerName.trim()) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const user = await account.get();

      await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ID.unique(),
        data: {
          title: title.trim(),
          description: description.trim(),
          customerName: customerName.trim(),
          customerId: user.$id,
          priority,
          status: "Open",
        },
        permissions: [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ],
      });

      setMessage("Ticket created successfully!");
      setTitle("");
      setDescription("");
      setCustomerName("");
      setPriority("Medium");

      setTimeout(() => navigate("/tickets"), 1000);
    } catch (error) {
      console.error("Ticket creation error:", error);
      setMessage(error.message || "Could not create ticket.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">
            Create Support Ticket
          </CardTitle>
          <p className="text-sm text-slate-400">
            Describe your issue and our support team will help you.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Ticket Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Unable to log in"
                maxLength={150}
                required
                className="border-slate-700 bg-slate-950"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Name</label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                maxLength={100}
                required
                className="border-slate-700 bg-slate-950"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain your issue..."
                maxLength={2000}
                required
                rows={5}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {message && (
              <p className="text-sm text-blue-300" role="status">
                {message}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating ticket..." : "Submit Ticket"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateTicket;
