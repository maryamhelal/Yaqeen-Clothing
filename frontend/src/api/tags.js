const API_BASE_URL = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api`;

export const tagsAPI = {
  // Create new tag
  createTag: async (tagData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create tag');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  },

  // Get tag by name
  getTagByName: async (name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tags/name/${encodeURIComponent(name)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Tag not found');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching tag:', error);
      throw error;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tags/categories`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch categories');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get all collections
  getCollections: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tags/collections`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch collections');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  },

  // Delete tag by name
  deleteTag: async (name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tags/name/${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete tag');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  },

  // Add sale to tag
  addTagSale: async (saleData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tags/add-sale`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saleData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add sale to tag');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding sale to tag:', error);
      throw error;
    }
  },
};
