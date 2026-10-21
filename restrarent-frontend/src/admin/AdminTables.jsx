
import { useNavigate, useOutletContext } from "react-router-dom";

export default function AdminTables() {
  const navigate = useNavigate();
  const { data, toggleTableStatus } = useOutletContext();

  const available = data.tables.filter(
    (table) => table.status === "Available"
  ).length;

  return (
    <div>
      {/* Heading and Create Button */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Table Management</h2>
          <p className="mt-2 text-slate-500">
            {available} of {data.tables.length} demo tables are available.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/tables/create")}
          className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
        >
          + Create Table
        </button>
      </div>

      {/* Table Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {data.tables.map((table) => {
          const isAvailable = table.status === "Available";

          return (
            <div
              key={table.id}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">{table.name}</h3>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {table.status}
                </span>
              </div>

              <p className="mt-4 text-slate-500">
                Seating capacity: {table.seats} people
              </p>

              <button
                type="button"
                onClick={() => toggleTableStatus(table.id)}
                className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold hover:bg-slate-50"
              >
                Mark as {isAvailable ? "Occupied" : "Available"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
