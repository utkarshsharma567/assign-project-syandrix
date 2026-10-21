import { CheckCircle2, Award, Heart, Utensils, Users } from "lucide-react";
import { Link } from "react-router-dom";


export default function About() {
  const highlights = [
    {
      icon: Utensils,
      title: "Handcrafted Recipes",
      desc: "Every dish is cooked fresh to order using time-tested recipes and authentic spices.",
    },
    {
      icon: Heart,
      title: "Fresh & Healthy Ingredients",
      desc: "We source our vegetables, dairy, and seasonings daily from trusted local farms.",
    },
    {
      icon: Award,
      title: "Award-Winning Quality",
      desc: "Voted city-favorite for Italian and Continental dining three years in a row.",
    },
    {
      icon: Users,
      title: "Warm Hospitality",
      desc: "Whether you dine in or order to your doorstep, our team treats you like family.",
    },
  ];

  const stats = [
    { label: "Years of Experience", value: "8+" },
    { label: "Dishes Served", value: "150K+" },
    { label: "Happy Customers", value: "45K+" },
    { label: "Customer Rating", value: "4.9 ★" },
  ];

  return (
    <div className="bg-white">
      {/* 1. Header Banner */}
      <section className="relative bg-[#17191d] py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 text-center lg:px-10">
          <p className="text-sm font-bold uppercase tracking-widest text-brand-orange">
            Our Story & Passion
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            Welcome to <span className="text-brand-orange">TastePoint</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-300 sm:text-lg">
            Where great ingredients, soulful cooking, and warm memories come together at one table.
          </p>
        </div>
      </section>

      {/* 2. Story Section with Image */}
      <section className="px-5 py-16 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold text-brand-orange">
              Since 2018
            </span>
            <h2 className="mt-4 text-3xl font-black text-gray-900 sm:text-4xl">
              Serving Happiness, <br />
              One Plate at a Time
            </h2>
            <p className="mt-4 leading-relaxed text-gray-600">
              TastePoint began with a simple belief: good food has the power to bring people together. What started as a cozy neighbourhood kitchen has grown into a beloved culinary destination for families, foodies, and friends.
            </p>
            <p className="mt-3 leading-relaxed text-gray-600">
              From our crispy stone-baked pizzas to our slow-cooked creamy pastas, we never cut corners on quality. Every meal is prepared in a sparkling clean kitchen using only the freshest produce and premium ingredients.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "100% fresh, preservative-free ingredients",
                "Authentic recipes prepared by passionate chefs",
                "Strict hygiene standards and eco-friendly packaging",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <CheckCircle2 size={18} className="text-brand-orange shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/menu"
                className="rounded-full bg-brand-orange px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-orange-600"
              >
                View Our Menu
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-gray-300 px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85"
              alt="Restaurant dining atmosphere"
              className="h-[380px] w-full rounded-3xl object-cover shadow-lg sm:h-[460px]"
            />
            <div className="absolute -bottom-6 -left-4 rounded-2xl bg-white p-5 shadow-xl sm:left-6">
              <p className="text-2xl font-black text-brand-orange">100%</p>
              <p className="text-xs font-semibold text-gray-600">Pure Taste & Quality</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats Section */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s, idx) => (
              <div key={idx} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-black text-brand-orange sm:text-4xl">{s.value}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Values & Highlights */}
      <section className="px-5 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-brand-orange">
              Why People Love Us
            </p>
            <h2 className="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">
              Our Core Values
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((h, idx) => {
              const Icon = h.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-brand-orange">
                    <Icon size={26} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-gray-900">{h.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{h.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
