import React from "react";

// cityOptions: [{ label: 'Cairo, Giza', value: 'cairo_giza', price: 70 }, ...]
export default function CitySelectTable({ value, onChange, cityOptions }) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2">Shipping method</h3>
      <div className="border rounded-lg divide-y bg-white">
        {cityOptions.map((city) => (
          <label
            key={city.value}
            className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
              value === city.value ? "bg-blue-50 border-blue-500" : "hover:bg-gray-50"
            }`}
            style={{ borderLeft: value === city.value ? '4px solid #2563eb' : '4px solid transparent' }}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="city"
                value={city.value}
                checked={value === city.value}
                onChange={() => onChange(city.value)}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="font-medium text-gray-800">{city.label}</span>
            </div>
            <span className="font-semibold text-gray-700">E£{city.price.toFixed(2)}</span>
          </label>
        ))}
      </div>
    </div>
  );
} 