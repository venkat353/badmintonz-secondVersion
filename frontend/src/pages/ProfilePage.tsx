import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const ProfilePage = () => {
  const { token, user, logout } = useAuth(); // 'user' here is just the email for now
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    city: "",
    skillLevel: "Beginner",
    playingHand: "Right",
    phoneNumber: "",
    bio: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch Profile Data on Load
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // We need to create this endpoint in Backend next!
      const response = await axios.get("https://badmintoz.shop/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile", error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put("https://badmintoz.shop/api/auth/me", profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      alert("Profile Updated! 🏸");
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update profile");
    }
  };

  if (loading) return <div className="text-center mt-20">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header / Cover */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 flex items-center justify-center">
             <h1 className="text-3xl font-bold text-white tracking-wider">PLAYER CARD</h1>
        </div>

        <div className="relative px-8 pb-8">
          {/* Avatar (Initials) */}
          <div className="absolute -top-12 left-8 w-24 h-24 bg-white rounded-full p-1 shadow-lg">
             <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-500">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
             </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 gap-3">
             {isEditing ? (
                 <>
                   <button onClick={() => setIsEditing(false)} className="text-gray-500 font-medium px-4">Cancel</button>
                   <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-blue-700">Save Changes</button>
                 </>
             ) : (
                 <button onClick={() => setIsEditing(true)} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-200 border border-gray-300">Edit Profile ✏️</button>
             )}
          </div>

          {/* Form Fields */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
             
             {/* Name */}
             <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                <input 
                  disabled={!isEditing}
                  value={profile.name || ""}
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 ${isEditing ? 'border bg-white' : 'bg-gray-50 border-none'}`}
                />
             </div>

             {/* Email (Read Only) */}
             <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <input disabled value={profile.email || ""} className="mt-1 block w-full bg-gray-100 rounded-md border-transparent p-2 text-gray-500 cursor-not-allowed"/>
             </div>

             {/* Skill Level */}
             <div>
                <label className="block text-sm font-medium text-gray-500">Skill Level ⚡</label>
                {isEditing ? (
                  <select 
                    value={profile.skillLevel} 
                    onChange={e => setProfile({...profile, skillLevel: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-white border"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Pro</option>
                  </select>
                ) : (
                  <div className="mt-1 text-lg font-semibold text-gray-800">{profile.skillLevel}</div>
                )}
             </div>

             {/* Playing Hand */}
             <div>
                <label className="block text-sm font-medium text-gray-500">Playing Hand ✋</label>
                {isEditing ? (
                  <select 
                    value={profile.playingHand} 
                    onChange={e => setProfile({...profile, playingHand: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-white border"
                  >
                    <option>Right</option>
                    <option>Left</option>
                  </select>
                ) : (
                  <div className="mt-1 text-lg font-semibold text-gray-800">{profile.playingHand}</div>
                )}
             </div>

             {/* City */}
             <div>
                <label className="block text-sm font-medium text-gray-500">City 📍</label>
                <input 
                  disabled={!isEditing}
                  value={profile.city || ""}
                  onChange={e => setProfile({...profile, city: e.target.value})}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 ${isEditing ? 'border bg-white' : 'bg-gray-50 border-none'}`}
                  placeholder="Where do you play?"
                />
             </div>

             {/* Phone */}
             <div>
                <label className="block text-sm font-medium text-gray-500">Phone 📱</label>
                <input 
                  disabled={!isEditing}
                  value={profile.phoneNumber || ""}
                  onChange={e => setProfile({...profile, phoneNumber: e.target.value})}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 ${isEditing ? 'border bg-white' : 'bg-gray-50 border-none'}`}
                />
             </div>

             {/* Bio */}
             <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500">Bio / Looking For</label>
                <textarea 
                  disabled={!isEditing}
                  value={profile.bio || ""}
                  onChange={e => setProfile({...profile, bio: e.target.value})}
                  rows={3}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 ${isEditing ? 'border bg-white' : 'bg-gray-50 border-none'}`}
                  placeholder="e.g. I play aggressively, looking for a doubles partner for weekends."
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;