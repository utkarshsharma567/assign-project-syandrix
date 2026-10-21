
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import MenuForm from "./components/MenuForm";

export default function CreateFood() {
  const { addMenuItem } = useOutletContext();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleCreateFood = (formData) => {
    if (saving) return;

    const name = formData.name.trim();
    const price = Number(formData.price);

    if (!name || !formData.category || !Number.isFinite(price) || price <= 0) {
      alert("Please enter a food name, category and a price greater than zero.");
      return;
    }

    if (typeof addMenuItem !== "function") {
      alert("addMenuItem is not available. Please check AdminLayout.jsx.");
      console.error("addMenuItem is missing from Outlet context.");
      return;
    }

  const newFood = {
  ...formData,
  id: Date.now(),
  name: formData.name.trim(),
  price: Number(formData.price),

  ingredients: String(formData.ingredients || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),

  preparationTime: formData.preparationTime || "",
  servingSize: formData.servingSize || "",
  spiceLevel: formData.spiceLevel || "Mild",

  foodType: formData.foodType || "Veg",
  isVegetarian: (formData.foodType || "Veg") === "Veg",
  available: formData.available ?? true,
};

    try {
      setSaving(true);

      addMenuItem(newFood);

      navigate("/admin/menu");
    } catch (error) {
      console.error("Failed to create food:", error);
      alert("Food could not be saved. Check the browser console.");
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate("/admin/menu")}
          className="mb-4 font-medium text-orange-600 hover:text-orange-700"
        >
          ← Back to Menu
        </button>

        <h1 className="text-3xl font-bold text-slate-800">
          Create Food
        </h1>

        <p className="mt-2 text-slate-500">
          Add a new food item to your restaurant menu.
        </p>
      </div>

      <MenuForm
        onSubmit={handleCreateFood}
        onCancel={() => navigate("/admin/menu")}
        submitText={saving ? "Saving..." : "Create Food"}
      />
    </div>
  );
}
