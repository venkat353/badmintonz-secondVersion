import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

interface Timeslot {
  id: number;
  startTime: string; // ISO String "2026-02-01T10:00:00"
  endTime: string;
  booked: boolean; 
}

const SlotsPage = () => {
  const { courtId } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  
  // Default date: Today (YYYY-MM-DD)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState<Timeslot[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch Slots when Date or CourtId changes
  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        // --- FIX 1: Use Gateway Port 8222 ---
        const response = await axios.get(
          `http://localhost:8222/api/courts/${courtId}/timeslots?date=${date}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSlots(response.data);
      } catch (err) {
        console.error("Error fetching slots", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [courtId, date]);

  // Handle Booking
 const handleBook = async (slotId: number) => {
    const token = localStorage.getItem("token");
    if (!confirm("Are you sure you want to book this slot?")) return;

    try {
      // --- FIX: Added "/timeslots/" to match CourtController.java ---
      await axios.post(
        `http://localhost:8222/api/courts/timeslots/${slotId}/book`,
        {}, // Empty body
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage("Booking Successful! 🎉");
      
      // Update the UI immediately to show it as booked
      setSlots(slots.map(s => s.id === slotId ? { ...s, booked: true } : s));
    } catch (err) {
      console.error(err);
      alert("Booking Failed! Slot might be taken or session expired.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <button onClick={() => navigate("/dashboard")} className="text-blue-500 mb-4 hover:underline">
          &larr; Back to Dashboard
        </button>
        
        <h1 className="text-2xl font-bold mb-4">Book a Slot 📅</h1>
        
        {/* Date Picker */}
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Select Date:</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <p className="text-sm text-gray-500 mt-1">
            * We created mock data for <strong>Tomorrow</strong>. Select the next day to see slots!
          </p>
        </div>

        {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}

        {loading ? (
          <p>Loading slots...</p>
        ) : (
          <div className="grid gap-4">
            {slots.length === 0 && <p className="text-gray-500">No slots available for this date.</p>}
            
            {slots.map((slot) => {
                // Extract just the time (e.g., 10:00)
                const start = new Date(slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                const end = new Date(slot.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                
                return (
                  <div key={slot.id} className="flex justify-between items-center border p-4 rounded hover:bg-gray-50">
                    <div>
                      <p className="font-bold">{start} - {end}</p>
                      <p className={`text-sm ${slot.booked ? "text-red-500" : "text-green-600"}`}>
                        {slot.booked ? "Booked" : "Available"}
                      </p>
                    </div>
                    
                    {!slot.booked && (
                      <button 
                        onClick={() => handleBook(slot.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Book Now
                      </button>
                    )}
                    
                    {slot.booked && (
                      <button disabled className="bg-gray-300 text-gray-500 px-4 py-2 rounded cursor-not-allowed">
                        Taken
                      </button>
                    )}
                  </div>
                );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotsPage;