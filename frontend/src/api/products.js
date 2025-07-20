const API_BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const productsAPI = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products?category=${category}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },

  // Get single product
  getProduct: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },
  // Add product (admin)
  addProduct: async (productData, token) => {
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return await response.json();
  },
  // Edit product (admin)
  editProduct: async (id, productData, token) => {
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return await response.json();
  },
  // Delete product (admin)
  deleteProduct: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  },
  // Get by collection
  getProductsByCollection: async (collection) => {
    const response = await fetch(`${API_BASE_URL}/products/collection/${collection}`);
    return await response.json();
  }
}; 