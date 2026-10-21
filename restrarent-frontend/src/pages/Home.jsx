import Hero from "../components/Hero";
import Features from "../components/Features";
import MenuSection from "../components/MenuSection";
import { Link } from "react-router-dom";
import { ArrowRight, UtensilsCrossed } from "lucide-react";


export default function Home() {
  return (
    <div>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Key Highlights / Features */}
      <Features />

      {/* 3. Featured Dishes Menu Section */}
      <MenuSection />

      {/* 4. About Us Preview Banner */}
      <section className="bg-orange-50 px-5 py-16 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 rounded-3xl bg-brand-orange p-8 text-white sm:p-12 lg:flex-row">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-orange-200">
              <UtensilsCrossed size={18} />
              <span>About TastePoint</span>
            </div>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Fresh Food Made with Pure Passion
            </h2>
            <p className="mt-3 text-orange-100">
              We started TastePoint to share our family recipes with everyone in the city. Read our journey, discover our values, and meet the chefs behind your favourite dishes.
            </p>
          </div>

          <Link
            to="/about"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-gray-900 shadow-md transition hover:bg-gray-100"
          >
            Learn More About Us
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
