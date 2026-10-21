import { useOutletContext } from "react-router-dom";

const statuses = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Completed",
  "Cancelled",
];

export default function AdminOrders() {
  const { data, updateOrderStatus } = useOutletContext();

  return (
    <div>
      <h2 className="text-3xl font-bold">Orders</h2>
      <p className="mb-6 mt-2 text-slate-500">
        View demo orders and update their progress.
      </p>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Table</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-4 font-semibold">{order.id}</td>
                <td className="p-4">{order.customer}</td>
                <td className="p-4">{order.table}</td>
                <td className="p-4">
                  {order.items.map((item) => (
                    <div key={item.name}>
                      {item.name} × {item.quantity}
                    </div>
                  ))}
                </td>
                <td className="p-4 font-semibold">₹{order.total}</td>
                <td className="p-4">
                  <select
                    value={order.status}
                    onChange={(event) =>
                      updateOrderStatus(order.id, event.target.value)
                    }
                    className="rounded-lg border border-slate-200 bg-white p-2"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.orders.length === 0 && (
          <p className="p-8 text-center text-slate-500">No demo orders.</p>
        )}
      </div>
    </div>
  );
}