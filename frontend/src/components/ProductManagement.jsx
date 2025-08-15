import React, { useState, useEffect, useContext } from "react";
import { productsAPI } from "../api/products";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export default function ProductManagement() {
  const { token, user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", images: [], colors: [], category: "", collection: "", onSale: false });
  const [imageFiles, setImageFiles] = useState([]);
  const [colorInput, setColorInput] = useState({ name: "", hex: "#000000", sizes: [] });
  const [sizeInput, setSizeInput] = useState({ size: "", quantity: 0 });
  const [selectedColorIdx, setSelectedColorIdx] = useState(null);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newCollection, setNewCollection] = useState("");
  const [error, setError] = useState("");

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
    } else {
      await productsAPI.addProduct(productData, token);
    }
    setEditing(null);
    setForm({ name: "", description: "", price: "", images: [], colors: [], category: "", collection: "", onSale: false });
    setImageFiles([]);
    productsAPI.getAllProducts().then(result => {
      setProducts(result.products || []);
    });
  };

  const handleEdit = product => {
    setEditing(product._id);
    setForm({ ...product, images: [], colors: product.colors || [] });
  };
  const handleDelete = async id => {
    await productsAPI.deleteProduct(id, token);
    productsAPI.getAllProducts().then(result => {
      setProducts(result.products || []);
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow mb-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleFormChange} placeholder="Name" className="border p-2 rounded" required />
          <input name="price" value={form.price} onChange={handleFormChange} placeholder="Price" type="number" className="border p-2 rounded" required />
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
            <input placeholder="Quantity" type="number" value={sizeInput.quantity} onChange={e => setSizeInput({ ...sizeInput, quantity: Number(e.target.value) })} className="border p-2 rounded" />
            <button type="button" onClick={handleAddSizeToColor} className="bg-primary-dark text-white px-4 py-2 rounded">Add Size</button>
          </div>
          {/* Show sizes for the color being created, with edit/delete */}
          <div className="flex flex-col space-y-1 mb-2">
            {colorInput.sizes?.map((s, i) => (
              <div key={i} className="flex items-center space-x-2">
                <span className="px-2 py-1 rounded bg-gray-100 border">{s.size} ({s.quantity})</span>
                <button type="button" onClick={() => handleEditSizeInColor(i, { ...s, size: prompt('Edit size', s.size) || s.size })} className="text-xs text-blue-500">Edit</button>
                <button type="button" onClick={() => handleDeleteSizeInColor(i)} className="text-xs text-red-500">Delete</button>
              </div>
            ))}
          </div>
          {/* Show all colors and their sizes, with edit/delete */}
          <div className="mt-2">
            {form.colors.map((c, i) => (
              <div key={i} className="mb-1 flex items-center space-x-2">
                <span className="px-2 py-1 rounded bg-gray-100 border" style={{ backgroundColor: c.hex }}>{c.name}</span>
                <span className="text-xs text-gray-500">[
                  {c.sizes?.map((s, j) => <span key={j}>{s.size}({s.quantity}){j < c.sizes.length - 1 ? ', ' : ''}</span>)}
                ]</span>
                <button type="button" onClick={() => handleEditColor(i)} className="text-xs text-blue-500">Edit</button>
                <button type="button" onClick={() => handleDeleteColor(i)} className="text-xs text-red-500">Delete</button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" checked={form.onSale} onChange={e => setForm({ ...form, onSale: e.target.checked })} />
          <span>On Sale</span>
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button type="submit" className="bg-primary-dark text-white px-6 py-2 rounded font-bold">{editing ? "Update" : "Add"} Product</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product._id} className="bg-white p-4 rounded-xl shadow flex flex-col">
            <img src={product.images?.[0]} alt={product.name} className="h-40 object-cover rounded mb-2" />
            <div className="font-bold text-lg mb-1">{product.name}</div>
            <div className="text-primary-dark font-semibold mb-1">{product.price?.toLocaleString()} EGP</div>
            <div className="flex space-x-2 mb-2">
              {product.colors?.map((c, i) => <span key={i} className="w-4 h-4 rounded-full border" style={{ backgroundColor: c.hex }} title={c.name}></span>)}
            </div>
            <div className="flex-1"></div>
            <div className="flex space-x-2 mt-2">
              <button onClick={() => handleEdit(product)} className="bg-yellow-400 px-3 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 