
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import MenuFilters from "./components/MenuFilters";
import MenuTable from "./components/MenuTable";
import FoodDetailsModal from "./components/FoodDetailsModal";

const categories = [
  "Biryani",
  "Paneer",
  "Pizza",
  "Burger",
  "Pasta",
  "Sides",
  "Dessert",
  "Drinks",
];

const foodFilters = ["All", "Veg", "Non-Veg", ...categories];

const typeCategories = ["Pizza", "Burger", "Pasta"];

const supportsFoodType = (dish) =>
  typeCategories.includes(dish.category);

const isVegDish = (dish) => {
  const type =
    dish.foodType ??
    (dish.isVegetarian === false ? "Non-Veg" : "Veg");

  return type === "Veg";
};

export default function AdminMenu() {
  const { data, updateMenuItem, deleteMenuItem } = useOutletContext();
  const navigate = useNavigate();

  const [viewDish, setViewDish] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  // Delete a food item
  const handleDelete = (dish) => {
    if (!window.confirm(`Are you sure you want to delete ${dish.name}?`)) {
      return;
    }

    deleteMenuItem(dish.id);

    if (viewDish?.id === dish.id) {
      setViewDish(null);
    }
  };

  // Toggle food availability
  const toggleAvailability = (dish) => {
    const available = !(dish.available ?? true);

    updateMenuItem(dish.id, { available });

    if (viewDish?.id === dish.id) {
      setViewDish({ ...dish, available });
    }
  };

  // Filter food items
 const filteredMenu = (data?.menu ?? []).filter((dish) => {
  if (activeFilter === "All") return true;

  if (activeFilter === "Veg") {
    return isVegDish(dish);
  }

  if (activeFilter === "Non-Veg") {
    return !isVegDish(dish);
  }

  return (
    dish.name?.toLowerCase().includes(activeFilter.toLowerCase()) ||
    dish.category?.toLowerCase() === activeFilter.toLowerCase()
  );
});

  return (
    <div className="space-y-6">
      {/* Page heading and Create Food button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Menu Management
          </h1>
          <p className="mt-2 text-slate-500">
            Manage your restaurant food items.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/menu/create")}
          className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          + Create Food
        </button>
      </div>

      {/* Food filters */}
      <MenuFilters
        filters={foodFilters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Food table */}
      <MenuTable
        dishes={filteredMenu}
        onEdit={(dish) => navigate(`/admin/menu/${dish.id}/edit`)}
        onView={setViewDish}
        onDelete={handleDelete}
        onToggleAvailability={toggleAvailability}
      />

      {/* Food details modal */}
      <FoodDetailsModal
        dish={viewDish}
        onClose={() => setViewDish(null)}
        isVegDish={isVegDish}
      />
    </div>
  );
}
