import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppActions } from "@/contexts/AppContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setRole } = useAppActions(); // ✅ Removed setToken

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${API}/auth/admin`, { email, password });
      setRole("admin");
      localStorage.setItem("role", "admin");
      localStorage.setItem("token", data.token); // ✅ Still saving token locally
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-gray-400">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ color: "black", backgroundColor: "#374151" }}
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password" className="text-gray-400">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ color: "black", backgroundColor: "#374151" }}
              placeholder="Enter your password"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gray-500 text-white hover:bg-gray-600 border border-gray-400" 
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
