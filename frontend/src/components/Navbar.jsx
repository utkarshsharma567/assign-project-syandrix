import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const userName = user?.name || "User";
  const userRole = user?.role?.replace("_", " ") || "User";
  const avatarLetter = userName.charAt(0).toUpperCase();

  return (
    <header className="h-20 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between px-5 md:px-8 sticky top-0 z-30 shadow-sm">

      {/* Mobile Logo */}
      <div className="md:hidden flex items-center gap-3">

        {/* Gradient Logo */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-purple-500/25">
          T
        </div>

        <div>
          <span className="font-black text-slate-900 text-lg">
            TaskFlow
          </span>

          <p className="text-[10px] text-slate-400 font-medium -mt-1">
            Workspace
          </p>
        </div>

      </div>

      {/* Desktop Title */}
      <div className="hidden md:flex items-center gap-4">

        {/* Small colorful icon */}
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <span className="text-xl">
            ✦
          </span>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-500">
            Workspace
          </p>

          <h2 className="font-black text-slate-900 text-lg">
            Task Management
          </h2>
        </div>

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 md:gap-4">

        {/* User Info */}
        <div className="hidden sm:flex items-center gap-3">

          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">
              {userName}
            </p>

            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-600 capitalize">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {userRole}
            </span>
          </div>

        </div>

        {/* Avatar */}
        <div className="relative">

          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-purple-500/25 ring-4 ring-purple-50">
            {avatarLetter}
          </div>

          {/* Online indicator */}
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>

        </div>

        {/* Divider */}
        <div className="hidden sm:block h-8 w-px bg-slate-200"></div>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="hidden sm:flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-50 to-red-50 text-red-600 border border-red-100 text-sm font-bold hover:from-red-500 hover:to-rose-500 hover:text-white hover:border-red-500 shadow-sm hover:shadow-lg hover:shadow-red-500/20 transition-all duration-200"
        >
          <span>
            ↪
          </span>

          Logout
        </button>

      </div>

    </header>
  );
};

export default Navbar;
