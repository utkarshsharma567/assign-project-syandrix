
import { useState } from "react";

const STORAGE_KEY = "tastepoint_admin_details";

const defaultDetails = {
  name: "Admin",
  email: "",
  phone: "",
  restaurantName: "TastePoint",
  address: "",
};

export function getAdminDetails() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? { ...defaultDetails, ...JSON.parse(saved) }
      : defaultDetails;
  } catch {
    return defaultDetails;
  }
}

export default function AdminProfileForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState({ ...initialData });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const fields = [
    { name: "name", label: "Admin Name", required: true },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone Number", type: "tel" },
    { name: "restaurantName", label: "Restaurant Name", required: true },
    { name: "address", label: "Restaurant Address" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl bg-white p-6 shadow-sm"
    >
      {fields.map((field) => (
        <div key={field.name}>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            {field.label}
          </label>
          <input
            name={field.name}
            type={field.type || "text"}
            required={field.required || false}
            value={form[field.name] || ""}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
          />
        </div>
      ))}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border px-5 py-3 font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
