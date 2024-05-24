import React from "react";

function Categories({ _id, categoryName, description, imageUrl }) {
  return (
    <div className="relative group overflow-hidden rounded-lg shadow-lg bg-white">
      <img
        src={imageUrl}
        alt={categoryName}
        className="w-full h-48 object-cover transform scale-100 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="text-center text-white p-4">
          <h3 className="text-2xl font-bold">{categoryName}</h3>
          <p className="mt-2 text-sm">{description}</p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-400 to-transparent text-white">
        <h3 className="text-lg font-bold">{categoryName}</h3>
      </div>
    </div>
  );
}

export default Categories;
