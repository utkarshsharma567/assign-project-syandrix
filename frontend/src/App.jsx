import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import CreateTask from "./pages/CreateTask";
import MyTasks from "./pages/MyTasks";
import TeamMembers from "./pages/TeamMembers";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="h-screen overflow-hidden bg-slate-100">

      {/* Navbar */}
      <Navbar />

      {/* Main Application Area */}
      <div className="flex h-[calc(100vh-80px)]">

        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="p-6 md:p-8">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* React Hot Toast */}
        <Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,

    style: {
      borderRadius: "10px",
      padding: "12px 16px",
      fontSize: "14px",
      fontWeight: "500",
    },

    success: {
      style: {
        background: "#dcfce7",
        color: "#166534",
        border: "1px solid #86efac",
      },
      iconTheme: {
        primary: "#16a34a",
        secondary: "#fff",
      },
    },

    error: {
      style: {
        background: "#fee2e2",
        color: "#991b1b",
        border: "1px solid #fca5a5",
      },
      iconTheme: {
        primary: "#dc2626",
        secondary: "#fff",
      },
    },
  }}
/>


        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
  path="/create-task"
  element={
    <ProtectedRoute>
      <Layout>
        <CreateTask />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/my-tasks"
  element={
    <ProtectedRoute>
      <Layout>
        <MyTasks />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/team-members"
  element={
    <ProtectedRoute>
      <Layout>
        <TeamMembers />
      </Layout>
    </ProtectedRoute>
  }
/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
