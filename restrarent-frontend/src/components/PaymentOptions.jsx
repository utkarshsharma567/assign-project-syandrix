
import { useState } from "react";
import { Banknote, Smartphone } from "lucide-react";

export default function PaymentOptions({ onConfirm }) {
  const [method, setMethod] = useState("Cash");
  const [processing, setProcessing] = useState(false);

  const handleConfirm = async () => {
    if (typeof onConfirm !== "function") {
      console.error(
        "PaymentOptions: onConfirm prop is missing or is not a function."
      );
      window.alert("Payment setup mein error hai. Please try again.");
      return;
    }

    try {
      setProcessing(true);
      await onConfirm({ method });
    } catch (error) {
      console.error("Payment confirmation error:", error);
      window.alert("Order confirm nahi ho paya. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-gray-900">
        Select Payment Method
      </h3>

      <button
        type="button"
        onClick={() => setMethod("Cash")}
        className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition ${
          method === "Cash"
            ? "border-orange-500 bg-orange-50"
            : "border-gray-200 bg-white hover:border-gray-400"
        }`}
      >
        <Banknote size={24} />
        <div className="flex-1">
          <p className="font-bold text-gray-900">Cash</p>
          <p className="text-xs text-gray-500">
            Pay at the restaurant
          </p>
        </div>
        <span
          className={`h-4 w-4 rounded-full border-2 ${
            method === "Cash"
              ? "border-orange-500 bg-orange-500"
              : "border-gray-400"
          }`}
        />
      </button>

      <button
        type="button"
        onClick={() => setMethod("UPI")}
        className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition ${
          method === "UPI"
            ? "border-orange-500 bg-orange-50"
            : "border-gray-200 bg-white hover:border-gray-400"
        }`}
      >
        <Smartphone size={24} />
        <div className="flex-1">
          <p className="font-bold text-gray-900">UPI Payment</p>
          <p className="text-xs text-gray-500">
            Pay using a UPI app
          </p>
        </div>
        <span
          className={`h-4 w-4 rounded-full border-2 ${
            method === "UPI"
              ? "border-orange-500 bg-orange-500"
              : "border-gray-400"
          }`}
        />
      </button>

      <button
        type="button"
        disabled={processing}
        onClick={handleConfirm}
        className="w-full rounded-xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {processing
          ? "Processing..."
          : method === "Cash"
            ? "Confirm Cash Order"
            : "Confirm UPI Order"}
      </button>
    </div>
  );
}
