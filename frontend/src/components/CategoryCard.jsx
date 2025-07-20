import React from "react";
import { Link } from "react-router-dom";

export default function CategoryCard({ name, image }) {
  return (
    <Link to={`/category/${name.toLowerCase()}`} onClick={() => console.log(`Category clicked: ${name.toLowerCase()}`)}>
      <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
        <div className="aspect-w-1 aspect-h-1 w-full">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
          <h3 className="text-xl font-semibold text-white group-hover:text-pink-200 transition-colors duration-300">
            {name}
          </h3>
          <p className="text-sm text-gray-200 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Explore Collection
          </p>
        </div>
      </div>
    </Link>
  );
} 