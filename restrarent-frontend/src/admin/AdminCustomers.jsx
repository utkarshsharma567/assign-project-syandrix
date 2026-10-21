
import { useOutletContext } from "react-router-dom";

export default function AdminCustomers() {
  const { data, removeCustomer } = useOutletContext();

  const handleRemove = (customer) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${customer.name}?`
    );

    if (confirmed) {
      removeCustomer(customer.id);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold">Customers</h2>

      <p className="mb-6 mt-2 text-slate-500">
        Manage customer records and remove completed customer accounts.
      </p>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-4">Customer ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Phone (masked)</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.customers.length > 0 ? (
              data.customers.map((customer) => (
                <tr key={customer.id} className="border-t">
                  <td className="p-4">CUS-{customer.id}</td>

                  <td className="p-4 font-semibold">
                    {customer.name}
                  </td>

                  <td className="p-4">{customer.phone}</td>

                  <td className="p-4">{customer.orders}</td>

                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => handleRemove(customer)}
                      className="rounded-lg bg-red-50 px-4 py-2 font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-slate-500"
                >
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        All customer records are fictional demo data.
      </p>
    </div>
  );
}
