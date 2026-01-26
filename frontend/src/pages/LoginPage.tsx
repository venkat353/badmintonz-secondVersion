import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // --- HELPER: Decode the Token to find the Role ---
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 1. Send Request to AWS Gateway
      const response = await axios.post("http://13.203.21.23:8222/api/auth/login", {
        email: email,
        password: password
      });

      console.log("Login Success:", response.data);
      const token = response.data.token;

      // 2. Save the Token
      localStorage.setItem("token", token);

      // 3. Extract and Save the Role (The Fix!)
      const decoded = parseJwt(token);
      if (decoded && decoded.role) {
        // If role is strictly "ROLE_ADMIN", save as "ADMIN" for easier checking
        const roleName = decoded.role.replace("ROLE_", "");
        localStorage.setItem("role", roleName);
        console.log("Role Saved:", roleName);
      } else {
        // Fallback: If backend sends role directly in JSON, not in token
        if (response.data.role) {
           localStorage.setItem("role", response.data.role);
        }
      }

      // 4. Go to Dashboard
      navigate("/dashboard");

    } catch (err: any) {
      console.error("Login Failed:", err);
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