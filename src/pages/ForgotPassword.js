import { useState } from "react";
import { resetPassword } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      await resetPassword(email);
      alert("Password reset email sent!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-[400px]">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Forgot Password 🔑
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Enter your email to receive a reset link
        </p>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Send Reset Link
        </button>

        {/* Back to Login */}
        <p
          className="text-sm text-center mt-6 text-blue-600 cursor-pointer hover:underline"
          onClick={() => navigate("/")}
        >
          Back to Login
        </p>

      </div>
    </div>
  );
}