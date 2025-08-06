import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ordersAPI } from "../api/orders";

export default function ProfilePage() {
  const { user, logout, token } = useContext(AuthContext);
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
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: pwForm.oldPassword,
            newPassword: pwForm.newPassword,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error changing password");
      setPwMsg("Password changed successfully!");
      setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwError(err.message);
    }
  };

  useEffect(() => {
    if (token) {
      ordersAPI.getUserOrders(token).then(setOrders);
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-160px)] bg-primary flex items-center justify-center py-2">
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
    <div className="min-h-screen bg-primary flex items-center justify-center py-12 px-4">
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
            className="w-full bg-primary-dark text-white py-2 rounded-lg font-semibold"
          >
            Change Password
          </button>
        </form>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">My Orders</h3>
        <div className="bg-primary/20 rounded-lg p-2">
          {orders.length === 0 ? (
            <div className="text-gray-500">No orders yet.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-gray-700">Order #</th>
                  <th className="py-2 px-4 text-gray-700">Date</th>
                  <th className="py-2 px-4 text-gray-700">Total</th>
                  <th className="py-2 px-4 text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-primary/30">
                    <td className="py-2 px-4">{order.id}</td>
                    <td className="py-2 px-4">{order.date}</td>
                    <td className="py-2 px-4">
                      {(order.total || 0).toLocaleString()} EGP
                    </td>
                    <td className="py-2 px-4">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
