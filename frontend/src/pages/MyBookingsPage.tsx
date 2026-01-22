import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Timeslot {
  id: number;
  startTime: string;
  endTime: string;
  court: {
    name: string;
    surfaceType: string;
  };
}

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<Timeslot[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Call the new endpoint via Gateway
        const response = await axios.get("http://localhost:8222/api/courts/my-bookings", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data);
      } catch (err) {
        console.error("Failed to load bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">My Bookings 🎟️</h1>
            <button onClick={() => navigate("/dashboard")} className="text-blue-600 hover:underline">
                Back to Dashboard
            </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <div className="bg-white p-8 rounded shadow text-center text-gray-500">
            <p className="text-xl">You haven't booked any slots yet.</p>
            <button onClick={() => navigate("/dashboard")} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                Find a Court
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((slot) => (
              <div key={slot.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{slot.court?.name || "Badminton Court"}</h3>
                  <p className="text-gray-600">{slot.court?.surfaceType} Surface</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {new Date(slot.startTime).toLocaleDateString()}
                  </p>
                  <p className="text-gray-500">
                    {new Date(slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                    - 
                    {new Date(slot.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;