import { useState, useEffect, Suspense, lazy } from "react";
import { useOutletContext, Link } from "react-router-dom";
import {
  ClipboardList,
  IndianRupee,
  Users,
  Utensils,
  ArrowRight,
  ReceiptText,
  Eye,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import {
  getCustomerBills,
  formatCurrency,
  deleteCustomerBill,
} from "../utils/billingStorage";
import BillModalSkeleton from "../components/BillModalSkeleton";

// Lazy-load the heavy detailed view/modal component (Requirement 4)
const BillDetailsModal = lazy(() => import("../components/BillDetailsModal"));

export default function AdminDashboard() {
  const { data } = useOutletContext();
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  // Fetch successful bills paid by the customer from their cart (Requirement 1)
  useEffect(() => {
    const loaded = getCustomerBills();
    const paidBills = loaded.filter(
      (b) => !b.status || b.status.toLowerCase() === "paid" || b.status.toLowerCase() === "success"
    );
    setBills(paidBills);
  }, []);

  

  const totalOrders = data.orders.length;

  const revenue = data.orders
    .filter((order) => order.status === "Completed")
    .reduce((sum, order) => sum + order.total, 0);

  const activeOrders = data.orders.filter(
    (order) => !["Completed", "Cancelled"].includes(order.status)
  ).length;

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ClipboardList,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Total Revenue",
      value: `₹${revenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Active Orders",
      value: activeOrders,
      icon: Utensils,
      color: "bg-orange-100 text-orange-700",
    },
    {
      label: "Paid Bills",
      value: bills.length,
      icon: ReceiptText,
      color: "bg-emerald-100 text-emerald-700",
    },
  ];

  const popularItems = data.menu
    .map((dish) => ({
      ...dish,
      quantity: data.orders.reduce(
        (sum, order) =>
          sum +
          order.items.reduce(
            (itemSum, item) =>
              itemSum + (item.name === dish.name ? item.quantity : 0),
            0
          ),
        0
      ),
    }))
    .sort((a, b) => b.quantity - a.quantity);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-orange-600">OVERVIEW</p>
        <h2 className="mt-1 text-3xl font-bold text-slate-900">
          Dashboard
        </h2>
        <p className="mt-2 text-slate-500">
          Welcome back! Here is your restaurant's activity and customer bills.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{label}</p>
              <span className={`rounded-xl p-3 ${color}`}>
                <Icon size={21} />
              </span>
            </div>
            <p className="mt-5 text-3xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      {/* =====================================================
          BILLS SECTION (Customer bills paid from cart)
          Requirements:
          1. List of successful bills/invoices paid from cart
          2. Shows Bill ID, Date, Amount, Status & "View Details"
          3. "View Details" opens breakdown modal
          4. Code Splitting & Lazy Loading (React.lazy & Suspense)
      ====================================================== */}
      

      {/* Orders and Popular Items Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold">Recent Orders</h3>
            <Link
              to="/admin/orders"
              className="flex items-center gap-1 text-sm font-semibold text-orange-600"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-b text-slate-500">
                <tr>
                  <th className="py-3">Order</th>
                  <th className="py-3">Customer</th>
                  <th className="py-3">Total</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-4 font-semibold">{order.id}</td>
                    <td className="py-4">{order.customer}</td>
                    <td className="py-4">₹{order.total}</td>
                    <td className="py-4">
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-5 text-lg font-bold">Popular Items</h3>

          <div className="space-y-5">
            {popularItems.slice(0, 5).map((dish) => (
              <div key={dish.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{dish.name}</p>
                  <p className="text-sm text-slate-500">{dish.category}</p>
                </div>
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold">
                  {dish.quantity} sold
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Lazy-Loaded Detailed View / Modal */}
      {selectedBill && (
        <Suspense
          fallback={<BillModalSkeleton onClose={() => setSelectedBill(null)} />}
        >
          <BillDetailsModal
            bill={selectedBill}
            onClose={() => setSelectedBill(null)}
            onDelete={(deletedId) => {
              setBills((prev) =>
                prev.filter(
                  (b) => (b.id || b.billNumber) !== deletedId
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
