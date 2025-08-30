import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ordersAPI } from "../api/orders";
import { authAPI } from "../api/auth";
import { useLocation, useNavigate } from "react-router-dom";
import CitySelectTable from "../components/CitySelectTable";

export default function CheckoutPage() {
  const { cart, clearCart } = useContext(CartContext);
  const { user, token, login } = useAuth();
  const cityOptions = [
    { label: "Cairo, Giza", value: "cairo_giza", price: 70 },
    { label: "Alexandria", value: "alexandria", price: 75 },
    { label: "Other Governorates", value: "other_governorates", price: 75 },
    { label: "Delta, Canal", value: "delta_canal", price: 85 },
    { label: "Aswan, Hurghada", value: "aswan_hurghada", price: 115 },
    { label: "Upper Egypt", value: "upper_egypt", price: 115 },
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
  const [form, setForm] = useState({
    name: "",
    street: "",
    landmarks: "",
    floor: "",
    apartment: "",
    phone: "",
    email: "",
  });
  const [saveInfo, setSaveInfo] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingPrice =
    cityOptions.find((c) => c.value === selectedCity)?.price || 0;
  const totalWithShipping = subtotal + shippingPrice;

  useEffect(() => {
    if (cart.length === 0 && location.pathname === "/checkout") {
      navigate("/", { replace: true });
    }
    if (user) {
      setForm({
        name: user.name || "",
        street: user.address?.street || "",
        landmarks: user.address?.landmarks || "",
        floor: user.address?.floor || "",
        apartment: user.address?.apartment || "",
        phone: user.phone || "",
        email: user.email || "",
      });
      setSelectedCity(user.address?.city || cityOptions[0].value);
      setSelectedArea(user.address?.area || "");
      setResidenceType(user.address?.residenceType || "");
    }
  }, [cart, navigate, user, location]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");

    if (!form.phone || !form.email) {
      setError("Phone and email are required.");
      setSubmitting(false);
      return;
    }

    try {
      if (!user && saveInfo) {
        if (!password || !confirmPassword) {
          throw new Error("Password and confirm password are required.");
        }
        if (password.length < 5) {
          throw new Error("Password must be at least 5 characters.");
        }
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
      }

      let authToken = token;
      let loginRes = null;

      // If guest checkout with save info checked, then register + login
      if (!user && saveInfo) {
        const registerRes = await authAPI.register({
          name: form.name,
          email: form.email,
          password,
          phone: form.phone,
          address: {
            city: selectedCity,
            area: selectedArea,
            street: form.street,
            landmarks: form.landmarks,
            residenceType,
            floor: residenceType === "apartment" ? form.floor : undefined,
            apartment:
              residenceType === "apartment" ? form.apartment : undefined,
          },
        });
        if (!registerRes || !registerRes.user || !registerRes.token) {
          throw new Error(registerRes.error || "Registration failed");
        }

        loginRes = await authAPI.login({
          email: form.email,
          password,
        });
        if (!loginRes || !loginRes.user || !loginRes.token) {
          throw new Error(loginRes.error || "Login after registration failed");
        }
        await login({ email: form.email, password });

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const orderData = {
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
        })),
        totalPrice: totalWithShipping,
        shippingAddress: {
          name: form.name,
          city: selectedCity,
          area: selectedArea,
          street: form.street,
          landmarks: form.landmarks,
          residenceType,
          floor: residenceType === "apartment" ? form.floor : undefined,
          apartment: residenceType === "apartment" ? form.apartment : undefined,
          phone: form.phone,
        },
        orderer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          userId: user ? user.id : loginRes?.user ? loginRes.user.id : null,
        },
      };

      const result = await ordersAPI.createOrder(orderData, authToken || null);

      if (result && result.order) {
        clearCart();
        navigate("/thank-you", { state: { order: result.order } });
      } else {
        setError(
          "Order was placed but no confirmation was received. Please contact support."
        );
      }
    } catch (err) {
      setError(
        err?.message ||
          "There was an error placing your order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Checkout
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Shipping Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-red-500 font-medium mb-2">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={!!user}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping City/Region
                </label>
                <CitySelectTable
                  value={selectedCity}
                  onChange={(val) => {
                    setSelectedCity(val);
                    setSelectedArea("");
                  }}
                  cityOptions={cityOptions}
                />
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  value={form.street}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                  Famous Landmarks / Notes
                </label>
                <textarea
                  name="landmarks"
                  placeholder="Landmarks, notes, delivery instructions, etc."
                  value={form.landmarks}
                  onChange={handleChange}
                  rows="2"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
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
                      value={form.floor}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
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
                      value={form.apartment}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              )}
              {/* Save info for next time (guests only) */}
              {!user && (
                <div className="mt-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={saveInfo}
                      onChange={() => setSaveInfo((v) => !v)}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Save this information for next time
                    </span>
                  </label>
                  {saveInfo && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-600 mb-2">
                        An account will be created using your email and
                        password.
                      </div>
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          minLength={5}
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          minLength={5}
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full bg-primary-dark text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-darker transition-colors mt-6 ${
                  submitting ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8 h-fit">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Order Summary
            </h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.color}-${item.size}`}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Size: {item.size} | Color: {item.color}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {(item.price * item.quantity).toLocaleString()} EGP
                    </p>
                  </div>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Shipping</span>
                  <span>{shippingPrice.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>{totalWithShipping.toLocaleString()} EGP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
