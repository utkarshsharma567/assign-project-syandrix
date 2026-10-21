import { Check, X } from "lucide-react";

/**
 * CartToast Component
 * 
 * Displays a temporary popup notification when an item is added to the cart.
 * 
 * Props:
 * - message: String message to display (e.g., "Margherita Pizza added to cart!").
 * - onClose: Callback function when the user clicks the dismiss 'X' button.
 */
export default function CartToast({ message, onClose }) {
  // If there is no active message, don't render anything
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-xl ring-1 ring-black/5 transition-all duration-300"
    >
      {/* Success icon badge */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
        <Check size={18} />
      </div>

      {/* Message content */}
      <div className="flex-1 text-sm font-medium text-gray-900">
        {message}
      </div>

      {/* Dismiss button */}
      <button
        onClick={onClose}
        aria-label="Close notification"
        className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
      >
        <X size={16} />
      </button>
    </div>
  );
}
