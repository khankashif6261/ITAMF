"use client";
import { useState } from "react";

export default function RequestAccess() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/request-access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // ✅ SAVE USER ID
      localStorage.setItem("userId", data.user._id);

      setMessage("✅ Request sent! Wait for admin approval.");
      setForm({ name: "", email: "", password: "" });
      window.location.href = "/pending";
    } catch (err) {
      setMessage("❌ " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[350px]">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
          Request Access
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Sending..." : "Request Access"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-indigo-600">{message}</p>
        )}
      </div>
    </div>
  );
}