import { ArrowRight, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Hero Component
 * 
 * Displays the main hero banner on the Home page with background imagery,
 * bold headlines, social proof rating, and a call-to-action button linking to the Menu.
 */
export default function Hero() {
  return (
    <section className="relative flex min-h-[580px] items-center overflow-hidden bg-[#17191d] text-white sm:min-h-[650px]">
      {/* Background Hero Image */}
      <img
        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=85"
        alt="Atmospheric dining at TastePoint restaurant"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />

      {/* Hero Content */}
      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 lg:px-10">
        <div className="max-w-2xl">
          {/* Tagline Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
            <Utensils size={17} className="text-brand-orange" />
            <span>Good Food. Great Vibes.</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
            Delicious Food <br />
            <span className="text-brand-orange">Made for You.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
            Discover exquisite flavours, authentic recipes, fresh farm ingredients, and unforgettable dining moments at TastePoint.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/menu"
              className="inline-flex items-center gap-3 rounded-full bg-brand-orange px-8 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-600"
            >
              Explore Menu
              <ArrowRight size={19} />
            </Link>

            <Link
              to="/about"
              className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-6 py-4 font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Our Story
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-8 flex items-center gap-3 text-sm text-white/80">
            <span className="text-lg text-amber-400">★★★★★</span>
            <span>4.9 / 5 rating · Loved by 45,000+ food enthusiasts</span>
          </div>
        </div>
      </div>
    </section>
  );
}
