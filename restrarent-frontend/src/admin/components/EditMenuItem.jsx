
import { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import MenuForm from "../components/MenuForm";

export default function EditMenuItem() {
  const { data, updateMenuItem } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const dish = (data?.menu ?? []).find(
    (item) => String(item.id) === String(id)
  );

  if (!dish) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">
          Food item not found
        </h1>
        <button
          onClick={() => navigate("/admin/menu")}
          className="mt-4 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const handleUpdateFood = (formData) => {
    if (saving) return;

    const name = formData.name.trim();
    const price = Number(formData.price);

    if (!name || !formData.category || !Number.isFinite(price) || price <= 0) {
      alert("Please enter a food name, category and a price greater than zero.");
      return;
    }

    const updatedFood = {
      ...formData,
      name,
      price,
      ingredients: String(formData.ingredients ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      preparationTime: formData.preparationTime ?? "",
      servingSize: formData.servingSize ?? "",
      spiceLevel: formData.spiceLevel || "Mild",
      foodType: formData.foodType || (
        dish.isVegetarian === false ? "Non-Veg" : "Veg"
      ),
      isVegetarian: (formData.foodType || (
        dish.isVegetarian === false ? "Non-Veg" : "Veg"
      )) === "Veg",
      available: formData.available ?? dish.available ?? true,
    };

    try {
      setSaving(true);
      updateMenuItem(dish.id, updatedFood);
      navigate("/admin/menu");
    } catch (error) {
      console.error("Failed to update food:", error);
      alert("Food item could not be updated.");
      setSaving(false);
    }
  };

  const initialData = {
    ...dish,
    ingredients: Array.isArray(dish.ingredients)
      ? dish.ingredients.join(", ")
      : dish.ingredients ?? "",
    foodType: dish.foodType || (
      dish.isVegetarian === false ? "Non-Veg" : "Veg"
    ),
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
          Edit Food Item
        </h1>
        <p className="mt-2 text-slate-500">
          Update details for {dish.name}.
        </p>
      </div>

      <MenuForm
        key={dish.id}
        initialData={initialData}
        onSubmit={handleUpdateFood}
        onCancel={() => navigate("/admin/menu")}
        submitText={saving ? "Saving..." : "Save Changes"}
      />
    </div>
  );
}
