import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tags/categories`)
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Yaqeen</h3>
            <p className="text-gray-300">
              Modest fashion, redefined ✨ <br />
              Elegant & Trendy Hijab Wear 🧕
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/category/${cat.toLowerCase()}`}
                    className="text-gray-300 hover:text-white"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-white">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-300">
              Email: <a href="mailto:info@yaqeen.com">info@yaqeen.com</a>
            </p>
            <p className="text-gray-300">Phone: +20 123 456 789</p>
            <p className="text-gray-300">
              Instagram:{" "}
              <a
                href="https://www.instagram.com/yaqeen_shopp/"
                className="text-gray-300 hover:text-white"
              >
                yaqeen_shopp
              </a>
            </p>
            <p className="text-gray-300">
              Facebook:{" "}
              <a
                href="https://web.facebook.com/profile.php?id=61573580836180"
                className="text-gray-300 hover:text-white"
              >
                Yaqeen Shop
              </a>
            </p>
            <p className="text-gray-300">
              Tiktok:{" "}
              <a
                href="https://www.tiktok.com/@yaqeenshopp"
                className="text-gray-300 hover:text-white"
              >
                yaqeenshopp
              </a>
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>2025 Yaqeen. &copy; All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
