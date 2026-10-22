
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const AuthContext = createContext(null);

const USERS_KEY = "tastepoint-admin-users";
const AUTH_KEY = "tastepoint-admin-auth";

const CUSTOMER_USERS_KEY = "tastepoint-customer-users";
const CUSTOMER_AUTH_KEY = "tastepoint-customer-auth";

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    readStorage(AUTH_KEY, null)
  );

  const [customer, setCustomer] = useState(() =>
    readStorage(CUSTOMER_AUTH_KEY, null)
  );

  // Existing admin authentication
  const register = (name, email, password) => {
    try {
      const users = readStorage(USERS_KEY, []);
      const normalizedEmail = email.trim().toLowerCase();

      if (users.some((u) => u.email === normalizedEmail)) {
        return {
          success: false,
          message: "Email already registered.",
        };
      }

      const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: normalizedEmail,
        password,
      };

      localStorage.setItem(
        USERS_KEY,
        JSON.stringify([...users, newUser])
      );

      const authUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };

      localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
      setUser(authUser);

      return { success: true };
    } catch {
      return { success: false, message: "Registration failed." };
    }
  };

  const login = (email, password) => {
    const users = readStorage(USERS_KEY, []);
    const normalizedEmail = email.trim().toLowerCase();

    const foundUser = users.find(
      (u) =>
        u.email === normalizedEmail &&
        u.password === password
    );

    if (!foundUser) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const authUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    setUser(authUser);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  // Customer registration
  const registerCustomer = (name, email, password) => {
    try {
      const users = readStorage(CUSTOMER_USERS_KEY, []);
      const normalizedEmail = email.trim().toLowerCase();

      if (users.some((u) => u.email === normalizedEmail)) {
        return {
          success: false,
          message: "This email is already registered.",
        };
      }

      const newCustomer = {
        id: Date.now(),
        name: name.trim(),
        email: normalizedEmail,
        password,
      };

      localStorage.setItem(
        CUSTOMER_USERS_KEY,
        JSON.stringify([...users, newCustomer])
      );

      const customerData = {
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
      };

      localStorage.setItem(
        CUSTOMER_AUTH_KEY,
        JSON.stringify(customerData)
      );
      setCustomer(customerData);

      return { success: true };
    } catch {
      return {
        success: false,
        message: "Registration failed. Please try again.",
      };
    }
  };

  // Customer login
  const loginCustomer = (email, password) => {
    const users = readStorage(CUSTOMER_USERS_KEY, []);
    const normalizedEmail = email.trim().toLowerCase();

    const foundCustomer = users.find(
      (u) =>
        u.email === normalizedEmail &&
        u.password === password
    );

    if (!foundCustomer) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const customerData = {
      id: foundCustomer.id,
      name: foundCustomer.name,
      email: foundCustomer.email,
    };

    localStorage.setItem(
      CUSTOMER_AUTH_KEY,
      JSON.stringify(customerData)
    );
    setCustomer(customerData);

    return { success: true };
  };

  const logoutCustomer = () => {
  localStorage.removeItem("tastepoint-customer-auth");
  setCustomer(null);
};

  useEffect(() => {
    const syncAuth = (event) => {
      if (event.key === AUTH_KEY) {
        setUser(readStorage(AUTH_KEY, null));
      }

      if (event.key === CUSTOMER_AUTH_KEY) {
        setCustomer(readStorage(CUSTOMER_AUTH_KEY, null));
      }
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        // Admin
        user,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,

        // Customer
        customer,
        isCustomerAuthenticated: Boolean(customer),
        loginCustomer,
        registerCustomer,
        logoutCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
