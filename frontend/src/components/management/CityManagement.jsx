import { useState, useEffect } from "react";
import { citiesAPI } from "../../api/cities";
import { useAuth } from "../../context/AuthContext";

export default function CityManagement() {
  const { token } = useAuth();
  const [cities, setCities] = useState([]);
  const [editingCity, setEditingCity] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", areas: [] });
  const [areaInput, setAreaInput] = useState("");
  const [editingAreaIdx, setEditingAreaIdx] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await citiesAPI.getCities();
      setCities(res);
    } catch (err) {
      setError("Failed to fetch cities");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleEdit = (city) => {
    setEditingCity(city._id);
    setForm({
      name: city.name,
      price: city.price,
      areas: Array.isArray(city.areas) ? [...city.areas] : [],
    });
    setAreaInput("");
    setEditingAreaIdx(null);
  };

  const handleDelete = async (cityId) => {
    setLoading(true);
    setError("");
    try {
      await citiesAPI.deleteCity(cityId, token);
      await fetchCities();
    } catch (err) {
      setError("Failed to delete city");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const payload = {
      name: form.name,
      price: Number(form.price),
      areas: form.areas,
    };
    try {
      if (editingCity) {
        await citiesAPI.updateCity(editingCity, payload, token);
      } else {
        await citiesAPI.createCity(payload, token);
      }
      setEditingCity(null);
      setForm({ name: "", price: "", areas: [] });
      setAreaInput("");
      setEditingAreaIdx(null);
      await fetchCities();
    } catch (err) {
      setError("Failed to save city");
    }
    setLoading(false);
  };

  // Area management
  const handleAddArea = () => {
    const name = areaInput.trim();
    if (!name) return;
    if (form.areas.includes(name)) return;
    setForm({ ...form, areas: [...form.areas, name] });
    setAreaInput("");
    setEditingAreaIdx(null);
  };

  const handleEditArea = (idx) => {
    setAreaInput(form.areas[idx]);
    setEditingAreaIdx(idx);
  };

  const handleSaveAreaEdit = () => {
    const name = areaInput.trim();
    if (!name) return;
    if (form.areas.includes(name) && form.areas[editingAreaIdx] !== name)
      return;
    const newAreas = [...form.areas];
    newAreas[editingAreaIdx] = name;
    setForm({ ...form, areas: newAreas });
    setAreaInput("");
    setEditingAreaIdx(null);
  };

  const handleDeleteArea = (idx) => {
    setForm({ ...form, areas: form.areas.filter((_, i) => i !== idx) });
    setAreaInput("");
    setEditingAreaIdx(null);
  };

  const handleMoveArea = (idx, dir) => {
    const newAreas = [...form.areas];
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newAreas.length) return;
    [newAreas[idx], newAreas[targetIdx]] = [newAreas[targetIdx], newAreas[idx]];
    setForm({ ...form, areas: newAreas });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4">City & Area Management</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block font-medium mb-1">City Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Shipping Price (EGP)</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Areas</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={areaInput}
              onChange={(e) => setAreaInput(e.target.value)}
              className="border rounded px-3 py-2 flex-1"
              placeholder="Add area name"
            />
            {editingAreaIdx !== null ? (
              <button
                type="button"
                className="bg-blue-600 text-white px-3 py-2 rounded"
                onClick={handleSaveAreaEdit}
              >
                Save
              </button>
            ) : (
              <button
                type="button"
                className="bg-primary-dark text-white px-3 py-2 rounded"
                onClick={handleAddArea}
              >
                Add Area
              </button>
            )}
          </div>
          <div className="space-y-1">
            {form.areas.map((area, idx) => (
              <div key={area} className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-gray-100 border font-mono">
                  {area}
                </span>
                <button
                  type="button"
                  className="text-blue-600 underline"
                  onClick={() => handleEditArea(idx)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-red-600 underline"
                  onClick={() => handleDeleteArea(idx)}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="text-gray-600"
                  disabled={idx === 0}
                  onClick={() => handleMoveArea(idx, "up")}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="text-gray-600"
                  disabled={idx === form.areas.length - 1}
                  onClick={() => handleMoveArea(idx, "down")}
                >
                  ↓
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="bg-primary-dark text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {editingCity ? "Update City" : "Add City"}
        </button>
        {editingCity && (
          <button
            type="button"
            className="ml-4 text-gray-600 underline"
            onClick={() => {
              setEditingCity(null);
              setForm({ name: "", price: "", areas: [] });
              setAreaInput("");
              setEditingAreaIdx(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">City</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Areas</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city._id}>
              <td className="border p-2 font-semibold">{city.name}</td>
              <td className="border p-2">{city.price} EGP</td>
              <td className="border p-2">
                {Array.isArray(city.areas)
                  ? city.areas.map((area) => (
                      <span
                        key={area}
                        className="px-2 py-1 rounded bg-gray-100 border font-mono"
                      >
                        {area}
                      </span>
                    ))
                  : null}
              </td>
              <td className="border p-2">
                <button
                  className="text-blue-600 underline mr-2"
                  onClick={() => handleEdit(city)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 underline"
                  onClick={() => handleDelete(city._id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
