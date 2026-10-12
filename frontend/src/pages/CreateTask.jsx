
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const CreateTask = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    phone: "",
    dueDate: "",
    priority: "medium",
  });

  const targetRole =
    user?.role === "admin" ? "team_leader" : "employee";

  const targetRoleLabel =
    targetRole === "team_leader" ? "Team Leader" : "Employee";

  // Selected user
  const selectedUser = useMemo(() => {
    return users.find((item) => item._id === form.assignedTo);
  }, [users, form.assignedTo]);

  // Fetch assignable users
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      const response = await api.get(
        `/users?role=${targetRole}`
      );

      setUsers(response.data.users || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to load users"
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (
      user?.role === "admin" ||
      user?.role === "team_leader"
    ) {
      fetchUsers();
    } else {
      setLoadingUsers(false);
    }
  }, [user?.role]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "assignedTo") {
      const member = users.find((item) => item._id === value);

      setForm((prev) => ({
        ...prev,
        assignedTo: value,
        phone: member?.phone || "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create task and send SMS through backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.assignedTo) {
      toast.error(`Please select a ${targetRoleLabel}.`);
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Please enter recipient phone number.");
      return;
    }

    if (!/^\+[1-9]\d{7,14}$/.test(form.phone.trim())) {
      toast.error(
        "Enter a valid phone number with country code, e.g. +919876543210"
      );
      return;
    }

    try {
      setSubmitting(true);

      // Step 1: Update recipient phone number in database
      await api.put(`/auth/${form.assignedTo}/phone`, {
        phone: form.phone.trim(),
      });

      // Step 2: Create task
      // Backend sends SMS after task is saved
      const response = await api.post("/tasks", {
        title: form.title,
        description: form.description,
        assignedTo: form.assignedTo,
        dueDate: form.dueDate,
        priority: form.priority,
      });

      // Check notification result from backend
      if (response.data.notification === "sent") {
        toast.success("Task created and SMS sent successfully!");
      } else {
        toast.success("Task created, but SMS was not sent.");
      }

      // Update local user phone in case the list is reused
      setUsers((prev) =>
        prev.map((item) =>
          item._id === form.assignedTo
            ? { ...item, phone: form.phone.trim() }
            : item
        )
      );

      // Reset form
      setForm({
        title: "",
        description: "",
        assignedTo: "",
        phone: "",
        dueDate: "",
        priority: "medium",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update phone or create task"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-violet-500 blur-lg opacity-30" />
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-500/20">
              +
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-violet-600 uppercase tracking-wide">
              Task Management
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900">
              Create New Task
            </h1>
          </div>
        </div>

        <p className="text-slate-500 max-w-2xl leading-relaxed">
          Create a task, assign it to the right team member,
          set its priority, and send an SMS notification.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">

        {/* Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-violet-950 px-7 py-7 md:px-9">
          <div className="absolute -right-10 -top-20 w-64 h-64 rounded-full bg-violet-500/10 blur-2xl" />
          <div className="absolute -right-20 -bottom-32 w-72 h-72 rounded-full bg-indigo-500/10 blur-2xl" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Ready to create
                </span>
              </div>

              <h2 className="text-2xl font-black text-white mt-2">
                Task Details
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Add task information, choose a member and enter
                their phone number for SMS notification.
              </p>
            </div>

            <div className="self-start md:self-center px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm">
              <span className="text-sm text-slate-200">
                {user?.role === "admin"
                  ? "Admin Workspace"
                  : "Team Leader Workspace"}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-7 md:p-9">
          <div className="grid lg:grid-cols-2 gap-8">

            {/* Left Column */}
            <div className="space-y-6">

              {/* Task Title */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Task Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Create Employee API"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/70 outline-none transition-all duration-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 focus:bg-white"
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Description
                  </label>
                  <span className="text-xs text-slate-400">
                    Optional
                  </span>
                </div>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe what needs to be completed..."
                  rows="8"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/70 outline-none resize-none transition-all duration-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 focus:bg-white"
                />
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">

              {/* Assign To */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Assign To
                </label>

                <div className="relative">
                  <select
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={handleChange}
                    required
                    disabled={loadingUsers}
                    className="appearance-none w-full px-4 py-3.5 pr-12 rounded-xl border border-slate-200 bg-slate-50/70 outline-none transition-all duration-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {loadingUsers
                        ? "Loading users..."
                        : `Select ${targetRoleLabel}`}
                    </option>

                    {users.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name} — {item.email}
                      </option>
                    ))}
                  </select>

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    ▼
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  <p className="text-xs text-slate-400">
                    {user?.role === "admin"
                      ? "Tasks can be assigned to Team Leaders."
                      : "Tasks can be assigned to Employees."}
                  </p>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Recipient Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+919876543210"
                  required
                  disabled={!form.assignedTo}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/70 outline-none transition-all duration-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                />

                <div className="flex items-center gap-2 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  <p className="text-xs text-slate-400">
                    Include country code, e.g. +91 for India.
                  </p>
                </div>
              </div>

              {/* Priority */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Priority
                  </label>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      form.priority === "high"
                        ? "bg-red-50 text-red-600"
                        : form.priority === "medium"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {form.priority.charAt(0).toUpperCase() +
                      form.priority.slice(1)}
                  </span>
                </div>

                <div className="relative">
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="appearance-none w-full px-4 py-3.5 pr-12 rounded-xl border border-slate-200 bg-slate-50/70 outline-none transition-all duration-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 focus:bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    ▼
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  <p className="text-xs text-slate-400">
                    Select how important this task is.
                  </p>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/70 outline-none transition-all duration-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 focus:bg-white"
                />
              </div>

              {/* Assignment Preview */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 border border-violet-100 p-5">
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-violet-200/40 blur-xl" />

                <p className="relative text-[11px] uppercase tracking-[0.15em] font-black text-violet-600">
                  Assignment Preview
                </p>

                <div className="relative flex items-center gap-4 mt-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-200">
                    {selectedUser?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 truncate">
                      {selectedUser?.name || "No user selected"}
                    </p>
                    <p className="text-sm text-slate-500 capitalize">
                      {targetRoleLabel}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {form.phone || "No phone number entered"}
                    </p>
                  </div>
                </div>

                <div className="relative mt-4 pt-4 border-t border-violet-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    Task Priority
                  </span>

                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                      form.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : form.priority === "medium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {form.priority.charAt(0).toUpperCase() +
                      form.priority.slice(1)}
                  </span>
                </div>

                <div className="relative mt-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    SMS Notification
                  </span>
                  <span className="text-xs font-bold text-violet-700">
                    On task creation
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 my-8" />

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              disabled={submitting}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || loadingUsers}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-lg shadow-indigo-200 hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-indigo-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Task...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>＋</span>
                  Create & Assign Task
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;