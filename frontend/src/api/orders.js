const API_BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const ordersAPI = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get order by ID
  getOrder: async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  },

  // Get user orders
  getUserOrders: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders?user=${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  },

  // Get all orders (admin)
  getAllOrders: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return [];
    }
  }
}; 