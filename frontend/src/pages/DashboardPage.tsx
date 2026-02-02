import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Use the context if available, or localStorage

interface Court {
  id: number;
  name: string;
  surfaceType: string;
  pricePerHour: number;
  location?: string;
  description?: string;
}

const DashboardPage = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSurface, setSelectedSurface] = useState("ALL");

  const navigate = useNavigate();

  // Get role safely
  const rawRole = localStorage.getItem("role");
  const isAdmin = rawRole && rawRole.toUpperCase().includes("ADMIN");

  const fetchCourts = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      let url = "https://badmintoz.shop/api/courts"; 
      const params = new URLSearchParams();

      if (searchTerm) params.append("search", searchTerm);
      if (selectedSurface !== "ALL") params.append("surface", selectedSurface);

      const response = await axios.get(`${url}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCourts(response.data);
      setError("");
    } catch (err: any) {
      console.error("Failed to fetch courts", err);
      if (err.response && err.response.status !== 404) {
          setError("Failed to connect to server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, searchTerm, selectedSurface]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCourts();
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [fetchCourts]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // If using AuthContext, call logout() here instead
    navigate("/login");
  };

  if (loading) return <div className="text-center mt-20 text-xl font-semibold text-gray-600 animate-pulse">Loading Courts... 🏸</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* --- 1. TOP NAVBAR (Redesigned) --- */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 flex flex-col md:flex-row justify-between items-center border border-gray-100">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-2 mb-4 md:mb-0">
             <span className="text-3xl">🏸</span>
             <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">BadMintoz Dashboard</h1>
          </div>

          {/* Action Buttons Group */}
          <div className="flex flex-wrap gap-3 items-center justify-center">
            
            {/* My Profile */}
            <Link 
              to="/profile" 
              className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full font-semibold hover:bg-indigo-100 transition duration-200 border border-indigo-100"
            >
              <span>👤</span> <span className="hidden sm:inline">Profile</span>
            </Link>

            {/* My Bookings */}
            <button 
              onClick={() => navigate("/my-bookings")} 
              className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-blue-100 transition duration-200 border border-blue-100"
            >
              <span>📅</span> <span className="hidden sm:inline">Bookings</span>
            </button>

            {/* Logout */}
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full font-semibold hover:bg-red-100 transition duration-200 border border-red-100"
            >
              <span>🚪</span> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* --- 2. ADMIN ALERT --- */}
        {isAdmin && (
          <div className="mb-8 p-4 bg-gradient-to-r from-red-50 to-white border-l-4 border-red-500 rounded-r-lg shadow-sm flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-2 sm:mb-0">
              <h3 className="text-red-800 font-bold flex items-center gap-2">
                🛡️ Admin Mode Active
              </h3>
              <p className="text-sm text-red-600">You have full control over courts and settings.</p>
            </div>
            <Link to="/admin" className="px-5 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 shadow-md transition transform hover:scale-105">
              Open Admin Panel 🛠️
            </Link>
          </div>
        )}

        {/* --- 3. SEARCH & FILTER BAR --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Find a Court</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
               <span className="absolute left-3 top-3 text-gray-400">🔍</span>
               <input
                 type="text"
                 placeholder="Search by court name..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
               />
            </div>
            <div className="md:w-1/4">
              <select
                value={selectedSurface}
                onChange={(e) => setSelectedSurface(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
              >
                <option value="ALL">All Surfaces</option>
                <option value="WOODEN">🪵 Wooden</option>
                <option value="SYNTHETIC">🟢 Synthetic</option>
                <option value="RUBBER">🔴 Rubber</option>
              </select>
            </div>
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">{error}</div>}

        {/* --- 4. COURTS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courts.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">No courts found matching your search.</p>
              <button onClick={() => {setSearchTerm(""); setSelectedSurface("ALL")}} className="mt-2 text-blue-600 hover:underline">Clear Filters</button>
            </div>
          ) : (
            courts.map((court) => (
              <div key={court.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
                {/* Card Header (Could contain an image later) */}
                <div className="h-32 bg-gray-100 flex items-center justify-center relative">
                   {/* Placeholder visual for now */}
                   <span className="text-4xl filter grayscale group-hover:grayscale-0 transition duration-300">
                     {court.surfaceType === 'WOODEN' ? '🪵' : court.surfaceType === 'RUBBER' ? '🔴' : '🟢'}
                   </span>
                   <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-600 shadow-sm border">
                      {court.surfaceType}
                   </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">{court.name}</h2>
                    {court.location && (
                      <p className="text-gray-500 text-sm mb-3 flex items-center">
                        📍 {court.location}
                      </p>
                    )}
                    {court.description && (
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                        {court.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <span className="block text-xs text-gray-400 font-semibold uppercase">Price</span>
                        <span className="text-lg font-bold text-green-600">₹{court.pricePerHour}</span>
                        <span className="text-xs text-gray-400">/hr</span>
                    </div>
                    <button
                      onClick={() => navigate(`/court/${court.id}/slots`)}
                      className="bg-gray-900 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-600 transition shadow-lg transform hover:-translate-y-0.5"
                    >
                      Book ⚡
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;