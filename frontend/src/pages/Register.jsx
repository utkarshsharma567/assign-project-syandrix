import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
const navigate = useNavigate();

const { register, loading } = useAuth();

const [form, setForm] = useState({
name: "",
email: "",
password: "",
role: "employee",
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

const result = await register(
  form.name,
  form.email,
  form.password,
  form.role
);

if (!result.success) {
  setError(result.message);
  return;
}

navigate("/login");


};

return (
<div className="h-screen w-full bg-slate-50 flex items-center justify-center px-4 overflow-hidden">

  {/* Register Card */}
  <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8">

    {/* Logo */}
    <div className="flex justify-center mb-5">
      <div className="flex items-center gap-3">

        <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl">
          T
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-900">
            TaskFlow
          </h1>

          <p className="text-xs text-slate-400">
            Management System
          </p>
        </div>

      </div>
    </div>

    {/* Heading */}
    <div className="text-center mb-5">

      <h2 className="text-2xl font-bold text-slate-900">
        Create account
      </h2>

      <p className="text-sm text-slate-500 mt-1.5">
        Create your account to get started
      </p>

    </div>

    {/* Error */}
    {error && (
      <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
        {error}
      </div>
    )}

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Full name
        </label>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
          autoComplete="name"
          className="w-full h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
          className="w-full h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Password
        </label>

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Create a password"
          required
          autoComplete="new-password"
          className="w-full h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Role
        </label>

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 cursor-pointer"
        >
          <option value="employee">
            Employee
          </option>

          <option value="team_leader">
            Team Leader
          </option>

          <option value="admin">
            Admin
          </option>
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 mt-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition duration-200 shadow-md shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Creating account...
          </span>
        ) : (
          "Create account"
        )}
      </button>

    </form>

    {/* Login */}
    <div className="mt-5 text-center">

      <p className="text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Sign in
        </Link>
      </p>

    </div>

    {/* Footer */}
    <p className="text-center text-xs text-slate-400 mt-5">
      Secure workspace access for your team.
    </p>

  </div>
</div>


);
};

export default Register;