import { useState } from "react";
import { Star, Plus } from "lucide-react";
import { dishes } from "../data/menu";
import { useCart } from "../hooks/useCart";


export default function MenuSection() {
  // Get the addToCart function directly from our cart hook
  const { addToCart } = useCart();

  // Selected category filter (default is "All")
  const [selectedCategory, setSelectedCategory] = useState("All");

  // List of all unique categories + "All" option
  const categories = ["All", "Pizza", "Pasta", "Burgers", "Sides", "Desserts"];

  // Filter dishes based on the selected category
  const filteredDishes =
    selectedCategory === "All"
      ? dishes
      : dishes.filter((dish) => dish.category === selectedCategory);

  return (
    <section id="menu" className="bg-gray-50 px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-orange">
            Fresh & Delicious
          </p>
          <h2 className="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">
            Explore Our Menu
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Handcrafted dishes prepared with fresh ingredients, authentic recipes, and love.
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-brand-orange text-white shadow-md shadow-orange-500/20"
                    : "bg-white text-gray-700 hover:bg-orange-50 hover:text-brand-orange"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Food Items Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Dish Image */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <img
                  src={dish.image}
                  alt={dish.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
                {/* Category tag */}
                <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {dish.category}
                </span>
                {/* Rating badge */}
                {dish.rating && (
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-gray-800 backdrop-blur-sm">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span>{dish.rating}</span>
                  </div>
                )}
              </div>

              {/* Dish Details */}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {dish.name}
                  </h3>
                  <span className="text-lg font-extrabold text-brand-orange">
                    ₹{dish.price}
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 flex-1 text-sm text-gray-600">
                  {dish.description}
                </p>

                {/* Add to Cart button */}
                <button
                  type="button"
                  onClick={() => addToCart(dish)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600 active:scale-95"
                >
                  <Plus size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
