import { useState } from "react";
import { loginWithGoogle, loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginUser(email, password);

      // ✅ FIXED ROUTE
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();

      // ✅ FIXED ROUTE
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-[400px]">

        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome Back 👋
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>

        <button
          onClick={handleGoogle}
          className="w-full border mt-4 py-3 rounded-lg hover:bg-gray-100 transition"
        >
          Continue with Google
        </button>

        <p
          className="text-sm text-center mt-4 cursor-pointer text-blue-600"
          onClick={() => navigate("/signup")}
        >
          Don't have an account? Sign up
        </p>

        <p
          className="text-sm text-center mt-2 cursor-pointer text-gray-500"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot password?
        </p>

      </div>
    </div>
  );
}