import { Zap, ShieldCheck, Leaf, Star } from "lucide-react";

/**
 * Features Component
 * 
 * Displays 4 core selling points of the restaurant:
 * - Quick Ordering
 * - Quality Assured
 * - Fresh Ingredients
 * - Made with Care
 */
const features = [
  {
    Icon: Zap,
    title: "Quick Ordering",
    description: "Fast, convenient online ordering directly from your table or couch.",
  },
  {
    Icon: ShieldCheck,
    title: "Quality Assured",
    description: "Prepared in a sparkling hygienic kitchen adhering to the highest food safety standards.",
  },
  {
    Icon: Leaf,
    title: "Fresh Ingredients",
    description: "Locally sourced organic produce and farm-fresh dairy in every single dish.",
  },
  {
    Icon: Star,
    title: "Made with Care",
    description: "Master chefs crafting each recipe with culinary passion and perfection.",
  },
];

export default function Features() {
  return (
    <section className="bg-white px-5 py-14 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ Icon, title, description }) => (
          <div
            key={title}
            className="rounded-2xl border border-gray-100 p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-brand-orange">
              <Icon size={26} />
            </div>

            <h3 className="mt-4 text-base font-bold text-gray-900">
              {title}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
