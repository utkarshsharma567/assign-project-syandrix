import { useState } from "react";
import { ChefHat, Menu as MenuIcon, X, ShoppingBag } from "lucide-react";
import { NavLink } from "react-router-dom";

/**
 * Navbar Component
 * 
 * Features:
 * - Brand logo linking to Home
 * - Desktop navigation links (Home, Menu, About, Contact)
 * - Clickable Cart badge leading to /cart with item count
 * - Responsive mobile hamburger menu
 * 
 * Props:
 * - cartCount: Current total number of items in the cart
 */
export default function Navbar({ cartCount = 0 }) {
  // Mobile drawer toggle state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // All navigation routes
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-[#17191d] text-white shadow-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
        {/* Brand Logo */}
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

        {/* Desktop Navigation Links */}
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

        {/* Right Action Icons: Cart & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">

          {/* Clickable Cart Button */}
          <NavLink
            to="/cart"
            onClick={closeMobileMenu}
            aria-label={`View cart with ${cartCount} items`}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-brand-orange bg-brand-orange text-white"
                  : "border-white/20 bg-white/5 text-white hover:border-brand-orange hover:text-brand-orange"
              }`
            }
          >
            <ShoppingBag size={18} className="shrink-0" />
            <span className="hidden sm:inline">Cart</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-orange px-1.5 text-xs font-bold text-white">
              {cartCount}
            </span>
          </NavLink>

          {/* Mobile Menu Toggle Button */}
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

      {/* Mobile Dropdown Menu */}
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
          </div>
        </div>
      )}
    </header>
  );
}
