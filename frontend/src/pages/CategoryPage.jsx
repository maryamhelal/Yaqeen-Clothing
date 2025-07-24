import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { productsAPI } from "../api/products";

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productsAPI.getProductsByCategory(categoryName).then(setProducts);
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-800 capitalize mb-4">{categoryName}</h1>
          <p className="text-lg text-gray-600">
            Discover our beautiful collection of {categoryName.toLowerCase()}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No products found in this category.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.filter(Boolean).map((product, idx) => (
              <ProductCard key={product.id || idx} {...product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 