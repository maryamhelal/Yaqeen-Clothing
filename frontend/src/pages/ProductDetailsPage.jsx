import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productsAPI } from "../api/products";
import { CartContext } from "../context/CartContext";

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    productsAPI.getProduct(productId).then(setProduct);
  }, [productId]);

  if (!product) return <div className="p-8 text-center">Loading...</div>;

  const colorObj = product.colors?.find(c => c.name === selectedColor) || product.colors?.[0];
  const images = colorObj?.images?.length ? colorObj.images : product.images;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Images */}
      <div>
        <div className="mb-4">
          <img src={images?.[0]} alt={product.name} className="w-full h-96 object-cover rounded-xl" />
        </div>
        <div className="flex space-x-2">
          {images?.map((img, idx) => (
            <img key={idx} src={img} alt="" className="w-20 h-20 object-cover rounded-lg border" />
          ))}
        </div>
      </div>
      {/* Details */}
      <div>
        <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
        <div className="text-xl text-primary-dark font-semibold mb-4">{product.price?.toLocaleString()} EGP</div>
        <p className="mb-4 text-gray-700">{product.description}</p>
        {/* Colors */}
        {product.colors?.length > 0 && (
          <div className="mb-4">
            <div className="font-semibold mb-2">Color:</div>
            <div className="flex space-x-2">
              {product.colors.map(color => (
                <button
                  key={color.name}
                  className={`w-8 h-8 rounded-full border-2 ${selectedColor === color.name ? "border-primary-dark" : "border-gray-300"}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setSelectedColor(color.name)}
                />
              ))}
            </div>
          </div>
        )}
        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <div className="mb-4">
            <div className="font-semibold mb-2">Size:</div>
            <div className="flex space-x-2">
              {product.sizes.map(sizeObj => (
                <button
                  key={sizeObj.size}
                  className={`px-3 py-1 rounded-lg border-2 ${selectedSize === sizeObj.size ? "border-primary-dark bg-primary-light" : "border-gray-300"}`}
                  onClick={() => setSelectedSize(sizeObj.size)}
                >
                  {sizeObj.size}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Size Chart */}
        {product.sizes?.length > 0 && (
          <div className="mb-4">
            <div className="font-semibold mb-2">Size Chart:</div>
            <table className="w-full text-left border border-gray-300 rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Size</th>
                  <th className="py-2 px-4 border-b">Quantity Available</th>
                </tr>
              </thead>
              <tbody>
                {product.sizes.map(sizeObj => (
                  <tr key={sizeObj.size}>
                    <td className="py-2 px-4 border-b">{sizeObj.size}</td>
                    <td className="py-2 px-4 border-b">{sizeObj.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Quantity */}
        <div className="mb-4 flex items-center space-x-3">
          <span className="font-semibold">Quantity:</span>
          <input type="number" min="1" value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value)))} className="w-16 border rounded-lg px-2 py-1" />
        </div>
        {/* Add to Cart */}
        <button
          className="w-full bg-primary-dark text-white py-3 rounded-lg font-bold hover:bg-primary-darker transition-colors"
          onClick={() => addToCart(product, quantity, selectedColor, selectedSize)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
} 