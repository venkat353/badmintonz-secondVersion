import { createContext, useContext, useState, useEffect} from "react";
import type {ReactNode} from "react";

// 1. Define what our User "Context" looks like
interface AuthContextType {
  user: string | null; // The user's email or ID
  token: string | null;
  role: string | null;
  login: (token: string, role: string, email: string) => void;
  logout: () => void;
  loading: boolean;
}

// 2. Create the Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create the Provider (The "Global Brain")
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check LocalStorage when the app starts
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedEmail = localStorage.getItem("email"); // We will start saving this in Login!

    if (storedToken) {
      setToken(storedToken);
      setRole(storedRole);
      setUser(storedEmail || "User"); // Default to "User" if email not found
    }
    setLoading(false);
  }, []);

  // Function to run when user logs in
  const login = (newToken: string, newRole: string, email: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    localStorage.setItem("email", email);

    setToken(newToken);
    setRole(newRole);
    setUser(email);
  };

  // Function to run when user logs out
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");

    setToken(null);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Create a custom hook to use this context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};