
import { useEffect, useState } from "react";

function MenuForm({
  initialData = {},
  onSubmit,
  onCancel,
  submitText = "Save Food",
}) {
  

  const [imageError, setImageError] = useState("");

  const [formData, setFormData] = useState(() => ({
  name: initialData.name || "",
  category: initialData.category || "",
  price: initialData.price ?? "",
  description: initialData.description || "",
  image: initialData.image || "",
  available: initialData.available ?? true,

  ingredients: Array.isArray(initialData.ingredients)
    ? initialData.ingredients.join(", ")
    : initialData.ingredients || "",

  preparationTime: initialData.preparationTime || "",
  servingSize: initialData.servingSize || "",
  spiceLevel: initialData.spiceLevel || "Mild",
  foodType: initialData.foodType ||
    (initialData.isVegetarian === false ? "Non-Veg" : "Veg"),
}));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    setImageError("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
  setImageError("Image size must be 4 MB or less.");
  e.target.value = "";
  return;
}

    const reader = new FileReader();

    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };

    reader.onerror = () => {
      setImageError("Unable to read this image.");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.category || formData.price === "") {
      return;
    }

    if (Number(formData.price) < 0 || !Number.isFinite(Number(formData.price))) {
      return;
    }

    onSubmit?.({
      ...formData,
      name: formData.name.trim(),
      price: Number(formData.price),
    });
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl bg-white p-6 shadow-sm"
    >
      <div>
        <h3 className="text-xl font-bold text-slate-800">
          Food Information
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Enter the details of your food item.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="font-medium text-slate-700">
            Food Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Margherita Pizza"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="font-medium text-slate-700">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Select category</option>
            <option value="Pizza">Pizza</option>
            <option value="Burger">Burger</option>
            <option value="Pasta">Pasta</option>
            <option value="Indian">Indian</option>
            <option value="Chinese">Chinese</option>
            <option value="Dessert">Dessert</option>
            <option value="Beverages">Beverages</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="font-medium text-slate-700">
            Price (₹) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g. 299"
            min="0"
            step="0.01"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="font-medium text-slate-700">
            Food Image
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-orange-50 file:px-3 file:py-2 file:font-medium file:text-orange-600`}
          />
         <p className="mt-1 text-xs text-slate-500">
  Maximum image size: 4 MB. JPG, PNG, or WebP recommended.
</p>
          {imageError && (
            <p className="mt-2 text-sm text-red-600">
              {imageError}
            </p>
          )}
        </div>
      </div>

      {formData.image && (
        <div>
          <p className="mb-2 font-medium text-slate-700">
            Image Preview
          </p>
          <img
            src={formData.image}
            alt="Food preview"
            className="h-36 w-36 rounded-xl border border-slate-200 object-cover"
          />
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, image: "" }))
            }
            className="mt-2 block text-sm font-medium text-red-600 hover:text-red-700"
          >
            Remove Image
          </button>
        </div>
      )}

      <div>
        <label className="font-medium text-slate-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your food item..."
          rows={4}
          className={inputClass}
        />
      </div>


      
{/* Ingredients */}
<div>
  <label className="font-medium text-slate-700">
    Ingredients
  </label>
  <textarea
    name="ingredients"
    value={formData.ingredients || ""}
    onChange={handleChange}
    placeholder="Pizza dough, Tomato sauce, Mozzarella cheese"
    rows={3}
    className={inputClass}
  />
  <p className="mt-1 text-xs text-slate-500">
    Separate each ingredient with a comma.
  </p>
</div>

<div className="grid gap-5 md:grid-cols-2">
  {/* Preparation Time */}
  <div>
    <label className="font-medium text-slate-700">
      Preparation Time
    </label>
    <input
      type="text"
      name="preparationTime"
      value={formData.preparationTime || ""}
      onChange={handleChange}
      placeholder="15-20 minutes"
      className={inputClass}
    />
  </div>

  {/* Serving Size */}
  <div>
    <label className="font-medium text-slate-700">
      Serving Size
    </label>
    <input
      type="text"
      name="servingSize"
      value={formData.servingSize || ""}
      onChange={handleChange}
      placeholder="1 medium pizza"
      className={inputClass}
    />
  </div>

  {/* Spice Level */}
  <div>
    <label className="font-medium text-slate-700">
      Spice Level
    </label>
    <select
      name="spiceLevel"
      value={formData.spiceLevel || "Mild"}
      onChange={handleChange}
      className={inputClass}
    >
      <option value="Mild">Mild</option>
      <option value="Medium">Medium</option>
      <option value="Hot">Hot</option>
      <option value="Extra Hot">Extra Hot</option>
    </select>
  </div>

  {/* Food Type */}
  <div>
    <label className="font-medium text-slate-700">
      Food Type
    </label>
    <select
      name="foodType"
      value={formData.foodType || "Veg"}
      onChange={handleChange}
      className={inputClass}
    >
      <option value="Veg">Veg</option>
      <option value="Non-Veg">Non-Veg</option>
    </select>
  </div>
</div>


      <label className="flex items-center gap-3 text-slate-700">
        <input
          type="checkbox"
          name="available"
          checked={formData.available}
          onChange={handleChange}
          className="h-4 w-4 accent-orange-500"
        />
        Food is available for ordering
      </label>

      <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}

export default MenuForm;
