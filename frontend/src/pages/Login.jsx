import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
const navigate = useNavigate();
const { login, loading } = useAuth();

const [form, setForm] = useState({
email: "",
password: "",
});

const [error, setError] = useState("");

const handleChange = (e) => {
setForm({
...form,
[e.target.name]: e.target.value,
});

setError("");


};

const handleSubmit = async (e) => {
e.preventDefault();
setError("");

const result = await login(form.email, form.password);

if (!result.success) {
  setError(result.message);
  return;
}

navigate("/dashboard");


};

return (
<div className="h-screen w-full bg-slate-50 flex items-center justify-center px-4 overflow-hidden">

  {/* Login Card */}
  <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-7 sm:p-9">

    

    {/* Heading */}
    <div className="text-center mb-7">
      <h2 className="text-2xl font-bold text-slate-900">
        Welcome back
      </h2>

      <p className="text-sm text-slate-500 mt-2">
        Sign in to your account to continue
      </p>
    </div>

    {/* Error */}
    {error && (
      <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
        {error}
      </div>
    )}

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Email address
        </label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
          autoComplete="email"
          className="w-full h-12 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Password
        </label>

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
          autoComplete="current-password"
          className="w-full h-12 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
        />
      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition duration-200 shadow-md shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Signing in...
          </span>
        ) : (
          "Sign in"
        )}
      </button>
    </form>

    {/* Register */}
    <div className="mt-6 text-center">
      <p className="text-sm text-slate-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Create account
        </Link>
      </p>
    </div>

    {/* Footer */}
    <p className="text-center text-xs text-slate-400 mt-7">
      Secure workspace access for your team.
    </p>

  </div>
</div>


);
};

export default Login;