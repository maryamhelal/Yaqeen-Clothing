import React, { useEffect, useState } from "react";
import CategoryCard from "../components/CategoryCard";

export default function LandingPage() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products/categories`)
      .then(res => res.json())
      .then(setCategories);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Discover Your Style
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of elegant and modest fashion pieces designed for the modern woman
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <CategoryCard key={cat} name={cat} image={null} />
          ))}
        </div>
      </div>

      {/* Featured Section -- TBD */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Summer Collection</h3>
              <p className="text-gray-600 mb-4">Light and breezy pieces perfect for warm weather</p>
              <button className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors">
                Shop Now
              </button>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Elegant Abayas</h3>
              <p className="text-gray-600 mb-4">Timeless designs that combine tradition with modern elegance</p>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Explore
              </button>
            </div>
            <div className="bg-gradient-to-br from-gray-100 to-pink-100 rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Accessories</h3>
              <p className="text-gray-600 mb-4">Complete your look with our carefully curated accessories</p>
              <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                Discover
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 