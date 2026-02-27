import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client"; 

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/api/auth/register", form);
      setSuccess("Account created successfully!");
      setForm({ name: "", email: "", password: "" });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Registration failed";
        setError(msg);
      }
    };
    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-2xl shadow"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-green-700 text-sm">
            {success}
          </div>
        )}

        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
          required
        />

        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
          required
        />

        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          name="password"
          className="w-full border rounded-lg p-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
          required
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Register
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link className="text-blue-600 hover:underline" to="/">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
