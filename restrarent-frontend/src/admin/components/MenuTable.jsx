
export default function MenuTable({
  dishes,
  onView,
  onEdit,
  onDelete,
  onToggleAvailability,
}) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-bold">Food Items</h3>
        <span className="text-sm text-slate-500">
          {dishes.length} item(s)
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Dish</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Availability</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {dishes.map((dish) => (
              <tr key={dish.id} className="border-t">
                <td className="p-4">
                  {dish.image || dish.imageUrl ? (
                    <img
                      src={dish.image || dish.imageUrl}
                      alt={dish.name}
                      className="h-16 w-16 rounded-xl object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                      No image
                    </div>
                  )}
                </td>

                <td className="p-4 font-semibold">{dish.name}</td>
                <td className="p-4">{dish.category}</td>
                <td className="p-4">₹{dish.price}</td>

                <td className="p-4">
                  <button
                    type="button"
                    onClick={() => onToggleAvailability(dish)}
                    className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                      (dish.available ?? true)
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {(dish.available ?? true)
                      ? "Available"
                      : "Unavailable"}
                  </button>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onView(dish)}
                      className="font-semibold text-purple-600 hover:text-purple-800"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(dish)}
                      className="font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(dish)}
                      className="font-semibold text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {dishes.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No food items found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
