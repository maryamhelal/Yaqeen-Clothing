import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ProductManagement from "../components/ProductManagement";
import OrderManagement from "../components/OrderManagement";
import AdminManagement from "../components/AdminManagement";
import UserManagement from "../components/UserManagement";

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const [tab, setTab] = useState("products");

  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return <div className="p-8 text-center text-red-600 font-bold">Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="flex flex-wrap gap-2 md:space-x-4 mb-8">
        <button onClick={() => setTab("products")} className={`px-4 py-2 rounded-lg font-semibold ${tab === "products" ? "bg-primary-dark text-white" : "bg-white text-gray-800"}`}>Products</button>
        <button onClick={() => setTab("orders")} className={`px-4 py-2 rounded-lg font-semibold ${tab === "orders" ? "bg-primary-dark text-white" : "bg-white text-gray-800"}`}>Orders</button>
        {user.role === "superadmin" && (
          <>
            <button onClick={() => setTab("admins")} className={`px-4 py-2 rounded-lg font-semibold ${tab === "admins" ? "bg-primary-dark text-white" : "bg-white text-gray-800"}`}>Admins</button>
            <button onClick={() => setTab("users")} className={`px-4 py-2 rounded-lg font-semibold ${tab === "users" ? "bg-primary-dark text-white" : "bg-white text-gray-800"}`}>Users</button>
          </>
        )}
      </div>
      {tab === "products" && <ProductManagement />}
      {tab === "orders" && <OrderManagement />}
      {tab === "admins" && user.role === "superadmin" && <AdminManagement />}
      {tab === "users" && user.role === "superadmin" && <UserManagement />}
    </div>
  );
} 