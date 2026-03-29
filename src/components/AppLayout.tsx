import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  User,
  Star,
  ListChecks,
  GraduationCap,
  Grid3X3,
} from "lucide-react";
import { getActiveUserEmail } from "@/lib/api";

const navItems = [
  { to: "/", label: "Home", icon: <GraduationCap size={18} /> },
  { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { to: "/topics", label: "Topics", icon: <Grid3X3 size={18} /> },
  { to: "/assistant", label: "AI Assistant", icon: <MessageSquare size={18} /> },
  { to: "/practice", label: "Practice", icon: <ListChecks size={18} /> },
  { to: "/saved", label: "Saved Words", icon: <Star size={18} /> },
  { to: "/profile", label: "Profile", icon: <User size={18} /> },
];

export default function AppLayout() {
  const activeEmail = getActiveUserEmail();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
        <aside className="w-full shrink-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:w-[250px]">
          <div className="px-2 py-3">
            <p className="text-lg font-semibold tracking-tight">IELTS IQ</p>
            <p className="mt-1 text-sm text-slate-500">Learning app</p>
            <div className="mt-4 rounded-2xl bg-slate-50 px-3 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Active Profile
              </p>
              <p className="mt-1 truncate text-sm font-medium text-slate-700">
                {activeEmail}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
