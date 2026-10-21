
import { useState, useEffect, Suspense, lazy } from "react";
import {ReceiptText,Eye,CheckCircle2,RefreshCw,Trash2,
} from "lucide-react";

import { getCustomerBills,formatCurrency, deleteCustomerBill,
} from "../utils/billingStorage";

import BillModalSkeleton from "../components/BillModalSkeleton";

// Lazy-load the detailed bill modal
const BillDetailsModal = lazy(
  () => import("../components/BillDetailsModal")
);

export default function AdminBills() {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadBills = () => {
    setLoading(true);

    try {
      const loaded = getCustomerBills();

      const paidBills = (Array.isArray(loaded) ? loaded : []).filter(
        (bill) => {
          const status = String(bill.status || "").toLowerCase();

          return (
            !status ||
            status === "paid" ||
            status === "success"
          );
        }
      );

      setBills(paidBills);
    } catch (error) {
      console.error("Failed to load customer bills:", error);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  const handleDeleteBill = (billId, e) => {
    e?.stopPropagation?.();

    if (!billId) {
      window.alert("Cannot delete bill: Bill ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove bill "${billId}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      deleteCustomerBill(billId);

      setBills((prev) =>
        prev.filter(
          (bill) => (bill.id || bill.billNumber) !== billId
        )
      );

      setSelectedBill((prev) =>
        prev &&
        (prev.id === billId || prev.billNumber === billId)
          ? null
          : prev
      );
    } catch (error) {
      console.error("Failed to delete bill:", error);
      window.alert("Failed to delete the bill. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            INVOICES &amp; BILLS
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Customer Bills
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            List of all successful bills and invoices paid by customers
            from their cart.
          </p>
        </div>

        {/* Refresh button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadBills}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={15}
              className={
                loading ? "animate-spin text-orange-500" : ""
              }
            />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Bills Table */}
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <ReceiptText size={18} className="text-orange-500" />
            <h3 className="font-bold text-slate-900">
              All Paid Bills
            </h3>
          </div>

         
        </div>

        {loading && bills.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            Loading bills...
          </div>
        ) : bills.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[550px] text-left text-sm">
              <thead className="border-b text-slate-500">
                <tr>
                  <th className="px-3 py-3">Bill ID</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Amount</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {bills.map((bill, index) => {
                  const billId = bill.id || bill.billNumber;
                  const total = Number(
                    bill.grandTotal ?? bill.total ?? 0
                  );

                  return (
                    <tr
                      key={billId || index}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      {/* Bill ID */}
                      <td className="px-3 py-3.5 font-mono font-bold text-slate-900">
                        {billId || "N/A"}
                      </td>

                      {/* Date */}
                      <td className="px-3 py-3.5 text-slate-600">
                        {bill.date || "N/A"}
                      </td>

                      {/* Amount */}
                      <td className="px-3 py-3.5 font-bold text-slate-900">
                        {formatCurrency(
                          Number.isFinite(total) ? total : 0
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2
                            size={12}
                            className="text-emerald-600"
                          />
                          {bill.status || "Paid"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedBill(bill)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-3.5 py-1.5 text-xs font-bold text-orange-600 transition hover:bg-orange-500 hover:text-white active:scale-95"
                          >
                            <Eye size={13} />
                            <span>View Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteBill(billId, e)}
                            disabled={!billId}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-500 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Delete bill"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-slate-500">
            No bills found. Paid orders from the cart will show up here.
          </div>
        )}
      </section>

      {/* Lazy-loaded Bill Details Modal */}
      {selectedBill && (
        <Suspense
          fallback={
            <BillModalSkeleton
              onClose={() => setSelectedBill(null)}
            />
          }
        >
          <BillDetailsModal
            bill={selectedBill}
            onClose={() => setSelectedBill(null)}
            onDelete={(deletedId) => {
              setBills((prev) =>
                prev.filter(
                  (bill) =>
                    (bill.id || bill.billNumber) !== deletedId
                )
              );

              setSelectedBill(null);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
