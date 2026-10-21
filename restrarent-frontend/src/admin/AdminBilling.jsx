
import { useMemo, useState, Suspense, lazy } from "react";
import {
  IndianRupee,
  ReceiptText,
  Wallet,
  TrendingUp,
  Eye,
  Trash2,
} from "lucide-react";
import BillModalSkeleton from "../components/BillModalSkeleton";
import { deleteCustomerBill } from "../utils/billingStorage";

const BillDetailsModal = lazy(() => import("../components/BillDetailsModal"));

const STORAGE_KEY = "tastepoint-billing-data";

const today = new Date().toISOString().slice(0, 10);

const sampleBills = [
  {
    id: "BILL-1001",
    date: today,
    customer: "Rahul Sharma",
    items: [
      { name: "Classic Burger", quantity: 2, price: 379 },
      { name: "French Fries", quantity: 1, price: 99 },
    ],
    discount: 50,
    taxRate: 5,
    payment: "UPI",
    status: "Paid",
    refund: 0,
  },
  {
    id: "BILL-1002",
    date: today,
    customer: "Priya Patel",
    items: [{ name: "Creamy Pasta", quantity: 2, price: 199 }],
    discount: 0,
    taxRate: 5,
    payment: "Card",
    status: "Paid",
    refund: 0,
  },
  {
    id: "BILL-1003",
    date: today,
    customer: "Amit Verma",
    items: [{ name: "French Fries", quantity: 2, price: 99 }],
    discount: 0,
    taxRate: 5,
    payment: "Cash",
    status: "Refunded",
    refund: 207.9,
  },
  {
    id: "BILL-1004",
    date: today,
    customer: "Neha Singh",
    items: [{ name: "Classic Burger", quantity: 1, price: 379 }],
    discount: 0,
    taxRate: 5,
    payment: "UPI",
    status: "Voided",
    refund: 0,
  },
];

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);

function calculateBill(bill) {
  const subtotal = (bill.items || []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discount = Number(bill.discount) || 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = (taxableAmount * (Number(bill.taxRate) || 0)) / 100;
  const total = taxableAmount + tax;

  return { subtotal, discount, tax, total };
}

function readBills() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : sampleBills;
  } catch {
    return sampleBills;
  }
}

export default function AdminBilling() {
  const [bills, setBills] = useState(readBills);
  const [period, setPeriod] = useState("today");
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [selectedBill, setSelectedBill] = useState(null);

  const saveBills = (nextBills) => {
    setBills(nextBills);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBills));
  };

  const getRangeStart = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    if (period === "week") {
      date.setDate(date.getDate() - 6);
    } else if (period === "month") {
      date.setDate(date.getDate() - 29);
    } else if (period === "sixMonths") {
      date.setMonth(date.getMonth() - 6);
    } else if (period === "year") {
      date.setFullYear(date.getFullYear() - 1);
    }

    return date;
  };

  const filteredBills = useMemo(() => {
    const start = getRangeStart();

    return bills.filter((bill) => {
      const billDate = new Date(`${bill.date}T00:00:00`);
      const matchesPeriod =
        !Number.isNaN(billDate.getTime()) && billDate >= start;

      const matchesSearch = `${bill.id} ${bill.customer}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesPayment =
        paymentFilter === "All" || bill.payment === paymentFilter;

      return matchesPeriod && matchesSearch && matchesPayment;
    });
  }, [bills, period, search, paymentFilter]);

  const stats = useMemo(() => {
    const paidBills = filteredBills.filter((b) => b.status === "Paid");
    const refundedBills = filteredBills.filter(
      (b) => b.status === "Refunded"
    );

    const grossSales = paidBills.reduce(
      (sum, bill) => sum + calculateBill(bill).subtotal,
      0
    );

    const discounts = paidBills.reduce(
      (sum, bill) => sum + calculateBill(bill).discount,
      0
    );

    const tax = paidBills.reduce(
      (sum, bill) => sum + calculateBill(bill).tax,
      0
    );

    const paidTotal = paidBills.reduce(
      (sum, bill) => sum + calculateBill(bill).total,
      0
    );

    const refunds = refundedBills.reduce(
      (sum, bill) =>
        sum + (Number(bill.refund) || calculateBill(bill).total),
      0
    );

    const paymentTotals = {
      Cash: 0,
      Card: 0,
      UPI: 0,
    };

    paidBills.forEach((bill) => {
      if (paymentTotals[bill.payment] !== undefined) {
        paymentTotals[bill.payment] += calculateBill(bill).total;
      }
    });

    return {
      grossSales,
      discounts,
      tax,
      paidTotal,
      refunds,
      paidCount: paidBills.length,
      netSales: paidTotal - refunds,
      paymentTotals,
    };
  }, [filteredBills]);

  const changeStatus = (billId, status) => {
    const nextBills = bills.map((bill) =>
      bill.id === billId
        ? {
            ...bill,
            status,
            refund:
              status === "Refunded"
                ? calculateBill(bill).total
                : bill.refund,
          }
        : bill
    );

    saveBills(nextBills);
  };

  const deleteBill = (billId) => {
    if (
      window.confirm(
        `Are you sure you want to delete bill "${billId}"? It will be removed permanently from both the UI and localStorage.`
      )
    ) {
      const nextBills = bills.filter((b) => b.id !== billId);
      saveBills(nextBills);
      deleteCustomerBill(billId);
      if (selectedBill && selectedBill.id === billId) {
        setSelectedBill(null);
      }
    }
  };

  const cards = [
    {
      title: "Gross Sales",
      value: money(stats.grossSales),
      icon: IndianRupee,
      color: "text-emerald-600",
    },
    {
      title: "Paid Bills",
      value: stats.paidCount,
      icon: ReceiptText,
      color: "text-blue-600",
    },
    {
      title: "Net Sales After Refunds",
      value: money(stats.netSales),
      icon: Wallet,
      color: "text-violet-600",
    },
    {
      title: "Net Sales",
      value: money(stats.netSales),
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 text-gray-800 sm:p-6">
      {/* Page heading and date filter */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Billing &amp; Financial Reports
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage bills, payments and financial reports.
          </p>
        </div>

        <div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl border bg-white px-3 py-2 text-sm"
            aria-label="Select billing period"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="sixMonths">Last 6 months</option>
            <option value="year">Last 1 year</option>
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{card.title}</p>
                <Icon size={20} className={card.color} />
              </div>
              <p className="mt-3 break-words text-2xl font-bold">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Sales breakdown and payment methods */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-white p-5">
          <h2 className="text-lg font-bold">Sales Breakdown</h2>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Gross item subtotal</span>
              <span className="font-medium">{money(stats.grossSales)}</span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Discounts</span>
              <span className="font-medium">
                − {money(stats.discounts)}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Tax collected (calculated)</span>
              <span className="font-medium">{money(stats.tax)}</span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Refunds</span>
              <span className="font-medium text-red-600">
                − {money(stats.refunds)}
              </span>
            </div>

            <div className="flex justify-between border-t pt-3">
              <span className="font-semibold">Net sales</span>
              <span className="font-bold">{money(stats.netSales)}</span>
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-400">
            Net sales are calculated from paid bills minus recorded refunds.
            Business expenses and food costs are not included.
          </p>
        </section>

        <section className="rounded-2xl border bg-white p-5">
          <h2 className="text-lg font-bold">Payment Methods</h2>

          <div className="mt-4 space-y-4">
            {Object.entries(stats.paymentTotals).map(([method, amount]) => (
              <div key={method}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{method}</span>
                  <span className="font-semibold">{money(amount)}</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-orange-500"
                    style={{
                      width: `${
                        stats.paidTotal > 0
                          ? Math.min(
                              100,
                              (amount / stats.paidTotal) * 100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bill and transaction records */}
      <section className="overflow-hidden rounded-2xl border bg-white">
        <div className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold">
              Bill &amp; Transaction Records
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredBills.length} records in selected period
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bill or customer"
              aria-label="Search bill or customer"
              className="min-w-0 rounded-lg border px-3 py-2 text-sm"
            />

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm"
              aria-label="Filter by payment method"
            >
              <option>All</option>
              <option>Cash</option>
              <option>Card</option>
              <option>UPI</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3">Bill / Date</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Subtotal</th>
                <th className="px-5 py-3">Discount</th>
                <th className="px-5 py-3">Tax</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredBills.map((bill) => {
                const totals = calculateBill(bill);

                return (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold">{bill.id}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {bill.date}
                      </p>
                    </td>

                    <td className="px-5 py-4">{bill.customer}</td>
                    <td className="px-5 py-4">{money(totals.subtotal)}</td>
                    <td className="px-5 py-4">{money(totals.discount)}</td>
                    <td className="px-5 py-4">{money(totals.tax)}</td>
                    <td className="px-5 py-4 font-semibold">
                      {money(totals.total)}
                    </td>
                    <td className="px-5 py-4">{bill.payment}</td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          bill.status === "Paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : bill.status === "Refunded"
                              ? "bg-red-50 text-red-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {bill.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedBill(bill)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                        >
                          <Eye size={12} />
                          <span>View Details</span>
                        </button>

                        {bill.status === "Paid" && (
                          <>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => {
                                if (
                                  window.confirm("Refund this entire bill?")
                                ) {
                                  changeStatus(bill.id, "Refunded");
                                }
                              }}
                              className="text-xs font-medium text-red-600 hover:underline"
                            >
                              Refund
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm("Void this bill?")) {
                                  changeStatus(bill.id, "Voided");
                                }
                              }}
                              className="text-xs font-medium text-gray-600 hover:underline"
                            >
                              Void
                            </button>
                          </>
                        )}

                        <span className="text-gray-300">|</span>
                        <button
                          type="button"
                          onClick={() => deleteBill(bill.id)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
                          title="Delete bill from UI and localStorage"
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredBills.length === 0 && (
                <tr>
                  <td
                    colSpan="9"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No billing records found for these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Lazy-Loaded Bill Breakdown Modal */}
      {selectedBill && (
        <Suspense fallback={<BillModalSkeleton onClose={() => setSelectedBill(null)} />}>
          <BillDetailsModal
            bill={{
              ...selectedBill,
              billNumber: selectedBill.id,
              grandTotal: calculateBill(selectedBill).total,
              subtotal: calculateBill(selectedBill).subtotal,
              discount: calculateBill(selectedBill).discount,
              paymentMethod: selectedBill.payment || "UPI",
            }}
            onClose={() => setSelectedBill(null)}
            onDelete={(id) => deleteBill(id)}
          />
        </Suspense>
      )}
    </div>
  );
}
