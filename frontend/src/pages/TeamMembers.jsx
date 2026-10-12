
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const TeamMembers = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Actual input value
  const [search, setSearch] = useState("");

  // Debounced value
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const targetRole =
    user?.role === "admin"
      ? "team_leader"
      : "employee";

  const pageTitle =
    user?.role === "admin"
      ? "Team Leaders"
      : "My Employees";

  const pageDescription =
    user?.role === "admin"
      ? "View and manage all team leaders in your workspace."
      : "View all employees available in your team.";

  /* =========================================================
     FETCH USERS
  ========================================================= */

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/users?role=${targetRole}`
      );

      setUsers(response.data.users || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FETCH USERS WHEN ROLE CHANGES
  ========================================================= */

  useEffect(() => {
    if (
      user?.role === "admin" ||
      user?.role === "team_leader"
    ) {
      fetchUsers();
    }
  }, [user?.role]);

  /* =========================================================
     DEBOUNCE SEARCH
     
     User stops typing for 500ms
     ↓
     debouncedSearch updates
  ========================================================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  /* =========================================================
     FILTER USERS
  ========================================================= */

  const filteredUsers = useMemo(() => {
    const value = debouncedSearch
      .toLowerCase()
      .trim();

    if (!value) {
      return users;
    }

    return users.filter(
      (member) =>
        member.name
          ?.toLowerCase()
          .includes(value) ||
        member.email
          ?.toLowerCase()
          .includes(value)
    );
  }, [users, debouncedSearch]);

  /* =========================================================
     HELPERS
  ========================================================= */

  const getInitial = (name) => {
    return (
      name?.charAt(0)?.toUpperCase() ||
      "U"
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const clearSearch = () => {
    setSearch("");
  };

  /* =========================================================
     ACCESS RESTRICTED
  ========================================================= */

  if (
    user?.role !== "admin" &&
    user?.role !== "team_leader"
  ) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-sm">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center text-2xl">
            🔒
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-5">
            Access Restricted
          </h2>

          <p className="text-slate-500 mt-2">
            You don't have permission to view team members.
          </p>

        </div>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="max-w-7xl mx-auto space-y-7">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm">

        {/* Background decorations */}
        <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-indigo-50" />

        <div className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full bg-violet-50" />

        <div className="relative p-7 md:p-9">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <div className="flex items-center gap-3 mb-4">

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200">

                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>

                </div>

                <span className="px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700">
                  {user.role === "admin"
                    ? "ADMIN"
                    : "TEAM LEADER"}
                </span>

              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                {pageTitle}
              </h1>

              <p className="text-slate-500 mt-2 max-w-xl">
                {pageDescription}
              </p>

            </div>


            {/* Total Members */}
            <div className="shrink-0 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 min-w-[150px]">

              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Total Members
              </p>

              <p className="text-4xl font-black text-slate-900 mt-1">
                {users.length}
              </p>

              {!loading && (
                <p className="text-xs text-slate-400 mt-1">
                  {filteredUsers.length} visible
                </p>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SEARCH + REFRESH
      ====================================================== */}

      <div className="flex flex-col md:flex-row gap-3">

        {/* Search */}
        <div className="relative flex-1">

          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
            />
          </svg>


          <input
            type="text"
            placeholder={`Search ${
              targetRole === "employee"
                ? "employees"
                : "team leaders"
            }...`}
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition shadow-sm"
          />


          {/* Clear button */}
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
            >
              ×
            </button>
          )}

        </div>


        {/* Refresh */}
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="px-5 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-50 shadow-sm"
        >
          {loading
            ? "Refreshing..."
            : "↻ Refresh"}
        </button>

      </div>


     


      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 flex items-center gap-3">

          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
            ⚠️
          </div>

          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

        </div>
      )}


      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {[1, 2, 3, 4, 5, 6].map(
            (item) => (
              <div
                key={item}
                className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse"
              >

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-slate-200" />

                  <div className="flex-1 space-y-2">

                    <div className="h-4 bg-slate-200 rounded w-2/3" />

                    <div className="h-3 bg-slate-200 rounded w-full" />

                  </div>

                </div>

                <div className="mt-6 h-10 bg-slate-200 rounded-xl" />

                <div className="mt-3 h-10 bg-slate-200 rounded-xl" />

              </div>
            )
          )}

        </div>
      )}


      {/* =====================================================
          EMPTY
      ====================================================== */}

      {!loading &&
        !error &&
        filteredUsers.length === 0 && (

          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">

            <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 flex items-center justify-center">

              <svg
                className="w-10 h-10 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-1.12 7.754"
                />
              </svg>

            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-5">
              No members found
            </h2>

            <p className="text-slate-500 mt-2">
              {search
                ? "Try a different name or email."
                : `There are no ${targetRole}s available.`}
            </p>

            {search && (
              <button
                onClick={clearSearch}
                className="mt-5 px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition"
              >
                Clear Search
              </button>
            )}

          </div>
        )}


      {/* =====================================================
          USERS
      ====================================================== */}

      {!loading &&
        filteredUsers.length > 0 && (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {filteredUsers.map(
              (member) => (

                <div
                  key={member._id}
                  className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300"
                >

                  {/* User */}
                  <div className="flex items-center gap-4">

                    <div className="relative">

                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-indigo-100">
                        {getInitial(member.name)}
                      </div>

                      <span className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />

                    </div>


                    <div className="min-w-0">

                      <h2 className="text-lg font-bold text-slate-900 truncate">
                        {member.name}
                      </h2>

                      <span className="inline-flex mt-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold capitalize">
                        {member.role?.replace(
                          "_",
                          " "
                        )}
                      </span>

                    </div>

                  </div>


                  {/* Email */}
                  <div className="mt-6 flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">

                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      ✉️
                    </div>

                    <div className="min-w-0">

                      <p className="text-xs text-slate-400">
                        Email
                      </p>

                      <p className="text-sm font-medium text-slate-700 truncate">
                        {member.email}
                      </p>

                    </div>

                  </div>


                  {/* Joined */}
                  <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">

                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      📅
                    </div>

                    <div>

                      <p className="text-xs text-slate-400">
                        Joined
                      </p>

                      <p className="text-sm font-medium text-slate-700">
                        {formatDate(member.createdAt)}
                      </p>

                    </div>

                  </div>


                  {/* Footer */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <span className="w-2 h-2 rounded-full bg-emerald-500" />

                      <span className="text-xs font-medium text-slate-500">
                        Active member
                      </span>

                    </div>

                    <span className="text-xs font-semibold text-indigo-600">
                      {member.role === "employee"
                        ? "Employee"
                        : "Team Leader"}
                    </span>

                  </div>

                </div>

              )
            )}

          </div>
        )}

    </div>
  );
};

export default TeamMembers;









