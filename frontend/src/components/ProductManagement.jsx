import React, { useState, useEffect, useContext } from "react";
import { productsAPI } from "../api/products";
import { AuthContext } from "../context/AuthContext";

export default function ProductManagement() {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", images: [], colors: [], sizes: [], category: "", collection: "", onSale: false });
  const [imageFiles, setImageFiles] = useState([]);
  const [colorInput, setColorInput] = useState({ name: "", hex: "", images: [] });
  const [sizeInput, setSizeInput] = useState({ size: "", quantity: 0 });

  useEffect(() => { productsAPI.getAllProducts().then(setProducts); }, []);

  const handleFormChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageChange = e => setImageFiles([...e.target.files]);

  const handleAddColor = () => {
    setForm({ ...form, colors: [...form.colors, { ...colorInput, images: [] }] });
    setColorInput({ name: "", hex: "", images: [] });
  };
  const handleAddSize = () => {
    setForm({ ...form, sizes: [...form.sizes, { ...sizeInput }] });
    setSizeInput({ size: "", quantity: 0 });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const productData = { ...form };
    if (imageFiles.length) productData.images = imageFiles;
    if (editing) {
      await productsAPI.editProduct(editing, productData, token);
    } else {
      await productsAPI.addProduct(productData, token);
    }
    setEditing(null); setForm({ name: "", description: "", price: "", images: [], colors: [], sizes: [], category: "", collection: "", onSale: false }); setImageFiles([]);
    productsAPI.getAllProducts().then(setProducts);
  };

  const handleEdit = product => {
    setEditing(product._id);
    setForm({ ...product, images: [], colors: product.colors || [], sizes: product.sizes || [] });
  };
  const handleDelete = async id => {
    await productsAPI.deleteProduct(id, token);
    productsAPI.getAllProducts().then(setProducts);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow mb-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleFormChange} placeholder="Name" className="border p-2 rounded" required />
          <input name="price" value={form.price} onChange={handleFormChange} placeholder="Price" type="number" className="border p-2 rounded" required />
          <input name="category" value={form.category} onChange={handleFormChange} placeholder="Category" className="border p-2 rounded" />
          <input name="collection" value={form.collection} onChange={handleFormChange} placeholder="Collection" className="border p-2 rounded" />
        </div>
        <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Description" className="border p-2 rounded w-full" />
        <input type="file" multiple onChange={handleImageChange} className="border p-2 rounded w-full" />
        {/* Colors */}
        <div>
          <div className="flex space-x-2 mb-2">
            <input placeholder="Color Name" value={colorInput.name} onChange={e => setColorInput({ ...colorInput, name: e.target.value })} className="border p-2 rounded" />
            <input placeholder="#hex" value={colorInput.hex} onChange={e => setColorInput({ ...colorInput, hex: e.target.value })} className="border p-2 rounded" />
            <button type="button" onClick={handleAddColor} className="bg-primary-dark text-white px-4 py-2 rounded">Add Color</button>
          </div>
          <div className="flex space-x-2">
            {form.colors.map((c, i) => <span key={i} className="px-2 py-1 rounded bg-gray-100 border" style={{ backgroundColor: c.hex }}>{c.name}</span>)}
          </div>
        </div>
        {/* Sizes */}
        <div>
          <div className="flex space-x-2 mb-2">
            <input placeholder="Size" value={sizeInput.size} onChange={e => setSizeInput({ ...sizeInput, size: e.target.value })} className="border p-2 rounded" />
            <input placeholder="Quantity" type="number" value={sizeInput.quantity} onChange={e => setSizeInput({ ...sizeInput, quantity: Number(e.target.value) })} className="border p-2 rounded" />
            <button type="button" onClick={handleAddSize} className="bg-primary-dark text-white px-4 py-2 rounded">Add Size</button>
          </div>
          <div className="flex space-x-2">
            {form.sizes.map((s, i) => <span key={i} className="px-2 py-1 rounded bg-gray-100 border">{s.size} ({s.quantity})</span>)}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" checked={form.onSale} onChange={e => setForm({ ...form, onSale: e.target.checked })} />
          <span>On Sale</span>
        </div>
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