const API_BASE_URL = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api`;

export const messagesAPI = {
  // Create new message
  createMessage: async (messageData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create message');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  },

  // Get all messages (Admin only)
  getAllMessages: async (token, page = 1, limit = 10, status = '') => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
      });

      const response = await fetch(`${API_BASE_URL}/messages?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch messages');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Get messages by user email
  getUserMessages: async (userEmail, page = 1, limit = 10) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/messages/${encodeURIComponent(userEmail)}?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user messages');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user messages:', error);
      throw error;
    }
  },

  // Mark message as read (Admin only)
  markMessageAsRead: async (messageId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to mark message as read');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  },

  // Reply to message (Admin only)
  replyToMessage: async (messageId, replyData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(replyData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reply to message');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error replying to message:', error);
      throw error;
    }
  },
};
