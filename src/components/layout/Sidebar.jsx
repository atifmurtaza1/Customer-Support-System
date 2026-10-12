
import { useEffect, useState } from "react";
import { NavLink } from "react-router";

import { account } from "@/lib/appwrite";
import LogoutButton from "@/components/auth/LogoutButton";

const menuItems = [
  { title: "Dashboard", path: "/" },
  { title: "Create Ticket", path: "/create-ticket" },
  { title: "All Tickets", path: "/tickets" },
];

function Sidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const currentUser = await account.get();

        if (active) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Unable to load user:", error);
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  const displayName = user?.name || "SupportDesk User";
  const initial = displayName.charAt(0).toUpperCase();

  // UI label only. Do not use preferences for security decisions.
  const role = user?.prefs?.role || "customer";

  return (
    <aside className="flex min-h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-5">
      {/* Brand */}
      <div className="mb-10">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          SupportDesk
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Customer Support System
        </p>
      </div>

      {/* Navigation */}
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Workspace
      </p>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            {item.title}
          </NavLink>
        ))}
      </nav>

      {/* User profile */}
      <div className="mt-auto space-y-5 border-t border-slate-200 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
            {initial}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {displayName}
            </p>

            <p className="truncate text-xs text-slate-500">
              {user?.email || "Loading account..."}
            </p>

            <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2 py-1 text-xs font-medium capitalize text-blue-700">
              {role}
            </span>
          </div>
        </div>

        <LogoutButton />
      </div>
    </aside>
  );
}

export default Sidebar;
