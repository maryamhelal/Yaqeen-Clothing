import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import test1 from "../assets/test 1.jpg";
import test2 from "../assets/test 2.jpg";
import test3 from "../assets/test 3.jpg";
import test4 from "../assets/test 4.jpg";
import test5 from "../assets/test 5.jpg";
import test6 from "../assets/test 6.jpg";
import { productsAPI } from "../api/products";

// Dummy data for demonstration; replace with API call
const allProducts = [
  // Dresses
  { id: 1, name: "Printed Chiffon Dress - Blue", price: 1750, image: test1, category: "dresses" },
  { id: 2, name: "Printed Chiffon Dress - Black", price: 1750, image: test2, category: "dresses" },
  { id: 3, name: "Draped Dress", price: 2000, image: test3, category: "dresses" },
  { id: 4, name: "Printed Chiffon Dress - Blue", price: 1750, image: test4, category: "dresses" },
  { id: 5, name: "Printed Chiffon Dress - Black", price: 1750, image: test5, category: "dresses" },
  { id: 6, name: "Draped Dress", price: 2000, image: test6, category: "dresses" },
  
  // Skirts
  { id: 4, name: "Naomi Skirt - Beige", price: 1450, image: test1, category: "skirts" },
  { id: 5, name: "Ward Skirt - Creamy", price: 1200, image: test2, category: "skirts" },
  
  // Abayas
  { id: 6, name: "Piping Abaya - Black", price: 2600, image: test1, category: "abayas" },
  { id: 7, name: "High-Low Abaya - Black", price: 2000, image: test2, category: "abayas" },
  { id: 8, name: "Gradient Abaya - Beige", price: 2600, image: test3, category: "abayas" },

  // Blouses
  { id: 11, name: "Sophia Blouse - White", price: 1150, image: test4, category: "blouses" },
  { id: 12, name: "Jory Blouse - Baby Blue", price: 1140, image: test5, category: "blouses" },
];

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