import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const API_BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function RegisterPage() {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'user',
          address: formData.address
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-50 to-purple-50 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-primary rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-dark focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-primary rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-dark focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-primary rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-dark focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-primary rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-dark focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full border border-primary rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-dark focus:border-transparent"
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-primary-dark text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-primary-darker transition-colors"
          >
            Create Account
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <button
            className="text-primary-dark hover:underline font-semibold"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
} 