import { useEffect, useState } from "react";
import { productsAPI } from "../../api/products";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { tagsAPI } from "../../api/tags";
import { promocodesAPI } from "../../api/promocodes";

export default function PromocodeManagement() {
  const { token } = useContext(AuthContext);
  const [promocodes, setPromocodes] = useState([]);
  const [form, setForm] = useState({
    code: "",
    percentage: 0,
    type: "product",
    targetId: "",
    maxUses: 1,
    expiry: "",
    active: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const fetchPromocodes = async () => {
    setFetchError("");
    try {
      const data = await promocodesAPI.getAllPromocodes(token);
      setPromocodes(Array.isArray(data) ? data : []);
    } catch (err) {
      setFetchError("Failed to fetch promocodes: " + err.message);
    }
  };
  useEffect(() => {
    fetchPromocodes();
  }, []);

  // Fetch items when type changes
  useEffect(() => {
    setFetchError("");
    if (form.type === "product") {
      setLoadingProducts(true);
      productsAPI
        .getAllProducts(1, 1000)
        .then((res) => setProducts(res.products || []))
        .catch((err) =>
          setFetchError("Failed to fetch products: " + err.message)
        )
        .finally(() => setLoadingProducts(false));
    } else if (form.type === "category") {
      setLoadingCategories(true);
      tagsAPI
        .getCategories()
        .then((res) =>
          setCategories(Array.isArray(res) ? res : res.categories || [])
        )
        .catch((err) =>
          setFetchError("Failed to fetch categories: " + err.message)
        )
        .finally(() => setLoadingCategories(false));
    } else if (form.type === "collection") {
      setLoadingCollections(true);
      tagsAPI
        .getCollections()
        .then((res) =>
          setCollections(Array.isArray(res) ? res : res.collections || [])
        )
        .catch((err) =>
          setFetchError("Failed to fetch collections: " + err.message)
        )
        .finally(() => setLoadingCollections(false));
    }
  }, [form.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "targetId") {
      let targetName = "";
      if (form.type === "product") {
        const prod = products.find((p) => p._id === value);
        targetName = prod ? prod.name : "";
      } else if (form.type === "category") {
        const cat = categories.find((c) => c._id === value);
        targetName = cat ? cat.name : "";
      } else if (form.type === "collection") {
        const coll = collections.find((c) => c._id === value);
        targetName = coll ? coll.name : "";
      }
      setForm({ ...form, targetId: value, targetName });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = editingId
        ? await promocodesAPI.updatePromocode(token, editingId, form)
        : await promocodesAPI.createPromocode(token, form);
      setPromocodes((prev) =>
        prev.map((p) => (p._id === editingId ? data : p))
      );
      setForm({
        code: "",
        percentage: 0,
        type: "product",
        targetId: "",
        maxUses: 1,
        expiry: "",
        active: true,
      });
      setEditingId(null);
      fetchPromocodes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (p) => {
    setForm({ ...p, expiry: p.expiry ? p.expiry.slice(0, 10) : "" });
    setEditingId(p._id);
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this promocode?")) return;
    try {
      await promocodesAPI.deletePromocode(token, id);
    } catch (err) {
      setError(err.message);
    }
    fetchPromocodes();
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Promocode Management</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        {error && <div className="text-red-500">{error}</div>}
        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="Code"
          className="border px-3 py-2 rounded w-full"
          required
        />
        <input
          name="percentage"
          type="number"
          value={form.percentage}
          onChange={handleChange}
          placeholder="Discount %"
          className="border px-3 py-2 rounded w-full"
          required
          min={1}
          max={100}
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="product">Product</option>
          <option value="category">Category</option>
          <option value="collection">Collection</option>
        </select>
        {form.type === "product" && (
          <>
            {loadingProducts ? (
              <div className="text-gray-500">Loading products...</div>
            ) : fetchError ? (
              <div className="text-red-500">{fetchError}</div>
            ) : products.length === 0 ? (
              <div className="text-gray-500">No products found.</div>
            ) : (
              <select
                name="targetId"
                value={form.targetId}
                onChange={handleChange}
                className="border px-3 py-2 rounded w-full"
                required
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
          </>
        )}
        {form.type === "category" && (
          <>
            {loadingCategories ? (
              <div className="text-gray-500">Loading categories...</div>
            ) : fetchError ? (
              <div className="text-red-500">{fetchError}</div>
            ) : categories.length === 0 ? (
              <div className="text-gray-500">No categories found.</div>
            ) : (
              <select
                name="targetId"
                value={form.targetId}
                onChange={handleChange}
                className="border px-3 py-2 rounded w-full"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat, i) => (
                  <option key={cat._id || i} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </>
        )}
        {form.type === "collection" && (
          <>
            {loadingCollections ? (
              <div className="text-gray-500">Loading collections...</div>
            ) : fetchError ? (
              <div className="text-red-500">{fetchError}</div>
            ) : collections.length === 0 ? (
              <div className="text-gray-500">No collections found.</div>
            ) : (
              <select
                name="targetId"
                value={form.targetId}
                onChange={handleChange}
                className="border px-3 py-2 rounded w-full"
                required
              >
                <option value="">Select Collection</option>
                {collections.map((coll, i) => (
                  <option key={coll._id || i} value={coll._id}>
                    {coll.name}
                  </option>
                ))}
              </select>
            )}
          </>
        )}
        <input
          name="maxUses"
          type="number"
          value={form.maxUses}
          onChange={handleChange}
          placeholder="Max Uses"
          className="border px-3 py-2 rounded w-full"
          required
          min={1}
        />
        <input
          name="expiry"
          type="date"
          value={form.expiry}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
        />
        <label className="flex items-center gap-2">
          <input
            name="active"
            type="checkbox"
            checked={form.active}
            onChange={(e) =>
              setForm((f) => ({ ...f, active: e.target.checked }))
            }
          />
          Active
        </label>
        <button
          type="submit"
          className="bg-primary-dark text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Add"} Promocode
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({
                code: "",
                percentage: 0,
                type: "product",
                targetId: "",
                maxUses: 1,
                expiry: "",
                active: true,
              });
            }}
            className="ml-2 px-4 py-2 border rounded"
          >
            Cancel
          </button>
        )}
      </form>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Code</th>
            <th>%</th>
            <th>Type</th>
            <th>Target</th>
            <th>Max Uses</th>
            <th>Used</th>
            <th>Expiry</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(promocodes) && promocodes.length > 0 ? (
            promocodes.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="px-2">{p.code}</td>
                <td className="px-2">{p.percentage}</td>
                <td className="px-2">{p.type}</td>
                <td className="px-2">{p.targetName || p.targetId}</td>
                <td className="px-2">{p.maxUses}</td>
                <td className="px-2">{p.uses}</td>
                <td className="px-2">
                  {p.expiry ? p.expiry.slice(0, 10) : "-"}
                </td>
                <td className="px-2">{p.active ? "Yes" : "No"}</td>
                <td>
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center text-gray-500">
                No promocodes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
