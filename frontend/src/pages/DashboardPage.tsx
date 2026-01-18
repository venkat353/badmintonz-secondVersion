import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define what a Court looks like (TypeScript Interface)
interface Court {
  id: number;
  name: string;
  surfaceType: string;
  pricePerHour: number;
}

const DashboardPage = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourts = async () => {
      const token = localStorage.getItem("token");

      // If no token, kick them back to login
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8082/api/courts", {
          headers: {
            Authorization: `Bearer ${token}` // <--- We must attach the Passport!
          }
        });
        setCourts(response.data);
      } catch (err) {
        console.error("Failed to fetch courts", err);
        setError("Failed to load courts. Session might be expired.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, [navigate]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Available Courts 🏸</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courts.map((court) => (
            <div key={court.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h2 className="text-xl font-bold text-blue-600">{court.name}</h2>
              <p className="text-gray-600 mt-2">Surface: <span className="font-semibold">{court.surfaceType}</span></p>
              <p className="text-gray-600">Price: <span className="font-semibold">${court.pricePerHour}/hr</span></p>
              
              <button 
                onClick={() => navigate(`/court/${court.id}/slots`)} // Navigate to the new page
                className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                >
                View Slots
                </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;