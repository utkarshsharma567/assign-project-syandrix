import { ChefHat, Phone, MapPin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Footer Component
 * 
 * Provides:
 * - Restaurant branding
 * - Quick navigation links (Home, Menu, About, Contact, Cart)
 * - Basic contact details
 * - Copyright note
 */
export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#17191d] text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Brand Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-extrabold">
              <ChefHat className="text-brand-orange" size={30} />
              <span>
                Taste<span className="text-brand-orange">Point</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Freshly crafted dishes, authentic recipes, and warm hospitality. Dedicated to bringing you unforgettable culinary moments.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/" className="transition hover:text-brand-orange">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="transition hover:text-brand-orange">
                  Menu & Ordering
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition hover:text-brand-orange">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-brand-orange">
                  Contact & Reservations
                </Link>
              </li>
              <li>
                <Link to="/cart" className="transition hover:text-brand-orange">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Opening Hours */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Opening Hours
            </h4>
            <div className="mt-4 space-y-2 text-sm text-gray-400">
              <p>
                <span className="font-semibold text-white">Mon – Fri:</span> 11:00 AM – 11:00 PM
              </p>
              <p>
                <span className="font-semibold text-white">Sat – Sun:</span> 10:30 AM – 11:30 PM
              </p>
              <p className="mt-2 text-xs text-brand-orange">
                ★ Dine-In & Home Delivery Available
              </p>
            </div>
          </div>

          {/* 4. Contact Us Quick Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Reach Us
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2.5">
                <MapPin size={16} className="text-brand-orange shrink-0" />
                <span>123 Foodie Ave, Connaught Place, New Delhi</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-brand-orange shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-brand-orange shrink-0" />
                <span>hello@tastepoint.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} TastePoint Restaurant. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
