
import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { account } from "@/lib/appwrite";

export default function ProtectedRoute({
  children,
  requireAgent = false,
}) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const currentUser = await account.get();

        if (active) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Session check failed:", error);

        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setChecking(false);
        }
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Checking your session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // This check uses the Appwrite user's server-managed labels.
  // Only a trusted administrator should assign the "agent" label.
  const isAgent = user.labels?.includes("agent") ?? false;

  if (requireAgent && !isAgent) {
    return <Navigate to="/" replace />;
  }

  return children;
}
