import { useState } from "react";
import { Star, Plus } from "lucide-react";
import { dishes } from "../data/menu";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MenuSection() {
  // Get the addToCart function directly from our cart hook
  const { addToCart } = useCart();
  const { isCustomerAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Selected filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  // List of all unique categories + All option
  const categories = ["All", "Pizza", "Pasta", "Burgers", "Sides", "Desserts"];

  // Filter dishes based on BOTH category and food type (Veg/Non-Veg)
  const filteredDishes = dishes.filter((dish) => {
    // 1. Category Filter Check
    const matchesCategory =
      selectedCategory === "All" || dish.category === selectedCategory;

    // 2. Veg/Non-Veg Filter Check
    const foodType =
      dish.foodType ?? (dish.isVegetarian === false ? "Non-Veg" : "Veg");
    const matchesType = selectedType === "All" || foodType === selectedType;

    return matchesCategory && matchesType;
  });

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
            Handcrafted dishes prepared with fresh ingredients, authentic
            recipes, and love.
          </p>
        </div>

        {/* 1. Category Filter Buttons (Pizza, Pasta, etc.) */}
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

        {/* 2. Veg / Non-Veg Filters (Just below categories) */}
        <div className="mt-4 flex justify-center gap-3">
          {/* Veg Button */}
          <button
            type="button"
            onClick={() =>
              setSelectedType(selectedType === "Veg" ? "All" : "Veg")
            }
            className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
              selectedType === "Veg"
                ? "border-green-600 bg-green-50 text-green-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm border border-green-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
            </span>
            Veg
          </button>

          {/* Non-Veg Button */}
          <button
            type="button"
            onClick={() =>
              setSelectedType(selectedType === "Non-Veg" ? "All" : "Non-Veg")
            }
            className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
              selectedType === "Non-Veg"
                ? "border-red-600 bg-red-50 text-red-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm border border-red-600">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
            </span>
            Non-Veg
          </button>
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
                {/* Category tag - Top Left */}
                <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {dish.category}
                </span>
                {/* Rating badge - Top Right */}
                {dish.rating && (
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-gray-800 backdrop-blur-sm">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span>{dish.rating}</span>
                  </div>
                )}
                {/* Veg / Non-Veg badge - Bottom Right */}
                {(() => {
                  const foodType =
                    dish.foodType ??
                    (dish.isVegetarian === false ? "Non-Veg" : "Veg");
                  const isVeg = foodType === "Veg";
                  return (
                    <div
className={`absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1.5 shadow-none backdrop-blur-none ${                        isVeg ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {/* Food type indicator */}
                      <span
                        className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border ${
                          isVeg ? "border-green-600" : "border-red-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isVeg ? "bg-green-600" : "bg-red-600"
                          }`}
                        />
                      </span>
                      {/* <span className="text-xs font-bold">{foodType}</span> */}
                    </div>
                  );
                })()}
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
                  onClick={() => {
                    if (!isCustomerAuthenticated) {
                      navigate("/login", {
                        state: {
                          from: "/cart",
                          dish,
                        },
                      });
                      return;
                    }

                    addToCart(dish);
                  }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600 active:scale-95"
                >
                  <Plus size={16} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
