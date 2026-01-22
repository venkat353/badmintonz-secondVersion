import { useState } from "react";
import axios from "axios"; // Import Axios
import { Link, useNavigate } from "react-router-dom"; // Import Navigation hook

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // To show error messages
  const navigate = useNavigate(); // To move user to Dashboard

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // 1. Send Request to API Gateway (Port 8222)
      // NOTE: Changed 8082 -> 8222 to match your Docker Gateway
      const response = await axios.post("http://localhost:8222/api/auth/login", {
        email: email,
        password: password
      });

      // 2. If successful, save the token
      console.log("Login Success:", response.data);
      localStorage.setItem("token", response.data.token); // Save JWT in browser
      
      // 3. Go to Dashboard
      navigate("/dashboard");

    } catch (err: any) {
      console.error("Login Failed:", err);
      // specific error message handling
      if (err.response) {
         setError(err.response.data || "Invalid credentials");
      } else if (err.request) {
         setError("Network error. Is the backend running?");
      } else {
         setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">
          BadMintoz Login 🏸
        </h2>
        
        {/* Error Message Display */}
        {error && (
            <div className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded">
                {error}
            </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="user@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Register Link Section */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;