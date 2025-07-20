import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div 
      className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.images?.[0] || product.image} 
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
          {product.price?.toLocaleString()} EGP
        </div>
        {/* Colors */}
        {product.colors?.length > 0 && (
          <div className="flex space-x-2 mb-4">
            {product.colors.map(color => (
              <span
                key={color.name}
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        )}
        {/* Quantity and Add to Cart */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={e => { e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }}
              className="px-3 py-2 text-gray-600 hover:text-primary-dark transition-colors"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={e => { e.stopPropagation(); setQuantity(Math.max(1, Number(e.target.value))); }}
              className="w-16 text-center border-0 focus:ring-0 focus:outline-none"
            />
            <button
              onClick={e => { e.stopPropagation(); setQuantity(quantity + 1); }}
              className="px-3 py-2 text-gray-600 hover:text-primary-dark transition-colors"
            >
              +
            </button>
          </div>
          <button
            onClick={e => { e.stopPropagation(); addToCart(product, quantity); }}
            className="w-full flex-1 bg-primary-dark text-white p-1 rounded-lg font-medium hover:bg-primary-darker transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
} 