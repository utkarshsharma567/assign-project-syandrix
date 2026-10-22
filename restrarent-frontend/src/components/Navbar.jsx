
import { useState } from "react";
import {
  ChefHat,
  Menu as MenuIcon,
  X,
  ShoppingBag,
  LogOut,
  LogIn,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ cartCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { customer, isCustomerAuthenticated, logoutCustomer } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logoutCustomer();
    closeMobileMenu();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#17191d] text-white shadow-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
        <NavLink
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight"
        >
          <ChefHat size={30} className="text-brand-orange" />
          <span>
            Taste<span className="text-brand-orange">Point</span>
          </span>
        </NavLink>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `text-sm font-semibold transition hover:text-brand-orange ${
                  isActive ? "text-brand-orange" : "text-white/80"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Cart, Login/Logout and mobile toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <NavLink
            to="/cart"
            onClick={closeMobileMenu}
            aria-label={`View cart with ${cartCount} items`}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-brand-orange bg-brand-orange text-white"
                  : "border-white/20 bg-white/5 text-white hover:border-brand-orange hover:text-brand-orange"
              }`
            }
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">Cart</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-orange px-1.5 text-xs font-bold text-white">
              {cartCount}
            </span>
          </NavLink>

          {/* Desktop Login / Logout */}
          <div className="hidden md:block">
            {isCustomerAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full border border-red-400/40 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500 hover:text-white"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className="flex items-center gap-2 rounded-full bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                <LogIn size={16} />
                Login
              </NavLink>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="rounded-lg p-2 text-white hover:bg-white/10 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#17191d] px-5 py-4 md:hidden">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-base font-semibold transition ${
                    isActive
                      ? "bg-brand-orange text-white"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {isCustomerAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left font-semibold text-red-300 transition hover:bg-red-500/10"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                onClick={closeMobileMenu}
                className="flex items-center gap-2 rounded-xl px-4 py-3 font-semibold text-brand-orange hover:bg-white/5"
              >
                <LogIn size={18} />
                Login
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
