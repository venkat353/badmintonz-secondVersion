import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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

  // --- FIX: Define this function OUTSIDE useEffect so it can be reused ---
  const fetchCourts = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // 1. Build Dynamic URL
      let url = "https://badmintoz.shop/api/courts"; // Ensure this IP is correct!
      const params = new URLSearchParams();

      if (searchTerm) params.append("search", searchTerm);
      if (selectedSurface !== "ALL") params.append("surface", selectedSurface);

      // 2. Make Request
      const response = await axios.get(`${url}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCourts(response.data);
      setError("");
    } catch (err: any) {
      console.error("Failed to fetch courts", err);
      // Don't show error if it's just empty results
      if (err.response && err.response.status !== 404) {
          setError("Failed to connect to server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, searchTerm, selectedSurface]);

  // --- FIX: This single useEffect handles Initial Load AND Search Updates ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCourts();
    }, 500); // Wait 500ms after typing

    return () => clearTimeout(delayDebounceFn);
  }, [fetchCourts]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (loading) return <div className="text-center mt-10 text-xl font-semibold">Loading Courts... 🏸</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Available Courts 🏸</h1>
          <button onClick={handleLogout} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
            Logout
          </button>
        </div>

        {/* Admin Panel Button */}
        {isAdmin && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex flex-col md:flex-row justify-between items-center shadow-sm">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-bold text-red-800 flex items-center">🛡️ Admin Privileges Active</h3>
              <p className="text-sm text-red-600">You can add new courts and manage system settings.</p>
            </div>
            <Link to="/admin" className="px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 shadow transition">
              Go to Admin Panel 🛠️
            </Link>
          </div>
        )}

        {/* My Bookings Button */}
        <div className="mb-6">
          <button onClick={() => navigate("/my-bookings")} className="bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition">
            📅 My Bookings
          </button>
        </div>

        {/* --- SEARCH & FILTER BAR --- */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Search courts by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="md:w-1/4">
            <select
              value={selectedSurface}
              onChange={(e) => setSelectedSurface(e.target.value)}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="ALL">All Surfaces</option>
              <option value="WOODEN">Wooden</option>
              <option value="SYNTHETIC">Synthetic</option>
              <option value="RUBBER">Rubber</option>
            </select>
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {/* --- COURTS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courts.length === 0 ? (
            <p className="text-gray-500 text-lg text-center col-span-2 py-8">No courts match your search.</p>
          ) : (
            courts.map((court) => (
              <div key={court.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 border-l-4 border-blue-500 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-800">{court.name}</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded uppercase font-semibold">
                      {court.surfaceType}
                    </span>
                  </div>
                  {court.location && (
                    <p className="text-gray-600 text-sm flex items-center mb-2">
                      📍 <span className="ml-1">{court.location}</span>
                    </p>
                  )}
                  {court.description && (
                    <p className="text-gray-500 text-sm italic mb-4 border-l-2 pl-2 border-gray-200">
                      "{court.description}"
                    </p>
                  )}
                </div>
                <div>
                  <div className="text-right mb-4">
                    <p className="text-lg font-bold text-green-600">₹{court.pricePerHour}</p>
                    <p className="text-xs text-gray-500">per hour</p>
                  </div>
                  <button
                    onClick={() => navigate(`/court/${court.id}/slots`)}
                    className="w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700 transition shadow-sm"
                  >
                    View Available Slots
                  </button>
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