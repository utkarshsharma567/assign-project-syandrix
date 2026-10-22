
import { useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const result = login(email, password);

    if (!result.success) {
      setError(result.message || "Invalid email or password.");
      return;
    }

    const destination = location.state?.from?.pathname;

    navigate(
      destination?.startsWith("/admin") &&
        destination !== "/admin/login" &&
        destination !== "/admin/register"
        ? destination
        : "/admin",
      { replace: true }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to access your dashboard.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
          >
            {error}
          </p>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-orange-500 px-4 py-3 font-bold text-white transition hover:bg-orange-600"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600">
          New admin?{" "}
          <Link
            to="/admin/register"
            className="font-semibold text-orange-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
