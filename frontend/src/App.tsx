import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SlotsPage from "./pages/SlotsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root "/" to "/login" */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* The Login Page */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Placeholder for Dashboard (we'll build this later) */}
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/court/:courtId/slots" element={<SlotsPage />} />
      </Routes>
    </Router>
  );
}

export default App;