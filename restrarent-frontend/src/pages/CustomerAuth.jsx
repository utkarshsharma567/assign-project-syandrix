
import { useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../hooks/useCart";

export default function CustomerAuth() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { customer, loginCustomer, registerCustomer } = useAuth();
  const { addToCart } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from || "/menu";

  // Already logged-in customers can continue
  if (customer) {
    return <Navigate to={destination} replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const result = isRegister
      ? registerCustomer(name, email, password)
      : loginCustomer(email, password);

    if (!result.success) {
      setError(result.message || "Something went wrong.");
      return;
    }

    const pendingDish = location.state?.dish;

    if (pendingDish) {
      addToCart(pendingDish);
      navigate("/cart", { replace: true });
      return;
    }

    navigate(destination, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-lg sm:p-9"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isRegister ? "Create Account" : "Customer Login"}
          </h1>

          <p className="mt-2 text-gray-500">
            {isRegister
              ? "Create an account to start ordering your favourite food."
              : "Sign in to continue to your TastePoint account."}
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600"
          >
            {error}
          </p>
        )}

        {isRegister && (
          <div>
            <label
              htmlFor="customer-name"
              className="mb-2 block font-medium text-gray-700"
            >
              Full Name
            </label>

            <input
              id="customer-name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              placeholder="Enter your full name"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="customer-email"
            className="mb-2 block font-medium text-gray-700"
          >
            Email
          </label>

          <input
            id="customer-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-200 p-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="customer-password"
            className="mb-2 block font-medium text-gray-700"
          >
            Password
          </label>

          <input
            id="customer-password"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            minLength={6}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-200 p-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            placeholder={
              isRegister ? "At least 6 characters" : "Enter your password"
            }
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-orange-500 p-3 font-bold text-white transition hover:bg-orange-600 active:scale-[0.99]"
        >
          {isRegister ? "Create Account" : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600">
          {isRegister ? "Already have an account?" : "New to TastePoint?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsRegister((prev) => !prev);
              setError("");
            }}
            className="font-semibold text-orange-600 hover:underline"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>

        <div className="border-t border-gray-100 pt-4 text-center">
          <Link
            to="/menu"
            className="text-sm text-gray-500 transition hover:text-orange-600"
          >
            Continue browsing menu
          </Link>
        </div>
      </form>
    </div>
  );
}

