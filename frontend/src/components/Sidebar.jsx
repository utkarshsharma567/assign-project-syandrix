
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const navItemClass = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;

  return (
    <aside className="hidden md:flex w-64 min-h-[calc(100vh-73px)] bg-white text-slate-800 flex-col border-r border-slate-200">

      {/* Logo */}
      <div className="px-5 py-6 border-b border-slate-100">
        <div className="flex items-center gap-3">

          {/* Logo Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9c0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>

          <div>
            <h2 className="font-bold text-lg tracking-tight text-slate-900">
              TaskFlow
            </h2>

            <p className="text-xs text-slate-400">
              Workspace
            </p>
          </div>

        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">

        {/* Section Label */}
        <p className="px-4 mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Main Menu
        </p>

        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={navItemClass}
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-white">
            🏠
          </span>

          <span className="font-medium">
            Dashboard
          </span>
        </NavLink>

        {/* My Tasks */}
        {(user?.role === "employee" ||
          user?.role === "team_leader") && (
          <NavLink
            to="/my-tasks"
            className={navItemClass}
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-white">
              📋
            </span>

            <span className="font-medium">
              My Tasks
            </span>
          </NavLink>
        )}

        {/* Create Task */}
        {(user?.role === "admin" ||
          user?.role === "team_leader") && (
          <NavLink
            to="/create-task"
            className={navItemClass}
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-white">
              ➕
            </span>

            <span className="font-medium">
              Create Task
            </span>
          </NavLink>
        )}

        {/* Team Members */}
        {(user?.role === "admin" ||
          user?.role === "team_leader") && (
          <NavLink
            to="/team-members"
            className={navItemClass}
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-white">
              👥
            </span>

            <span className="font-medium">
              Team Members
            </span>
          </NavLink>
        )}

      </nav>

      {/* Bottom Profile */}
      <div className="p-4 border-t border-slate-100">

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">

          <div className="flex items-center gap-3">

            {/* Avatar */}
            <div className="relative shrink-0">

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              {/* Online Dot */}
              <span className="absolute -right-1 -bottom-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />

            </div>

            {/* User Info */}
            <div className="min-w-0 flex-1">

              <p className="text-sm font-semibold text-slate-800 truncate">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-slate-500 capitalize truncate">
                {user?.role?.replace("_", " ") || "User"}
              </p>

            </div>

          </div>

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;



