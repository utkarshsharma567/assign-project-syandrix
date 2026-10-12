
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const userName = user?.name || "User";
  const userEmail = user?.email || "Not available";
  const role = user?.role || "employee";
  const roleName = role.replace("_", " ");

  const avatarLetter = userName
    .charAt(0)
    .toUpperCase();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* =====================================================
          WELCOME HEADER
      ====================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm">

        {/* Decorative background */}
        <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full bg-indigo-50" />

        <div className="absolute right-24 -bottom-32 w-64 h-64 rounded-full bg-violet-50" />

        <div className="relative z-10 p-7 md:p-9">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

            {/* Welcome text */}
            <div>

              <div className="flex items-center gap-2 mb-3">

                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

                <p className="text-sm font-semibold text-indigo-600">
                  Welcome back
                </p>

                <span className="text-lg">
                  👋
                </span>

              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                {userName}
              </h1>

              <p className="text-slate-500 mt-2 max-w-xl">
                Here's what's happening with your workspace today.
              </p>

            </div>

            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">

              <span className="text-3xl font-black">
                {avatarLetter}
              </span>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          ACCOUNT STATS
      ====================================================== */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {/* ROLE */}
        <InfoCard
          title="Your Role"
          value={roleName}
          description="Current position"
          icon="👤"
          iconStyle="bg-violet-50 text-violet-600"
          dotStyle="bg-violet-500"
        />

        {/* EMAIL */}
        <InfoCard
          title="Account Email"
          value={userEmail}
          description="Registered account"
          icon="✉️"
          iconStyle="bg-indigo-50 text-indigo-600"
          dotStyle="bg-indigo-500"
          truncate
        />

        {/* STATUS */}
        <InfoCard
          title="Account Status"
          value="Active"
          description="Everything looks good"
          icon="✓"
          iconStyle="bg-emerald-50 text-emerald-600"
          dotStyle="bg-emerald-500"
          active
        />

      </div>


      {/* =====================================================
          WORKSPACE
      ====================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-7 md:p-10 text-white shadow-lg shadow-indigo-200">

        {/* Background effects */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/10 blur-2xl" />

        <div className="absolute right-32 -bottom-40 w-96 h-96 rounded-full bg-violet-300/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl">

          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-indigo-100 uppercase tracking-wider">
            TaskFlow Workspace
          </span>

          <h2 className="text-2xl md:text-3xl font-black mt-5">
            Manage your tasks efficiently.
          </h2>

          <p className="text-indigo-100 mt-3 leading-relaxed max-w-2xl">
            Create, assign and track tasks from one simple workspace.
            Your available actions depend on your assigned role.
          </p>

          {/* User */}
          <div className="flex items-center gap-3 mt-7">

            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center font-bold">
              {avatarLetter}
            </div>

            <div>

              <p className="text-sm font-bold">
                {userName}
              </p>

              <p className="text-xs text-indigo-200 capitalize">
                {roleName}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          PERMISSIONS
      ====================================================== */}
      <section>

        <div className="flex items-end justify-between mb-5">

          <div>

            <p className="text-sm font-semibold text-indigo-600">
              Access Control
            </p>

            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Your Permissions
            </h2>

          </div>

          <span className="hidden sm:block text-xs text-slate-400">
            Based on your role
          </span>

        </div>


        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* ADMIN */}
          {role === "admin" && (
            <>
              <Permission
                title="Assign Tasks"
                description="Assign tasks to Team Leaders and manage task distribution."
                icon="＋"
                color="violet"
              />

              <Permission
                title="Manage Workspace"
                description="Manage users, roles and task assignments across the workspace."
                icon="⚙"
                color="indigo"
              />
            </>
          )}


          {/* TEAM LEADER */}
          {role === "team_leader" && (
            <>
              <Permission
                title="Create Tasks"
                description="Create and assign tasks directly to employees."
                icon="＋"
                color="violet"
              />

              <Permission
                title="My Tasks"
                description="View and manage tasks that have been assigned to you."
                icon="✓"
                color="indigo"
              />

              <Permission
                title="Update Status"
                description="Update the status of your assigned tasks."
                icon="↻"
                color="emerald"
              />
            </>
          )}


          {/* EMPLOYEE */}
          {role === "employee" && (
            <>
              <Permission
                title="My Tasks"
                description="View all tasks assigned to you in one place."
                icon="✓"
                color="indigo"
              />

              <Permission
                title="Update Status"
                description="Update the status and mark your tasks as completed."
                icon="↻"
                color="emerald"
              />
            </>
          )}

        </div>

      </section>

    </div>
  );
};


/* ============================================================
   INFO CARD
============================================================ */

const InfoCard = ({
  title,
  value,
  description,
  icon,
  iconStyle,
  dotStyle,
  truncate = false,
  active = false,
}) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2
            className={`font-black text-slate-900 mt-2 capitalize ${
              truncate
                ? "truncate"
                : "text-xl"
            }`}
            title={value}
          >
            {value}
          </h2>

          <div className="flex items-center gap-2 mt-3">

            {active ? (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />

                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            ) : (
              <span
                className={`w-2 h-2 rounded-full ${dotStyle}`}
              />
            )}

            <span className="text-xs text-slate-400">
              {description}
            </span>

          </div>

        </div>


        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${iconStyle} group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};


/* ============================================================
   PERMISSION CARD
============================================================ */

const Permission = ({
  title,
  description,
  icon,
  color = "indigo",
}) => {

  const colors = {

    violet: {
      icon: "bg-violet-50 text-violet-600",
      dot: "bg-violet-500",
      hover: "hover:border-violet-200",
    },

    indigo: {
      icon: "bg-indigo-50 text-indigo-600",
      dot: "bg-indigo-500",
      hover: "hover:border-indigo-200",
    },

    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      dot: "bg-emerald-500",
      hover: "hover:border-emerald-200",
    },

  };

  const theme = colors[color] || colors.indigo;

  return (
    <div
      className={`group relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 ${theme.hover} transition-all duration-300 overflow-hidden`}
    >

      {/* Top accent */}
      <div
        className={`absolute left-0 top-0 h-1 w-full ${theme.dot}`}
      />


      <div className="flex items-start justify-between">

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold ${theme.icon} group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>

        <span
          className={`w-2 h-2 rounded-full ${theme.dot}`}
        />

      </div>


      <h3 className="font-black text-slate-900 mt-5">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-2 leading-relaxed">
        {description}
      </p>

    </div>
  );
};


export default Dashboard;



