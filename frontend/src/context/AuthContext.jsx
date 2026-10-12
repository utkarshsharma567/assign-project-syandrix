import { createContext, useContext, useEffect, useState,} from "react";

import toast from "react-hot-toast";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check logged-in user
  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/me");

      setUser(response.data.user);
    } catch (error) {
      console.log(
        "Auth check error:",
        error.response?.data || error.message
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Run only once when app starts
  useEffect(() => {
    checkAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      setUser(response.data.user);

      toast.success("Login successful!");

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed";

      toast.error(message);

      return {
        success: false,
        message,
      };
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (
    name,
    email,
    password,
    role
  ) => {
    try {
      setLoading(true);

      const response = await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      toast.success("Registration successful!");

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed";

      toast.error(message);

      return {
        success: false,
        message,
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.get("/auth/logout");

      toast.success("Logged out successfully!");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Logout failed"
      );
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};