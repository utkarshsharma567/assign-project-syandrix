
import { useState, useEffect } from "react";
import {
  X,
  Receipt,
  CheckCircle2,
  ChefHat,
  Trash2,
} from "lucide-react";
import { formatCurrency, deleteCustomerBill } from "../utils/billingStorage";

/**
 * BillDetailsModal Component
 *
 * Displays a detailed breakdown of a specific bill/invoice.
 */
export default function BillDetailsModal({ bill, onClose, onDelete }) {
  const [copied, setCopied] = useState(false);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!bill) return null;

  // Extract totals with fallbacks
  const subtotal =
    Number(bill.subtotal) ||
    (bill.items || []).reduce(
      (sum, item) =>
        sum +
        Number(item.price || item.amount || 0) *
          Number(item.quantity || item.qty || 1),
      0
    );

  const sgst = Number(bill.sgst) || Math.round(subtotal * 0.025);
  const cgst = Number(bill.cgst) || Math.round(subtotal * 0.025);
  const discount = Number(bill.discount) || 0;

  const grandTotal =
    Number(bill.grandTotal) || subtotal + sgst + cgst - discount;

  // Copy Bill ID
  const handleCopyId = async () => {
    const idToCopy = bill.id || bill.billNumber || "";

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(idToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Could not copy Bill ID:", error);
    }
  };

  const handleDelete = () => {
    const idToDelete = bill.id || bill.billNumber;
    if (
      window.confirm(
        `Are you sure you want to remove bill "${idToDelete}"? It will be deleted permanently from both the UI and localStorage.`
      )
    ) {
      deleteCustomerBill(idToDelete);
      onDelete?.(idToDelete);
      onClose?.();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bill-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm transition-opacity sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Bar */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-orange-50 via-white to-amber-50 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm shadow-orange-300">
              <Receipt size={18} />
            </span>

            <div>
              <h2
                id="bill-modal-title"
                className="text-base font-bold text-gray-900 sm:text-lg"
              >
                Invoice Breakdown
              </h2>

              <p className="text-xs text-gray-500">
                Bill ID:{" "}
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="font-mono font-semibold text-orange-600 hover:underline"
                  title="Click to copy Bill ID"
                >
                  {bill.id || bill.billNumber || "N/A"}
                </button>

                {copied && (
                  <span className="ml-1 text-[11px] font-medium text-emerald-600">
                    Copied!
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white active:scale-95"
              title="Delete bill from UI and localStorage"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>

            {/* Top-right Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:border-gray-300 hover:bg-gray-100 active:scale-95"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Area */}
        <div className="max-h-[75vh] overflow-y-auto p-5 sm:p-7">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            {/* Restaurant Brand Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-xl font-extrabold tracking-tight text-gray-900">
                <ChefHat size={26} className="text-orange-500" />

                <span>
                  Taste<span className="text-orange-500">Point</span>{" "}
                  Restaurant
                </span>
              </div>

              <p className="mt-1 text-xs text-gray-600">
                123 Food Street, Connaught Place, New Delhi - 110001
              </p>

              <p className="text-xs text-gray-600">
                Phone: +91 98765 43210 • Email: tastepoint@example.com
              </p>

              <p className="text-xs font-semibold text-gray-700">
                GSTIN: 23AABCU9603R1ZM
              </p>

              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>TAX INVOICE • PAID</span>
              </div>
            </div>

            <div className="my-4 border-t-2 border-dashed border-gray-200" />

            {/* Bill Metadata */}
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div>
                <p className="text-gray-500">Invoice / Bill ID</p>
                <p className="font-mono font-bold text-gray-900">
                  {bill.id || bill.billNumber || "N/A"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-gray-500">Table / Mode</p>
                <p className="font-bold text-gray-900">
                  {bill.tableNumber || "T-01 (Dine-In)"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Date &amp; Time</p>
                <p className="font-medium text-gray-800">
                  {bill.date || "N/A"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-gray-500">Payment Status</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 size={12} />
                  {bill.status || "Paid"}
                </span>
              </div>
            </div>

            <div className="my-4 border-t border-gray-200" />

            {/* Ordered Items Table */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                Ordered Items Breakdown
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-gray-300 text-gray-600">
                      <th className="py-2 pr-2">Dish Item</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Price</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {(bill.items || []).map((item, idx) => {
                      const itemPrice = Number(
                        item.price || item.amount || 0
                      );
                      const itemQty = Number(
                        item.quantity || item.qty || 1
                      );

                      return (
                        <tr
                          key={item.id ?? idx}
                          className="hover:bg-gray-50/50"
                        >
                          <td className="py-2.5 pr-2 font-medium text-gray-900">
                            <div className="flex items-center gap-2">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name || item.title || "Food item"}
                                  className="h-8 w-8 rounded-lg object-cover sm:h-9 sm:w-9"
                                />
                              )}

                              <span>
                                {item.name || item.title || "Food Item"}
                              </span>
                            </div>
                          </td>

                          <td className="py-2.5 text-center text-gray-600">
                            {itemQty}
                          </td>

                          <td className="py-2.5 text-right text-gray-600">
                            {formatCurrency(itemPrice)}
                          </td>

                          <td className="py-2.5 text-right font-semibold text-gray-900">
                            {formatCurrency(itemPrice * itemQty)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="my-4 border-t border-gray-200" />

            {/* Financial Summary */}
            <div className="ml-auto max-w-xs space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>SGST (2.5%)</span>
                <span>{formatCurrency(sgst)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>CGST (2.5%)</span>
                <span>{formatCurrency(cgst)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between font-medium text-emerald-600">
                  <span>Discount</span>
                  <span>− {formatCurrency(discount)}</span>
                </div>
              )}

              <div className="border-t-2 border-gray-900 pt-2 text-sm sm:text-base">
                <div className="flex justify-between font-black text-gray-900">
                  <span>Grand Total</span>
                  <span className="text-orange-600">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            <div className="my-4 border-t-2 border-dashed border-gray-200" />

            {/* Payment Mode Information */}
            <div className="rounded-xl bg-gray-50 p-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-gray-700">
                  Payment Mode:
                </span>

                <span className="text-right font-bold text-gray-900">
                  {bill.paymentMethod || "UPI Payment"}
                </span>
              </div>

              {bill.transactionId && (
                <div className="mt-1 flex items-center justify-between gap-3 text-gray-500">
                  <span>Transaction Ref:</span>

                  <span className="break-all text-right font-mono">
                    {bill.transactionId}
                  </span>
                </div>
              )}
            </div>

            <p className="mt-4 text-center text-[10px] text-gray-400">
              This is a computer-generated receipt for your TastePoint order.
            </p>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/80 px-5 py-3.5 sm:px-6">
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white active:scale-95 shadow-sm"
          >
            <Trash2 size={14} />
            <span>Delete Bill</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-100 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
