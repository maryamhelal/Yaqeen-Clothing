import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ordersAPI } from "../api/orders";

export default function ProfilePage() {
  const { user, logout, token, changePassword, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [pwForm, setPwForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  const handlePwChange = (e) =>
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwMsg("");
    setPwError("");

    if (pwForm.newPassword.length < 5) {
      setPwError("Password length must be at least 5 characters long");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("New passwords do not match");
      return;
    }

    try {
      const data = await changePassword({
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword,
      });

      setPwMsg("Password changed successfully!");
      setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });

      // Show email warning if any
      if (data.emailWarning) {
        setPwMsg((prev) => prev + " " + data.emailWarning);
      }
    } catch (err) {
      setPwError(err.message);
    }
  };

  useEffect(() => {
    if (token) {
      ordersAPI
        .getUserOrders(token)
        .then((result) => {
          setOrders(result.orders || []);
        })
        .catch(console.error);
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-160px)] bg-primary flex items-center justify-center py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No User Data
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to view your profile.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center py-28 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
        <div className="mb-8">
          <div className="mb-2 text-lg font-semibold text-gray-700">
            Name: <span className="font-normal">{user.name}</span>
          </div>
          <div className="mb-2 text-lg font-semibold text-gray-700">
            Email: <span className="font-normal">{user.email}</span>
          </div>
          <div className="mb-2 text-lg font-semibold text-gray-700">
            Address:
            <div className="ml-4 mt-1 font-normal space-y-1 text-gray-800">
              {user.address?.city && (
                <div>
                  <span className="font-semibold">City:</span>{" "}
                  {user.address.city
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </div>
              )}
              {user.address?.area && (
                <div>
                  <span className="font-semibold">Area:</span>{" "}
                  {user.address.area}
                </div>
              )}
              {user.address?.street && (
                <div>
                  <span className="font-semibold">Street:</span>{" "}
                  {user.address.street}
                </div>
              )}
              {user.address?.landmarks &&
                user.address.landmarks.trim() !== "" && (
                  <div>
                    <span className="font-semibold">Landmarks:</span>{" "}
                    {user.address.landmarks}
                  </div>
                )}
              {user.address?.residenceType && (
                <div>
                  <span className="font-semibold">Residence Type:</span>{" "}
                  {user.address.residenceType.replace(/_/g, " ")}
                </div>
              )}
              {user.address?.residenceType === "apartment" && (
                <>
                  {user.address.floor && (
                    <div>
                      <span className="font-semibold">Floor:</span>{" "}
                      {user.address.floor}
                    </div>
                  )}
                  {user.address.apartment && (
                    <div>
                      <span className="font-semibold">Apartment:</span>{" "}
                      {user.address.apartment}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Change Password
        </h3>
        <form onSubmit={handlePwSubmit} className="mb-8 space-y-4">
          <input
            type="password"
            name="oldPassword"
            value={pwForm.oldPassword}
            onChange={handlePwChange}
            placeholder="Old Password"
            className="w-full border rounded-lg px-4 py-2"
            required
          />
          <input
            type="password"
            name="newPassword"
            value={pwForm.newPassword}
            onChange={handlePwChange}
            placeholder="New Password"
            className="w-full border rounded-lg px-4 py-2"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={pwForm.confirmPassword}
            onChange={handlePwChange}
            placeholder="Confirm New Password"
            className="w-full border rounded-lg px-4 py-2"
            required
          />
          {pwError && <div className="text-red-500 text-sm">{pwError}</div>}
          {pwMsg && <div className="text-green-600 text-sm">{pwMsg}</div>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary-dark text-white py-2 rounded-lg font-semibold transition-colors ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primary-darker"
            }`}
          >
            {loading ? "Changing Password..." : "Change Password"}
          </button>
        </form>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">My Orders</h3>
        <div className="bg-primary/20 rounded-lg p-4">
          {orders.length === 0 ? (
            <div className="text-gray-500 text-center py-4">No orders yet.</div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">
                        {order.totalPrice?.toLocaleString()} EGP
                      </div>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "paid"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "shipped"
                            ? "bg-purple-100 text-purple-800"
                            : order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm"
                      >
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-600 ml-2">
                            ({item.size}, {item.color}) x {item.quantity}
                          </span>
                        </div>
                        <span className="font-medium">
                          {item.price?.toLocaleString()} EGP
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">
                        Shipping Address:
                      </h5>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.name &&
                          `${order.shippingAddress.name}, `}
                        {order.shippingAddress.phone &&
                          `${order.shippingAddress.phone}, `}
                        {order.shippingAddress.city &&
                          order.shippingAddress.area &&
                          `${order.shippingAddress.area}, ${order.shippingAddress.city}`}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
