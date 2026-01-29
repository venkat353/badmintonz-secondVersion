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
    location?: string; // Added optional location
  };
}

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<Timeslot[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null); // To show loading state on specific button
  const navigate = useNavigate();

  // Helper to refresh data
  const fetchBookings = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get("https://badmintoz.shop/api/courts/my-bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [navigate]);

  // --- NEW: Handle Cancel Logic ---
  const handleCancel = async (slotId: number) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
        return;
    }

    setCancellingId(slotId); // Show loading spinner on button
    const token = localStorage.getItem("token");

    try {
        await axios.post(`https://badmintoz.shop/api/courts/bookings/${slotId}/cancel`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // Remove the cancelled item from the list instantly (Optimistic UI)
        setBookings(prev => prev.filter(b => b.id !== slotId));
        alert("Booking Cancelled Successfully");

    } catch (error) {
        console.error("Cancellation failed", error);
        alert("Failed to cancel. You might be too late!");
    } finally {
        setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">My Bookings 🎟️</h1>
            <button onClick={() => navigate("/dashboard")} className="text-blue-600 hover:underline">
                ← Back to Dashboard
            </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-xl font-semibold text-gray-500">Loading your tickets...</div>
        ) : bookings.length === 0 ? (
          <div className="bg-white p-10 rounded-lg shadow text-center text-gray-500">
            <p className="text-xl mb-4">You haven't booked any slots yet.</p>
            <button onClick={() => navigate("/dashboard")} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-bold transition">
                Find a Court
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((slot) => (
              <div key={slot.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 flex flex-col md:flex-row justify-between items-center transition hover:shadow-lg">

                {/* Left: Info */}
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold text-gray-800">{slot.court?.name || "Badminton Court"}</h3>
                  <div className="text-gray-600 text-sm">
                     <span className="font-semibold">{slot.court?.surfaceType}</span>
                     {slot.court?.location && <span> • 📍 {slot.court.location}</span>}
                  </div>
                  <div className="mt-2 text-green-700 font-bold text-lg">
                    {new Date(slot.startTime).toLocaleDateString()}
                  </div>
                  <div className="text-gray-500">
                    {new Date(slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    {' - '}
                    {new Date(slot.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>

                {/* Right: Actions */}
                <div>
                   <button
                     onClick={() => handleCancel(slot.id)}
                     disabled={cancellingId === slot.id}
                     className={`px-4 py-2 rounded text-white font-bold transition shadow-sm
                        ${cancellingId === slot.id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"}`}
                   >
                     {cancellingId === slot.id ? "Cancelling..." : "Cancel Booking"}
                   </button>
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