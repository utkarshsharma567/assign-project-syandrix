




import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";


import {
  LayoutDashboard,
  ClipboardList,
  Utensils,
  Users,
  Armchair,
  Store,
  ArrowLeft,
  LogOut,
  ReceiptText,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import { initialAdminData } from "../data/adminMockData";
import AdminProfile from "./AdminProfile";


const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
  { label: "Bills", path: "/admin/bills", icon: ReceiptText },
  { label: "Orders", path: "/admin/orders", icon: ClipboardList },
  { label: "Menu", path: "/admin/menu", icon: Utensils },
  { label: "Customers", path: "/admin/customers", icon: Users },
  { label: "Tables", path: "/admin/tables", icon: Armchair },
  { label: " Reports", path: "/admin/billing", icon: ReceiptText },
];


export default function AdminLayout() {
    const navigate = useNavigate();

    


    const { user, logout } = useAuth();


const handleLogout = () => {
  logout();
  navigate("/admin/login", { replace: true });
};

    const addTable = (newTable) => {
  const table = {
    ...newTable,
    id: Date.now(),
  };

  setData((prev) => ({
    ...prev,
    tables: [...prev.tables, table],
  }));
};
 
const [data, setData] = useState(() => {
  try {
    const saved = localStorage.getItem("tastepoint-admin-data");

    if (!saved) return initialAdminData;

    const parsed = JSON.parse(saved);

    // Keep existing menu fields and restore missing images
    // from initial data when a matching dish exists.
    const menu = (parsed.menu || []).map((dish) => {
      const original = initialAdminData.menu.find(
        (item) =>
          item.name?.trim().toLowerCase() ===
          dish.name?.trim().toLowerCase()
      );

      return {
        ...original,
        ...dish,
        image:
          dish.image ||
          dish.imageUrl ||
          original?.image ||
          "",
      };
    });

    return {
      ...initialAdminData,
      ...parsed,
      menu,
    };
  } catch {
    return initialAdminData;
  }
});


  useEffect(() => {
    localStorage.setItem("tastepoint-admin-data", JSON.stringify(data));
  }, [data]);

  const updateOrderStatus = (orderId, status) => {
    setData((previous) => ({
      ...previous,
      orders: previous.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ),
    }));
  };

  const addMenuItem = (item) => {
    setData((previous) => ({
      ...previous,
      menu: [
        ...previous.menu,
        { ...item, id: Date.now(), available: item.available ?? true },
      ],
    }));
  };

  const updateMenuItem = (id, changes) => {
    setData((previous) => ({
      ...previous,
      menu: previous.menu.map((item) =>
        item.id === id ? { ...item, ...changes } : item
      ),
    }));
  };

  const deleteMenuItem = (id) => {
    setData((previous) => ({
      ...previous,
      menu: previous.menu.filter((item) => item.id !== id),
    }));
  };

  const toggleTableStatus = (id) => {
    setData((previous) => ({
      ...previous,
      tables: previous.tables.map((table) =>
        table.id === id
          ? {
              ...table,
              status:
                table.status === "Available" ? "Occupied" : "Available",
            }
          : table
      ),
    }));
  };


 

  

  return (
    <div className="min-h-screen bg-white md:flex">
      {/* White Sidebar */}
      <aside className="w-full border-b border-slate-200 bg-white p-5 md:fixed md:inset-y-0 md:left-0 md:z-40 md:w-64 md:border-b-0 md:border-r">
        <Link
          to="/admin"
          className="flex items-center gap-3 rounded-xl p-2 text-xl font-extrabold text-slate-900"
        >
          <span className="rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 p-2 text-white shadow-md shadow-orange-200">
            <Store size={23} />
          </span>
          <span>
            Taste<span className="text-orange-500">Point</span>
          </span>
        </Link>

        <div className="mb-4 mt-8 px-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible">
          {navItems.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
  `group flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
    isActive
      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20"
      : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
  }`
}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-600"
                    }`}
                  >
                    <Icon size={19} />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* <Link
          to="/"
          className="mt-8 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to website
        </Link> */}

        <div className="mt-8 hidden rounded-2xl bg-gradient-to-br from-orange-50 to-rose-50 p-4 md:block">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-500 shadow-sm">
            <Utensils size={20} />
          </div>
          <p className="font-bold text-slate-800">TastePoint Admin</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Manage your restaurant, menu and orders in one place.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="min-w-0 flex-1 bg-white md:ml-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-8">
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">
              Restaurant Admin
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Manage your restaurant dashboard
            </p>
          </div>

          <div className="flex items-center gap-3">
            
            <div className="flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-rose-500 text-xs font-bold text-white">
                A
              </span>
              <span className="text-sm font-bold text-orange-700">
                 <AdminProfile /> 
              </span>
            </div>

{/* Logout Button */}
  <button
    type="button"
    onClick={handleLogout}
    className="flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 shadow-sm transition-all duration-200 hover:border-rose-300 hover:bg-rose-50 hover:shadow-md active:scale-95"
  >
    <LogOut size={17} />
    <span>Logout</span>
  </button>

          </div>
        </header>

        <main className="min-h-[calc(100vh-73px)] bg-white p-4 sm:p-8">
          <Outlet
            context={{
              data,
              addTable,
              updateOrderStatus,
              addMenuItem,
              updateMenuItem,
              deleteMenuItem,
              toggleTableStatus,
            }}
          />
        </main>
      </div>
    </div>
  );
}





