import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRegister() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const result = register(name, email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/admin", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-3xl font-bold">Admin Register</h1>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="name" className="mb-2 block">
            Full Name
          </label>
          <input
            id="name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Minimum 6 characters"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-orange-500 p-3 font-bold text-white hover:bg-orange-600"
        >
          Create Account
        </button>

        <p className="text-center text-sm text-gray-600">
          Already registered?{" "}
          <Link
            to="/admin/login"
            className="font-semibold text-orange-600"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}