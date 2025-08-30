import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register, loading, error, clearError } = useAuth();
  const cityOptions = [
    { label: "Cairo, Giza", value: "cairo_giza" },
    { label: "Alexandria", value: "alexandria" },
    { label: "Other Governorates", value: "other_governorates" },
    { label: "Delta, Canal", value: "delta_canal" },
    { label: "Aswan, Hurghada", value: "aswan_hurghada" },
    { label: "Upper Egypt", value: "upper_egypt" },
  ];
  const areaOptions = {
    cairo_giza: [
      "Nasr City",
      "Heliopolis",
      "Dokki",
      "Mohandessin",
      "Maadi",
      "6th of October",
      "Sheikh Zayed",
    ],
    alexandria: ["Sidi Gaber", "Stanley", "Smouha", "Gleem"],
    other_governorates: ["Ismailia", "Port Said", "Suez"],
    delta_canal: ["Mansoura", "Tanta", "Zagazig"],
    aswan_hurghada: ["Aswan City", "Hurghada City"],
    upper_egypt: ["Minya", "Sohag", "Qena", "Luxor"],
  };
  const [selectedCity, setSelectedCity] = useState(cityOptions[0].value);
  const [selectedArea, setSelectedArea] = useState("");
  const [residenceType, setResidenceType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    street: "",
    landmarks: "",
    floor: "",
    apartment: "",
  });
  const [localError, setLocalError] = useState("");
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError("");

    if (!validateEmail(formData.email)) {
      setLocalError("Please enter a valid email (e.g. example@example.com).");
      return;
    }
    if (formData.password.length < 5) {
      setLocalError("Password must be at least 5 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (
      residenceType === "apartment" &&
      (!formData.floor || !formData.apartment)
    ) {
      setLocalError("Please enter floor and apartment number.");
      return;
    }

    try {
      const addressObj = {
        city: selectedCity,
        area: selectedArea,
        street: formData.street,
        landmarks: formData.landmarks,
        residenceType,
        floor: residenceType === "apartment" ? formData.floor : undefined,
        apartment:
          residenceType === "apartment" ? formData.apartment : undefined,
      };

      const result = await register({
        name: formData.name,
        phone: formData.phone,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        address: addressObj,
      });

      if (result.success) {
        navigate("/");
      }
    } catch (err) {
      // Error is handled by the context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-50 to-purple-50 px-8 py-20">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-primary rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-dark focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City/Region
            </label>
            <select
              name="city"
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedArea("");
              }}
              required
              className="w-full border border-primary rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-dark focus:border-transparent"
            >
              {cityOptions.map((city) => (
                <option key={city.value} value={city.value}>
                  {city.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
              Area
            </label>
            <select
              name="area"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              required
              className="w-full border border-primary rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-dark focus:border-transparent"
            >
              <option value="">Select area</option>
              {(areaOptions[selectedCity] || []).map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
              Street
            </label>
            <input
              name="street"
              placeholder="Street name and number"
              value={formData.street}
              onChange={handleChange}
              required
              className="w-full border border-primary rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-dark focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
              Famous Landmarks / Notes
            </label>
            <textarea
              name="landmarks"
              placeholder="Landmarks, notes, delivery instructions, etc."
              value={formData.landmarks}
              onChange={handleChange}
              rows="2"
              className="w-full border border-primary rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-dark focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
              Residence Type
            </label>
            <select
              name="residenceType"
              value={residenceType}
              onChange={(e) => setResidenceType(e.target.value)}
              required
              className="w-full border border-primary rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-dark focus:border-transparent"
            >
              <option value="">Select type</option>
              <option value="apartment">Apartment</option>
              <option value="private_house">Private House</option>
              <option value="work">Work</option>
            </select>
          </div>
          {residenceType === "apartment" && (
            <div className="flex gap-4 mt-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor Number
                </label>
                <input
                  name="floor"
                  type="number"
                  min="0"
                  value={formData.floor}
                  onChange={handleChange}
                  className="w-full border border-primary rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apartment Number
                </label>
                <input
                  name="apartment"
                  type="number"
                  min="0"
                  value={formData.apartment}
                  onChange={handleChange}
                  className="w-full border border-primary rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                  required
                />
              </div>
            </div>
          )}
          {(error || localError) && (
            <div className="text-red-500 text-sm">{error || localError}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary-dark text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primary-darker"
            }`}
          >
            {loading ? "Registering..." : "Register"}
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
