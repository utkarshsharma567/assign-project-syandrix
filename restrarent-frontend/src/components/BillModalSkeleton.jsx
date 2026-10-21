import { X } from "lucide-react";

/**
 * BillModalSkeleton Component
 * 
 * Displayed as a Suspense fallback while the heavy BillDetailsModal chunk
 * is being loaded via React.lazy code splitting.
 */
export default function BillModalSkeleton({ onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-3 sm:p-4 backdrop-blur-sm animate-pulse"
    >
      <div className="relative my-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gray-200" />
            <div>
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="mt-1 h-3 w-24 rounded bg-gray-200" />
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-400"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Body Skeleton */}
        <div className="space-y-4 p-6 sm:p-8">
          <div className="mx-auto h-8 w-48 rounded bg-gray-200" />
          <div className="mx-auto h-3 w-64 rounded bg-gray-200" />

          <div className="my-6 border-t-2 border-dashed border-gray-200" />

          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 rounded bg-gray-100" />
            <div className="h-10 rounded bg-gray-100" />
          </div>

          <div className="my-4 h-32 rounded-xl bg-gray-100" />

          <div className="ml-auto w-48 space-y-2">
            <div className="h-4 rounded bg-gray-200" />
            <div className="h-4 rounded bg-gray-200" />
            <div className="h-6 rounded bg-gray-300" />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <div className="h-10 w-24 rounded-xl bg-gray-200" />
            <div className="h-10 w-36 rounded-xl bg-orange-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
