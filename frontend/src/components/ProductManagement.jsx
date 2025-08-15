import React, { useState, useEffect, useContext } from "react";
import { productsAPI } from "../api/products";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export default function ProductManagement() {
  const { token, user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ 
    name: "", 
    description: "", 
    price: "", 
    salePercentage: 0,
    images: [], 
    colors: [], 
    category: "", 
    collection: "" 
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [colorInput, setColorInput] = useState({ name: "", hex: "#000000", sizes: [] });
  const [sizeInput, setSizeInput] = useState({ size: "", quantity: 0 });
  const [selectedColorIdx, setSelectedColorIdx] = useState(null);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newCollection, setNewCollection] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkSalePercentage, setBulkSalePercentage] = useState(0);
  const [showSaleEmailModal, setShowSaleEmailModal] = useState(false);
  const [saleEmailData, setSaleEmailData] = useState({
    productIds: [],
    salePercentage: 0,
    saleType: 'product'
  });

  useEffect(() => { 
    productsAPI.getAllProducts().then(result => {
      setProducts(result.products || []);
    }); 
  }, []);

  useEffect(() => {
    if (user?.role === "superadmin") {
      fetch(`${API_BASE_URL}/api/admins/categories-collections`)
        .then(res => res.json())
        .then(data => {
          setCategories(data.categories || []);
          setCollections(data.collections || []);
        });
    }
  }, [user]);

  const handleFormChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageChange = e => setImageFiles([...e.target.files]);

  // --- Color/Size Management ---
  const handleAddSizeToColor = () => {
    if (!sizeInput.size || sizeInput.quantity <= 0) return;
    setColorInput({ ...colorInput, sizes: [...(colorInput.sizes || []), { ...sizeInput }] });
    setSizeInput({ size: "", quantity: 0 });
  };
  const handleEditSizeInColor = (idx, newSize) => {
    setColorInput({
      ...colorInput,
      sizes: colorInput.sizes.map((s, i) => i === idx ? newSize : s)
    });
  };
  const handleDeleteSizeInColor = idx => {
    setColorInput({
      ...colorInput,
      sizes: colorInput.sizes.filter((_, i) => i !== idx)
    });
  };
  const handleAddColor = () => {
    if (!colorInput.name || !colorInput.hex || !colorInput.sizes.length) {
      setError("Each color must have a name, a color, and at least one size.");
      return;
    }
    setForm({ ...form, colors: [...form.colors, { ...colorInput }] });
    setColorInput({ name: "", hex: "#000000", sizes: [] });
    setError("");
  };
  const handleEditColor = idx => {
    setColorInput(form.colors[idx]);
    setForm({ ...form, colors: form.colors.filter((_, i) => i !== idx) });
  };
  const handleDeleteColor = idx => {
    setForm({ ...form, colors: form.colors.filter((_, i) => i !== idx) });
  };

  // --- Category/Collection Management ---
  const handleAddCategory = async () => {
    if (!newCategory) return;
    await fetch(`${API_BASE_URL}/api/admins/add-category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: newCategory })
    });
    setCategories([...categories, newCategory]);
    setNewCategory("");
  };
  const handleDeleteCategory = idx => {
    setCategories(categories.filter((_, i) => i !== idx));
    // Optionally, call backend to remove
  };
  const handleAddCollection = async () => {
    if (!newCollection) return;
    await fetch(`${API_BASE_URL}/api/admins/add-collection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection: newCollection })
    });
    setCollections([...collections, newCollection]);
    setNewCollection("");
  };
  const handleDeleteCollection = idx => {
    setCollections(collections.filter((_, i) => i !== idx));
    // Optionally, call backend to remove
  };

  // --- Form Submission ---
  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Validation
    if (!form.name || !form.price || !form.category || !form.collection) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!form.colors.length) {
      setError("Please add at least one color with sizes.");
      return;
    }
    for (const color of form.colors) {
      if (!color.sizes || !color.sizes.length) {
        setError(`Color '${color.name}' must have at least one size.`);
        return;
      }
      for (const size of color.sizes) {
        if (!size.size || size.quantity <= 0) {
          setError(`Each size for color '${color.name}' must have a name and quantity > 0.`);
          return;
        }
      }
    }
    const productData = { ...form };
    if (imageFiles.length) productData.images = imageFiles;
    if (editing) {
      await productsAPI.editProduct(editing, productData, token);
      setSuccess("Product updated successfully!");
    } else {
      await productsAPI.addProduct(productData, token);
      setSuccess("Product created successfully!");
    }
    setEditing(null);
    setForm({ name: "", description: "", price: "", salePercentage: 0, images: [], colors: [], category: "", collection: "" });
    setImageFiles([]);
    productsAPI.getAllProducts().then(result => {
      setProducts(result.products || []);
    });
  };

  const handleEdit = product => {
    setEditing(product._id);
    setForm({ 
      ...product, 
      salePercentage: product.salePercentage || 0,
      images: [], 
      colors: product.colors || [] 
    });
  };
  
  const handleDelete = async id => {
    await productsAPI.deleteProduct(id, token);
    productsAPI.getAllProducts().then(result => {
      setProducts(result.products || []);
    });
  };

  // --- Sale Management ---
  const handleUpdateSale = async (productId, salePercentage) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sales/product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ salePercentage })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSuccess(result.message);
        if (result.warnings) {
          setError(`Warning: ${result.warnings.join(', ')}`);
        }
        // Refresh products
        productsAPI.getAllProducts().then(result => {
          setProducts(result.products || []);
        });
      } else {
        setError(result.error || 'Failed to update sale');
      }
    } catch (err) {
      setError('Failed to update sale');
      console.error(err);
    }
  };

  const handleBulkSaleUpdate = async () => {
    if (selectedProducts.length === 0) {
      setError("Please select products to update");
      return;
    }
    
    if (bulkSalePercentage < 0 || bulkSalePercentage > 100) {
      setError("Sale percentage must be between 0 and 100");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/sales/bulk`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productIds: selectedProducts,
          salePercentage: bulkSalePercentage
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSuccess(result.message);
        setSelectedProducts([]);
        setBulkSalePercentage(0);
        // Refresh products
        productsAPI.getAllProducts().then(result => {
          setProducts(result.products || []);
        });
      } else {
        setError(result.error || 'Failed to update bulk sale');
      }
    } catch (err) {
      setError('Failed to update bulk sale');
      console.error(err);
    }
  };

  const handleSendSaleEmail = async () => {
    if (saleEmailData.productIds.length === 0) {
      setError("Please select products for the sale email");
      return;
    }
    
    if (saleEmailData.salePercentage < 0 || saleEmailData.salePercentage > 100) {
      setError("Sale percentage must be between 0 and 100");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/sales/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(saleEmailData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSuccess(result.message);
        setShowSaleEmailModal(false);
        setSaleEmailData({ productIds: [], salePercentage: 0, saleType: 'product' });
      } else {
        setError(result.error || 'Failed to send sale email');
      }
    } catch (err) {
      setError('Failed to send sale email');
      console.error(err);
    }
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getEffectiveSalePrice = (product) => {
    const salePercentage = product.salePercentage || 0;
    if (salePercentage > 0) {
      return Math.round(product.price * (1 - salePercentage / 100));
    }
    return product.price;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

      {/* Sale Management Section */}
      <div className="bg-white p-4 rounded-xl shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Sale Management</h3>
        
        {/* Bulk Sale Update */}
        <div className="mb-6 p-4 border rounded-lg">
          <h4 className="font-medium mb-3">Bulk Sale Update</h4>
          <div className="flex items-center space-x-4 mb-3">
            <input
              type="number"
              min="0"
              max="100"
              value={bulkSalePercentage}
              onChange={(e) => setBulkSalePercentage(parseInt(e.target.value) || 0)}
              placeholder="Sale %"
              className="border p-2 rounded w-24"
            />
            <button
              onClick={handleBulkSaleUpdate}
              disabled={selectedProducts.length === 0}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Update {selectedProducts.length} Products
            </button>
            <button
              onClick={() => setShowSaleEmailModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Send Sale Email
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Select products below to apply bulk sale or send promotional email
          </p>
        </div>
      </div>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow mb-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleFormChange} placeholder="Name" className="border p-2 rounded" required />
          <input name="price" value={form.price} onChange={handleFormChange} placeholder="Price" type="number" className="border p-2 rounded" required />
          <input name="salePercentage" value={form.salePercentage} onChange={handleFormChange} placeholder="Sale %" type="number" min="0" max="100" className="border p-2 rounded" />
          {/* Category dropdown for superadmin */}
          {user?.role === "superadmin" ? (
            <div className="flex items-center space-x-2">
              <select name="category" value={form.category} onChange={handleFormChange} className="border p-2 rounded w-full">
                <option value="">Select Category</option>
                {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
              </select>
              <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Add Category" className="border p-2 rounded" />
              <button type="button" onClick={handleAddCategory} className="bg-primary-dark text-white px-2 py-1 rounded">+</button>
              {categories.map((cat, i) => (
                <button key={i} type="button" onClick={() => handleDeleteCategory(i)} className="ml-1 text-xs text-red-500">x</button>
              ))}
            </div>
          ) : (
            <input name="category" value={form.category} onChange={handleFormChange} placeholder="Category" className="border p-2 rounded" />
          )}
          {/* Collection dropdown for superadmin */}
          {user?.role === "superadmin" ? (
            <div className="flex items-center space-x-2">
              <select name="collection" value={form.collection} onChange={handleFormChange} className="border p-2 rounded w-full">
                <option value="">Select Collection</option>
                {collections.map((col, i) => <option key={i} value={col}>{col}</option>)}
              </select>
              <input value={newCollection} onChange={e => setNewCollection(e.target.value)} placeholder="Add Collection" className="border p-2 rounded" />
              <button type="button" onClick={handleAddCollection} className="bg-primary-dark text-white px-2 py-1 rounded">+</button>
              {collections.map((col, i) => (
                <button key={i} type="button" onClick={() => handleDeleteCollection(i)} className="ml-1 text-xs text-red-500">x</button>
              ))}
            </div>
          ) : (
            <input name="collection" value={form.collection} onChange={handleFormChange} placeholder="Collection" className="border p-2 rounded" />
          )}
        </div>
        <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Description" className="border p-2 rounded w-full" />
        <input type="file" multiple onChange={handleImageChange} className="border p-2 rounded w-full" />
        {/* Colors and sizes */}
        <div className="mb-2">
          <div className="flex space-x-2 mb-2">
            <input placeholder="Color Name" value={colorInput.name} onChange={e => setColorInput({ ...colorInput, name: e.target.value })} className="border p-2 rounded" />
            <input type="color" value={colorInput.hex} onChange={e => setColorInput({ ...colorInput, hex: e.target.value })} className="border p-2 rounded w-12 h-12" />
            <button type="button" onClick={handleAddColor} className="bg-primary-dark text-white px-4 py-2 rounded">Add Color</button>
          </div>
          {/* Add sizes to the color being created */}
          <div className="flex space-x-2 mb-2">
            <input placeholder="Size" value={sizeInput.size} onChange={e => setSizeInput({ ...sizeInput, size: e.target.value })} className="border p-2 rounded" />
            <input placeholder="Quantity" type="number" value={sizeInput.quantity} onChange={e => setSizeInput({ ...sizeInput, quantity: parseInt(e.target.value) || 0 })} className="border p-2 rounded" />
            <button type="button" onClick={handleAddSizeToColor} className="bg-primary-dark text-white px-4 py-2 rounded">Add Size</button>
          </div>
          {/* Display sizes for the color being created */}
          {colorInput.sizes && colorInput.sizes.length > 0 && (
            <div className="mb-2">
              <p>Sizes for {colorInput.name}:</p>
              {colorInput.sizes.map((size, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span>{size.size} - {size.quantity}</span>
                  <button type="button" onClick={() => handleDeleteSizeInColor(idx)} className="text-red-500">x</button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Display added colors */}
        {form.colors && form.colors.length > 0 && (
          <div className="mb-4">
            <p>Added Colors:</p>
            {form.colors.map((color, idx) => (
              <div key={idx} className="flex items-center space-x-2 mb-2">
                <div style={{ backgroundColor: color.hex, width: 20, height: 20, borderRadius: '50%' }}></div>
                <span>{color.name}</span>
                <span>({color.sizes.length} sizes)</span>
                <button type="button" onClick={() => handleEditColor(idx)} className="text-blue-500">Edit</button>
                <button type="button" onClick={() => handleDeleteColor(idx)} className="text-red-500">Delete</button>
              </div>
            ))}
          </div>
        )}
        <button type="submit" className="bg-primary-dark text-white px-4 py-2 rounded">{editing ? "Update Product" : "Add Product"}</button>
      </form>

      {/* Products List */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="p-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(products.map(p => p._id));
                      } else {
                        setSelectedProducts([]);
                      }
                    }}
                  />
                </th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Sale</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Collection</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="border-b">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => toggleProductSelection(product._id)}
                    />
                  </td>
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">
                    <div>
                      <span className={product.salePercentage > 0 ? "line-through text-gray-500" : ""}>
                        {product.price} EGP
                      </span>
                      {product.salePercentage > 0 && (
                        <div className="text-red-600 font-bold">
                          {getEffectiveSalePrice(product)} EGP
                          <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                            {product.salePercentage}% OFF
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={product.salePercentage || 0}
                      onChange={(e) => handleUpdateSale(product._id, parseInt(e.target.value) || 0)}
                      className="border p-1 rounded w-16"
                    />
                  </td>
                  <td className="p-2">{product.category}</td>
                  <td className="p-2">{product.collection}</td>
                  <td className="p-2">
                    <button onClick={() => handleEdit(product)} className="text-blue-500 mr-2">Edit</button>
                    <button onClick={() => handleDelete(product._id)} className="text-red-500">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sale Email Modal */}
      {showSaleEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Send Sale Email</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sale Percentage</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={saleEmailData.salePercentage}
                  onChange={(e) => setSaleEmailData({
                    ...saleEmailData,
                    salePercentage: parseInt(e.target.value) || 0
                  })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sale Type</label>
                <select
                  value={saleEmailData.saleType}
                  onChange={(e) => setSaleEmailData({
                    ...saleEmailData,
                    saleType: e.target.value
                  })}
                  className="border p-2 rounded w-full"
                >
                  <option value="product">Product Sale</option>
                  <option value="category">Category Sale</option>
                  <option value="collection">Collection Sale</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Selected Products ({selectedProducts.length})
                </label>
                <p className="text-sm text-gray-600">
                  {selectedProducts.length} products will be included in the sale email
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSendSaleEmail}
                  className="bg-green-500 text-white px-4 py-2 rounded flex-1"
                >
                  Send Email
                </button>
                <button
                  onClick={() => setShowSaleEmailModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 