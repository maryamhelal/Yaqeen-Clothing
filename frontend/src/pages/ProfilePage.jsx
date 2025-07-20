import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const orders = [
    { id: 1, date: "2024-07-17", total: 3200, status: "Delivered" },
    { id: 2, date: "2024-07-10", total: 1750, status: "Shipped" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-160px)] bg-primary flex items-center justify-center py-2">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No User Data</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
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
    <div className="bg-primary flex items-center justify-center py-12 px-4">
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
            Address: <span className="font-normal">{user.address}</span>
          </div>
        </div>
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
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-primary/30">
                    <td className="py-2 px-4">{order.id}</td>
                    <td className="py-2 px-4">{order.date}</td>
                    <td className="py-2 px-4">{order.total.toLocaleString()} EGP</td>
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