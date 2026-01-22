import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import DashboardPage from "./pages/DashboardPage";
import SlotsPage from "./pages/SlotsPage";
import MyBookingsPage from "./pages/MyBookingsPage"; // <--- 1. Check Import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Route for booking slots */}
        <Route path="/court/:courtId/slots" element={<SlotsPage />} />

        {/* --- 2. THIS IS THE MISSING ROUTE --- */}
        <Route path="/my-bookings" element={<MyBookingsPage />} /> 
        
      </Routes>
    </Router>
  );
}

export default App;