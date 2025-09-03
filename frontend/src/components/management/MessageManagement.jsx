import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { messagesAPI } from "../../api/messages";

const MessageManagement = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await messagesAPI.getAllMessages(token);
        setMessages(res.data || res.data?.data || []);
      } catch (err) {
        setMessages([]);
      }
      setLoading(false);
    };
    fetchMessages();
  }, [token]);

  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return <div className="p-8 text-center">Access denied.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Message</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id}>
                <td className="border p-2">{msg.name}</td>
                <td className="border p-2">{msg.email}</td>
                <td className="border p-2">{msg.phone}</td>
                <td className="border p-2">{msg.category || "-"}</td>
                <td className="border p-2">{msg.message}</td>
                <td className="border p-2">
                  {new Date(msg.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MessageManagement;
