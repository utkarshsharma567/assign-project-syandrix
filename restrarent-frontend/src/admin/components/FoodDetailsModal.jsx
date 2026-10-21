
export default function FoodDetailsModal({ dish, onClose, isVegDish }) {
  if (!dish) return null;

  const ingredients = Array.isArray(dish.ingredients)
    ? dish.ingredients
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="food-detail-title"
        className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {dish.image && (
          <img
            src={dish.image}
            alt={dish.name}
            className="h-64 w-full object-cover"
          />
        )}

        <div className="space-y-4 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 id="food-detail-title" className="text-2xl font-bold">
                {dish.name}
              </h3>
              <p className="mt-1 text-slate-500">
                {dish.category} · ₹{dish.price}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className="rounded-lg border px-3 py-2 font-semibold"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {isVegDish(dish) ? "Veg" : "Non-Veg"}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1">
              {(dish.available ?? true) ? "Available" : "Unavailable"}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1">
              Spice: {dish.spiceLevel || "Not specified"}
            </span>
          </div>

          <div>
            <h4 className="font-bold">Description</h4>
            <p className="mt-1 whitespace-pre-line text-slate-600">
              {dish.description || "No description added."}
            </p>
          </div>

          <div>
            <h4 className="font-bold">Ingredients</h4>

            {ingredients.length > 0 ? (
              <ul className="mt-2 list-inside list-disc text-slate-600">
                {ingredients.map((ingredient, index) => (
                  <li key={`${ingredient}-${index}`}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-slate-500">
                No ingredients added.
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="font-bold">Preparation Time</h4>
              <p className="mt-1 text-slate-600">
                {dish.preparationTime || "Not specified"}
              </p>
            </div>

            <div>
              <h4 className="font-bold">Serving Size</h4>
              <p className="mt-1 text-slate-600">
                {dish.servingSize || "Not specified"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
