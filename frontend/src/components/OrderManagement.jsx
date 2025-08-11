import React, { useState, useEffect, useContext } from "react";
import { ordersAPI } from "../api/orders";
import { AuthContext } from "../context/AuthContext";

export default function OrderManagement() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});

  useEffect(() => {
    ordersAPI.getAllOrders(token).then(setOrders);
  }, [token]);

  const handleStatusChange = (orderNumber, status) => {
    setStatusUpdate({ ...statusUpdate, [orderNumber]: status });
  };

  const handleUpdate = async (orderNumber) => {
    await ordersAPI.updateOrderStatus(orderNumber, statusUpdate[orderNumber], token);
    ordersAPI.getAllOrders(token).then(setOrders);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead>
            <tr>
              <th className="p-2">Order #</th>
              <th className="p-2">Orderer</th>
              <th className="p-2">Status</th>
              <th className="p-2">Total</th>
              <th className="p-2">Details</th>
              <th className="p-2">Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 && orders.map(order => (
              <tr key={order.orderNumber}>
                <td className="p-2 font-bold">{order.orderNumber}</td>
                <td className="p-2">{order.orderer?.name || "Guest"}</td>
                <td className="p-2">
                  <select value={statusUpdate[order.orderNumber] || order.status} onChange={e => handleStatusChange(order.orderNumber, e.target.value)}>
                    {['pending', 'paid', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-2">{order.totalPrice?.toLocaleString()} EGP</td>
                <td className="p-2">
                  <details>
                    <summary>View</summary>
                    <div>
                      {order.items?.map((item, i) => (
                        <div key={i} className="mb-2">
                          <div>{item.name} ({item.size}, {item.color}) x {item.quantity}</div>
                          <div>{item.price?.toLocaleString()} EGP</div>
                        </div>
                      ))}
                      <div>Shipping: {order.shippingAddress?.address}</div>
                      <div>Phone: {order.shippingAddress?.phone}</div>
                    </div>
                  </details>
                </td>
                <td className="p-2">
                  <button onClick={() => handleUpdate(order.orderNumber)} className="bg-primary-dark text-white px-3 py-1 rounded">Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 