
import { useState } from "react";
import { useNavigate } from "react-router";
import { account } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    setLoading(true);
    setError("");

    try {
      await account.deleteSession({
        sessionId: "current",
      });

      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to log out.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="destructive"
        className="w-full"
        onClick={handleLogout}
        disabled={loading}
      >
        {loading ? "Logging out..." : "Log out"}
      </Button>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}