
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  // Search and filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tasks/my-tasks");
      setTasks(response.data.tasks || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to fetch your tasks"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Debounced search: 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Update task status
  const updateStatus = async (taskId, status) => {
    try {
      setUpdatingId(taskId);
      setError("");

      const response = await api.put(
        `/tasks/${taskId}/status`,
        { status }
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId
            ? {
                ...task,
                status: response.data.task.status,
              }
            : task
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update task status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Date formatting
  const formatDate = (date) => {
    if (!date) return "No due date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Overdue check
  const isOverdue = (date, status) => {
    if (!date || status === "completed") return false;

    const due = new Date(date);
    const today = new Date();

    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return due < today;
  };

  // Filter tasks by search, status and priority
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        !debouncedSearch ||
        task.title?.toLowerCase().includes(debouncedSearch) ||
        task.description?.toLowerCase().includes(debouncedSearch) ||
        task.assignedBy?.name?.toLowerCase().includes(debouncedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        (task.priority || "medium") === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, debouncedSearch, statusFilter, priorityFilter]);

  // Reset filters
  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  const hasActiveFilters =
    search !== "" ||
    statusFilter !== "all" ||
    priorityFilter !== "all";

  // Stats based on all assigned tasks
  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const completionPercentage =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  const priorityStyles = {
    low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    high: "bg-red-50 text-red-700 border-red-200",
  };

  const getPriorityStyle = (priority) => {
    return priorityStyles[priority] || priorityStyles.medium;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-7 md:p-9 text-white shadow-xl shadow-indigo-200">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 7h6m-6 4h4"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold bg-white/15 px-3 py-1.5 rounded-full backdrop-blur-md">
                Task Management
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black">
              My Tasks
            </h1>

            <p className="text-indigo-100 mt-2 max-w-xl">
              Stay organized, track your progress and complete
              your assigned work efficiently.
            </p>
          </div>

          <button
            onClick={fetchTasks}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-indigo-700 font-bold shadow-lg hover:bg-indigo-50 transition disabled:opacity-60"
          >
            <svg
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h5M20 20v-5h-5M5.05 19A9 9 0 1019 5.05"
              />
            </svg>
            Refresh
          </button>
        </div>

        <div className="absolute -right-16 -top-24 w-72 h-72 rounded-full bg-white/10" />
        <div className="absolute right-20 -bottom-32 w-80 h-80 rounded-full bg-fuchsia-400/10" />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
            !
          </div>
          <div>
            <p className="font-bold text-red-800">
              Something went wrong
            </p>
            <p className="text-sm text-red-600 mt-0.5">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Tasks"
            value={totalTasks}
            icon="📋"
            color="indigo"
          />
          <StatCard
            title="Pending"
            value={pendingTasks}
            icon="⏳"
            color="amber"
          />
          <StatCard
            title="Completed"
            value={completedTasks}
            icon="✓"
            color="emerald"
          />
          <StatCard
            title="Progress"
            value={`${completionPercentage}%`}
            icon="⚡"
            color="violet"
          />
        </div>
      )}

      {/* Progress Bar */}
      {!loading && totalTasks > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold text-slate-900">
                Overall Progress
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
            <span className="text-lg font-black text-indigo-600">
              {completionPercentage}%
            </span>
          </div>

          <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-700"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white rounded-3xl border border-slate-200 p-6 animate-pulse"
            >
              <div className="flex justify-between gap-5">
                <div className="space-y-3 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-24" />
                  <div className="h-6 bg-slate-200 rounded w-2/3" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-4 bg-slate-200 rounded w-4/5" />
                </div>
                <div className="w-24 h-7 bg-slate-200 rounded-full" />
              </div>
              <div className="mt-7 h-px bg-slate-200" />
              <div className="grid grid-cols-2 gap-5 mt-6">
                <div className="h-10 bg-slate-200 rounded-xl" />
                <div className="h-10 bg-slate-200 rounded-xl" />
              </div>
              <div className="mt-6 h-11 bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* No tasks assigned */}
      {!loading && tasks.length === 0 && !error && (
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
          <div className="relative z-10">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-4xl">
              📋
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-6">
              No tasks yet
            </h2>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              You don't have any tasks assigned to you right now.
              New tasks will appear here automatically.
            </p>
          </div>
          <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full bg-indigo-50" />
          <div className="absolute -left-20 -bottom-20 w-56 h-56 rounded-full bg-violet-50" />
        </div>
      )}

      {/* Search and Filters */}
      {!loading && tasks.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Search & Filters
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Find tasks by title, description, status or priority.
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-bold text-violet-600 hover:text-violet-800 transition"
              >
                Clear Filters ✕
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                strokeWidth="2"
              />
              <path
                strokeLinecap="round"
                strokeWidth="2"
                d="m16 16 4 4"
              />
            </svg>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by task title, description or assigned by..."
              className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 bg-slate-50/70 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100 focus:bg-white"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/70 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 focus:bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Filter by Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/70 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 focus:bg-white"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-800">
                {filteredTasks.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-800">
                {totalTasks}
              </span>{" "}
              tasks
            </p>
            {search !== debouncedSearch && (
              <span className="text-xs text-violet-600 font-medium">
                Searching...
              </span>
            )}
          </div>
        </div>
      )}

      {/* Task Cards */}
      {!loading && tasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Assigned Tasks
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Your current workload
              </p>
            </div>

            <span className="hidden sm:block px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold">
              {filteredTasks.length}{" "}
              {filteredTasks.length === 1 ? "Task" : "Tasks"}
            </span>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-sm">
              <div className="text-4xl mb-4">🔎</div>
              <h3 className="text-xl font-black text-slate-900">
                No matching tasks
              </h3>
              <p className="text-slate-500 mt-2">
                Try changing your search or filter options.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTasks.map((task) => {
                const completed = task.status === "completed";
                const overdue = isOverdue(
                  task.dueDate,
                  task.status
                );
                const assignedByName =
                  task.assignedBy?.name || "Unknown";
                const priority = task.priority || "medium";

                return (
                  <div
                    key={task._id}
                    className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              completed
                                ? "bg-emerald-500"
                                : overdue
                                ? "bg-red-500"
                                : "bg-amber-500"
                            }`}
                          />
                          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                            Task
                          </span>
                        </div>

                        <h2 className="text-xl font-black text-slate-900 break-words">
                          {task.title}
                        </h2>

                        <p className="text-sm text-slate-500 mt-2 line-clamp-2 min-h-[40px] leading-relaxed">
                          {task.description ||
                            "No description provided for this task."}
                        </p>
                      </div>

                      {/* Status */}
                      <span
                        className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
                          completed
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : overdue
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            completed
                              ? "bg-emerald-500"
                              : overdue
                              ? "bg-red-500"
                              : "bg-amber-500"
                          }`}
                        />
                        {completed
                          ? "Completed"
                          : overdue
                          ? "Overdue"
                          : "Pending"}
                      </span>
                    </div>

                    {/* Priority Badge */}
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-xs font-semibold text-slate-400">
                        Priority:
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize ${getPriorityStyle(
                          priority
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {priority}
                      </span>
                    </div>

                    <div className="border-t border-slate-100 my-6" />

                    {/* Task Information */}
                    <div className="grid grid-cols-2 gap-5">
                      {/* Assigned By */}
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          Assigned By
                        </p>

                        <div className="flex items-center gap-3 mt-3">
                          <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-sm font-black shadow-md shadow-indigo-100">
                            {assignedByName.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">
                              {assignedByName}
                            </p>
                            <p className="text-xs text-slate-400 capitalize mt-0.5">
                              {task.assignedBy?.role?.replace(
                                "_",
                                " "
                              ) || "User"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Due Date */}
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          Due Date
                        </p>

                        <div className="flex items-center gap-3 mt-3">
                          <div
                            className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
                              overdue
                                ? "bg-red-50 text-red-600"
                                : completed
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-indigo-50 text-indigo-600"
                            }`}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>

                          <div className="min-w-0">
                            <p
                              className={`text-sm font-bold ${
                                overdue
                                  ? "text-red-600"
                                  : "text-slate-800"
                              }`}
                            >
                              {formatDate(task.dueDate)}
                            </p>
                            {overdue && (
                              <p className="text-xs text-red-500 font-semibold mt-0.5">
                                Deadline passed
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    {task.message && (
                      <div className="mt-6 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/50 border border-slate-100 p-4">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mb-2">
                          Message
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed break-words">
                          {task.message}
                        </p>
                      </div>
                    )}

                    {/* Action */}
                    <div className="mt-6">
                      {completed ? (
                        <button
                          type="button"
                          onClick={() =>
                            updateStatus(task._id, "pending")
                          }
                          disabled={updatingId === task._id}
                          className="w-full py-3.5 px-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 font-bold hover:bg-amber-100 hover:border-amber-300 transition disabled:opacity-50"
                        >
                          {updatingId === task._id ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="w-4 h-4 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin" />
                              Updating...
                            </span>
                          ) : (
                            "↻ Mark as Pending"
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            updateStatus(task._id, "completed")
                          }
                          disabled={updatingId === task._id}
                          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50"
                        >
                          {updatingId === task._id ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Updating...
                            </span>
                          ) : (
                            "✓ Mark as Completed"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Stats Card
const StatCard = ({ title, value, icon, color }) => {
  const styles = {
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      border: "hover:border-indigo-200",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "hover:border-amber-200",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "hover:border-emerald-200",
    },
    violet: {
      bg: "bg-violet-50",
      text: "text-violet-600",
      border: "hover:border-violet-200",
    },
  };

  const style = styles[color] || styles.indigo;

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-sm ${style.border} hover:shadow-md transition-all`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>
          <p className={`text-3xl font-black mt-2 ${style.text}`}>
            {value}
          </p>
        </div>

        <div
          className={`w-12 h-12 rounded-2xl ${style.bg} ${style.text} flex items-center justify-center text-xl`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;

