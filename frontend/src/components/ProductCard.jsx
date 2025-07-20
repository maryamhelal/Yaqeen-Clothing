import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary-dark transition-colors">
          {product.name}
        </h3>
        <div className="text-xl font-bold text-primary-dark mb-4">
          {product.price.toLocaleString()} EGP
        </div>
        
        {/* Quantity and Add to Cart */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 text-gray-600 hover:text-primary-dark transition-colors"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-16 text-center border-0 focus:ring-0 focus:outline-none"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 text-gray-600 hover:text-primary-dark transition-colors"
            >
              +
            </button>
          </div>
          <button
            onClick={() => addToCart(product, quantity)}
            className="w-full flex-1 bg-primary-dark text-white p-1 rounded-lg font-medium hover:bg-primary-darker transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
} 