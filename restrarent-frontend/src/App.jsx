
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";


// Customer website components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartToast from "./components/CartToast";
import CreateTable from "./admin/CreateTable";


import { AuthProvider, useAuth } from "./context/AuthContext";import ProtectedRoute from "./components/ProtectedRoute";
import CustomerAuth from "./pages/CustomerAuth";
import AdminLogin from "./admin/AdminLogin";
import AdminRegister from "./admin/AdminRegister";

// Customer website pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";

// Admin dashboard pages
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminBills from "./admin/AdminBills";
import AdminBilling from "./admin/AdminBilling";
import AdminOrders from "./admin/AdminOrders";
import AdminProfileView from "./admin/AdminProfileView";
import CreateFood from "./admin/CreateFood";
import AdminProfileEdit from "./admin/AdminProfileEdit";
import AdminMenu from "./admin/AdminMenu";
import AdminCustomers from "./admin/AdminCustomers";
import AdminTables from "./admin/AdminTables";
// import ProtectedRoute from "./components/ProtectedRoute";
import EditMenuItem from "./admin/components/EditMenuItem";

// Customer website layout and cart functionality
function Layout() {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("tastepoint-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Could not load cart:", error);
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState("");
const { isCustomerAuthenticated } = useAuth();  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      localStorage.setItem(
        "tastepoint-cart",
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Could not save cart:", error);
    }
  }, [cartItems]);

  const addToCart = (dish) => {
  if (!isCustomerAuthenticated) {
  navigate("/login", {
    state: {
      from: location.pathname,
      dish,
    },
  });
  return;
}

  setCartItems((prevItems) => {
    const existingItem = prevItems.find(
      (item) => item.id === dish.id
    );

    if (existingItem) {
      return prevItems.map((item) =>
        item.id === dish.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [...prevItems, { ...dish, quantity: 1 }];
  });

  setToastMessage(`${dish.name} added to cart!`);

  setTimeout(() => {
    setToastMessage("");
  }, 2500);
};

  const increaseQuantity = (dishId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === dishId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (dishId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === dishId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (dishId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== dishId)
    );
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const clearCart = () => {
    setCartItems([]);
  };

  const cartContextValue = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <Navbar cartCount={cartCount} />

      <main className="flex-1">
        <Outlet context={cartContextValue} />
      </main>

      <Footer />

      <CartToast
        message={toastMessage}
        onClose={() => setToastMessage("")}
      />
    </div>
  );
}

// 404 page
function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="text-6xl font-black text-brand-orange">
        404
      </h1>

      <h2 className="mt-4 text-2xl font-bold text-gray-900">
        Page Not Found
      </h2>

      <p className="mt-2 text-gray-600">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-full bg-brand-orange px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-orange-600"
      >
        Return to Home
      </Link>
    </div>
  );
}

// Root application
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer website routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<CustomerAuth/>}/>
          </Route>

          {/* Public admin authentication routes */}
          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />
          <Route
            path="/admin/register"
            element={<AdminRegister />}
          />

          {/* Protected admin routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="bills" element={<AdminBills />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="billing" element={<AdminBilling />} />
              <Route path="menu" element={<AdminMenu />} />
              <Route path="menu/create" element={<CreateFood />} />
              <Route path="profile" element={<AdminProfileView />} />
              <Route
                path="profile/edit"
                element={<AdminProfileEdit />}
              />
              <Route
                path="menu/:id/edit"
                element={<EditMenuItem />}
              />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="tables" element={<AdminTables />} />
              <Route path="tables/create" element={<CreateTable />} />
            </Route>
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
