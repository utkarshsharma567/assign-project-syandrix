import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex items-center justify-center px-4">

        <div className="text-center">

          {/* Logo */}
          <div className="relative mx-auto w-16 h-16">

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 blur-lg opacity-50 animate-pulse" />

            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-2xl">
              T
            </div>

          </div>

          {/* Brand */}
          <h1 className="text-white text-2xl font-black mt-6">
            TaskFlow
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Preparing your workspace
          </p>

          {/* Loader */}
          <div className="mt-6 flex justify-center gap-1.5">

            <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:-0.3s]" />

            <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.15s]" />

            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />

          </div>

        </div>

      </div>
    );
  }

  // Not Authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated
  return children;
};

export default ProtectedRoute;
