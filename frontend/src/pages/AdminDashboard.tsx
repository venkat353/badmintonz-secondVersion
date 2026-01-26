import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Court {
  id: number;
  name: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'create' | 'slots'>('create');
  const [courts, setCourts] = useState<Court[]>([]);
  const [message, setMessage] = useState('');

  // Form State: Add Court
  const [courtData, setCourtData] = useState({
    name: '',
    location: '',
    description: '',
    pricePerHour: 0,
    surfaceType: 'WOODEN'
  });

  // Form State: Generate Slots
  const [slotData, setSlotData] = useState({
    courtId: '',
    startDate: '',
    endDate: '',
    startHour: 9, // Default 9 AM
    endHour: 21   // Default 9 PM
  });

  const token = localStorage.getItem('token');
  const API_URL = "http://13.203.21.23:8222/api/courts";

  // 1. Fetch Courts on Load (so we can select them in the dropdown)
  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourts(res.data);
    } catch (err) {
      console.error("Failed to fetch courts");
    }
  };

  // 2. Handle Create Court
  const handleCreateCourt = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, courtData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Court Added Successfully!');
      setCourtData({ name: '', location: '', description: '', pricePerHour: 0, surfaceType: 'WOODEN' });
      fetchCourts(); // Refresh list
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
          setMessage('⚠️ This Court Name already exists!');
      } else {
          setMessage('❌ Failed to add court.');
      }
    }
  };

  // 3. Handle Generate Slots (The New Feature!)
  const handleGenerateSlots = async (e: any) => {
    e.preventDefault();
    if (!slotData.courtId) {
        setMessage('⚠️ Please select a court first.');
        return;
    }
    try {
      setMessage('⏳ Generating slots... please wait...');
      await axios.post(`${API_URL}/generate-slots`, slotData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Slots Generated Successfully for the selected dates!');
    } catch (error) {
      console.error(error);
      setMessage('❌ Failed to generate slots. Check console.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button onClick={() => navigate('/dashboard')} className="mb-4 text-blue-600 hover:underline">
        ← Back to Dashboard
      </button>

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow text-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Control Panel 🛠️</h1>

        {/* TABS */}
        <div className="flex border-b mb-6">
            <button
                className={`flex-1 py-2 font-bold ${activeTab === 'create' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => { setActiveTab('create'); setMessage(''); }}
            >
                Add New Court
            </button>
            <button
                className={`flex-1 py-2 font-bold ${activeTab === 'slots' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
                onClick={() => { setActiveTab('slots'); setMessage(''); }}
            >
                Generate Slots 📅
            </button>
        </div>

        {message && <div className={`p-3 mb-4 rounded font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200`}>{message}</div>}

        {/* --- TAB 1: ADD COURT --- */}
        {activeTab === 'create' && (
            <form onSubmit={handleCreateCourt} className="space-y-4">
                <input name="name" value={courtData.name} onChange={(e) => setCourtData({...courtData, name: e.target.value})} placeholder="Court Name" className="w-full border p-2 rounded" required />
                <input name="location" value={courtData.location} onChange={(e) => setCourtData({...courtData, location: e.target.value})} placeholder="Location" className="w-full border p-2 rounded" required />
                <input name="description" value={courtData.description} onChange={(e) => setCourtData({...courtData, description: e.target.value})} placeholder="Description" className="w-full border p-2 rounded" />

                <div className="grid grid-cols-2 gap-4">
                    <input name="pricePerHour" type="number" value={courtData.pricePerHour} onChange={(e) => setCourtData({...courtData, pricePerHour: parseFloat(e.target.value)})} placeholder="Price (₹)" className="w-full border p-2 rounded" required />
                    <select name="surfaceType" value={courtData.surfaceType} onChange={(e) => setCourtData({...courtData, surfaceType: e.target.value})} className="w-full border p-2 rounded">
                        <option value="WOODEN">Wooden</option>
                        <option value="SYNTHETIC">Synthetic</option>
                        <option value="RUBBER">Rubber</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">Create Court</button>
            </form>
        )}

        {/* --- TAB 2: GENERATE SLOTS --- */}
        {activeTab === 'slots' && (
            <form onSubmit={handleGenerateSlots} className="space-y-4">
                <div className="bg-green-50 p-4 rounded border border-green-200 mb-4 text-sm text-green-800">
                    💡 This tool automatically creates hourly slots (e.g., 9:00-10:00, 10:00-11:00) for the selected date range.
                </div>

                {/* Court Selector */}
                <div>
                    <label className="block text-sm font-bold mb-1">Select Court</label>
                    <select
                        className="w-full border p-2 rounded"
                        value={slotData.courtId}
                        onChange={(e) => setSlotData({...slotData, courtId: e.target.value})}
                        required
                    >
                        <option value="">-- Choose a Court --</option>
                        {courts.map(c => (
                            <option key={c.id} value={c.id}>{c.name} (ID: {c.id})</option>
                        ))}
                    </select>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Start Date</label>
                        <input type="date" className="w-full border p-2 rounded"
                            value={slotData.startDate}
                            onChange={(e) => setSlotData({...slotData, startDate: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">End Date</label>
                        <input type="date" className="w-full border p-2 rounded"
                             value={slotData.endDate}
                             onChange={(e) => setSlotData({...slotData, endDate: e.target.value})}
                             required
                        />
                    </div>
                </div>

                {/* Hours Range */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Start Hour (24h)</label>
                        <input type="number" min="0" max="23" className="w-full border p-2 rounded"
                             value={slotData.startHour}
                             onChange={(e) => setSlotData({...slotData, startHour: parseInt(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">End Hour (24h)</label>
                        <input type="number" min="1" max="24" className="w-full border p-2 rounded"
                             value={slotData.endHour}
                             onChange={(e) => setSlotData({...slotData, endHour: parseInt(e.target.value)})}
                        />
                    </div>
                </div>

                <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700">
                    🚀 Generate Bulk Slots
                </button>
            </form>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;