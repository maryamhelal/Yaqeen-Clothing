import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function ProductCard(props) {
  const product = props.product || props;
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || null);
  const hasColors = Array.isArray(product.colors) && product.colors.length > 0;
  const colorObj = hasColors ? product.colors.find(c => c.name === selectedColor) || product.colors[0] : null;
  const availableSizes = colorObj?.sizes || [];
  const hasSizes = availableSizes.length > 0;
  const [selectedSize, setSelectedSize] = useState(hasSizes ? availableSizes[0].size : null);
  const maxQty = hasSizes ? (availableSizes.find(s => s.size === selectedSize)?.quantity || 1) : 1;
  const navigate = useNavigate();

  // Update selectedSize if color changes
  useEffect(() => {
    if (availableSizes.length > 0 && !availableSizes.find(s => s.size === selectedSize)) {
      setSelectedSize(availableSizes[0].size);
      setQuantity(1);
    }
  }, [selectedColor]);

  // Clamp quantity to maxQty
  useEffect(() => {
    if (quantity > maxQty) setQuantity(maxQty);
  }, [selectedSize, maxQty, quantity]);

  if (!product) return null;

  const {
    name = '',
    price = 0,
    colors = [],
    images = [],
  } = product;

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) return;
    addToCart({
      ...product,
      selectedColor,
      selectedSize,
      price,
      images,
    }, quantity);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      <div className="relative overflow-hidden">
        <img
          src={images?.[0] || product.image}
          alt={name}
          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary-dark transition-colors">
          {name}
        </h3>
        <div className="text-xl font-bold text-primary-dark mb-4">
          {price?.toLocaleString()} EGP
        </div>
        {/* Colors */}
        {colors?.length > 0 && (
          <div className="flex space-x-2 mb-4">
            {colors.map(color => (
              <button
                key={color.name}
                className={`w-8 h-8 rounded-full border-2 ${selectedColor === color.name ? "border-primary-dark" : "border-gray-300"}`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setSelectedColor(color.name)}
              />
            ))}
          </div>
        )}
        {/* Sizes for selected color */}
        {availableSizes.length > 0 && (
          <div className="flex space-x-2 mb-4">
            {availableSizes.map(sizeObj => (
              <button
                key={sizeObj.size}
                className={`px-3 py-1 rounded-lg border-2 ${selectedSize === sizeObj.size ? "border-primary-dark bg-primary-light" : "border-gray-300"}`}
                onClick={() => setSelectedSize(sizeObj.size)}
              >
                {sizeObj.size}
              </button>
            ))}
          </div>
        )}
        {/* Quantity */}
        <div className="mb-4 flex items-center space-x-3">
          <span className="font-semibold">Quantity:</span>
          <input
            type="number"
            min={1}
            max={maxQty}
            value={quantity}
            onChange={e => setQuantity(Math.max(1, Math.min(maxQty, Number(e.target.value))))}
            className="w-16 border rounded-lg px-2 py-1"
          />
          <span className="text-xs text-gray-500">(Max: {maxQty})</span>
        </div>
        {/* Selected color/size info */}
        <div className="mb-2 text-sm text-gray-600">
          {selectedColor && <span>Color: {selectedColor} </span>}
          {selectedSize && <span>Size: {selectedSize}</span>}
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary-dark text-white py-2 rounded-lg font-semibold hover:bg-primary-darker transition-colors"
          disabled={!hasColors || !hasSizes}
        >
          {(!hasColors || !hasSizes) ? "Sold out" : "Add to Cart"}
        </button>
        {!hasColors && <div className="text-red-500 text-sm mt-2">No colors available for this product.</div>}
        {hasColors && !hasSizes && <div className="text-red-500 text-sm mt-2">No sizes available for the selected color.</div>}
      </div>
    </div>
  );
} 