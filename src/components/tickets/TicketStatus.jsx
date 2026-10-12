
import { useState } from "react";

const TicketStatus = () => {
  const [status, setStatus] = useState("Open");

  function resolveTicket() {
    setStatus("Resolved");
  }

  return (
    <div className="space-y-4 rounded-xl border p-5">
      <h2 className="text-xl font-bold">Login Issue</h2>

      <p>
        Ticket Status: <strong>{status}</strong>
      </p>

      <button
        onClick={resolveTicket}
        disabled={status === "Resolved"}
        className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "Resolved" ? "Ticket Resolved" : "Resolve Ticket"}
      </button>
    </div>
  );
};

export default TicketStatus;
