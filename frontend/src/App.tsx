// 1. Add 'BrowserRouter' to the imports
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import DashboardPage from "./pages/DashboardPage";
import SlotsPage from "./pages/SlotsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from "./pages/LandingPage";
import { AuthProvider, useAuth } from "./context/AuthContext"; 
import type { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token, loading } = useAuth();

  if (loading) return null; 

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    // 2. Wrap EVERYTHING in BrowserRouter
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/court/:courtId/slots" 
            element={
              <ProtectedRoute>
                <SlotsPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;