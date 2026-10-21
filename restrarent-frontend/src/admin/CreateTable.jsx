
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function CreateTable() {
  const navigate = useNavigate();
  const { addTable } = useOutletContext();



  
  const [form, setForm] = useState({
    name: "",
    seats: "4",
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || Number(form.seats) < 1) {
      alert("Please enter a table name and valid seating capacity.");
      return;
    }

    addTable({
      name: form.name.trim(),
      seats: Number(form.seats),
      status: "Available",
    });

    navigate("/admin/tables");
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <button
        type="button"
        onClick={() => navigate("/admin/tables")}
        className="mb-5 text-sm font-semibold text-orange-600 hover:underline"
      >
        ← Back to Tables
      </button>

      <h2 className="text-3xl font-bold">Create New Table</h2>
      <p className="mb-6 mt-2 text-slate-500">
        Add a table and set its seating capacity.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block font-medium">Table Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Table 7"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Seating Capacity
          </label>
          <input
            type="number"
            min="1"
            required
            value={form.seats}
            onChange={(e) =>
              setForm({ ...form, seats: e.target.value })
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/admin/tables")}
            className="rounded-xl border border-slate-200 px-5 py-3 font-semibold"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex-1 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Create Table
          </button>
        </div>
      </form>
    </div>
  );
}
