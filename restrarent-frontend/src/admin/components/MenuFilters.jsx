
export default function MenuFilters({
  filters,
  activeFilter,
  onFilterChange,
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-bold text-slate-700">
        Filter Food
      </h3>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              activeFilter === filter
                ? "border-orange-500 bg-orange-500 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-orange-300"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
