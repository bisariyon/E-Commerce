import React, { useState } from "react";

function ProductSquare({
  _id = 0,
  title = "Product Title",
  productImage = "https://via.placeholder.com/300",
  description = "Product Description",
  price = 0,
  quantityInStock = 0,
  brand = "Brand",
  category = "Category",
  subCategories = [],
  sellerInfo = "Seller",
}) {
  const [quantity, setQuantity] = useState(1);

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => Math.min(prevQuantity + 1, quantityInStock));
  };

  return (
    <div
      className="product bg-white border border-gray-300 rounded-lg shadow-md z-10 w-full p-5 flex flex-col"
      id={_id}
    >
      <img
        className="w-full h-48 object-contain rounded-t-lg mb-4"
        src={productImage}
        alt={title}
      />

      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-700 mb-4">{description}</p>
      <div className="text-lg text-cyan-500 font-bold mb-2">${price}</div>
      <div className="text-sm text-gray-600 mb-2">
        <span>In Stock: {quantityInStock}</span>
        <br />
        <span>Brand: {brand}</span>
        <br />
        <span>Category: {category}</span>
        <br />
        {subCategories && subCategories.length > 0 && (
          <span>Subcategories: {subCategories.join(", ")}</span>
        )}
      </div>
      <div className="text-sm text-gray-600 mb-4">
        <span>Seller: {sellerInfo.name}</span>
        <br />
        <span>Rating: {sellerInfo.rating}</span>
      </div>
      <div className="flex items-center mb-4">
        <span className="mr-3">Quantity: {quantity}</span>
        <button
          onClick={handleIncreaseQuantity}
          className="bg-cyan-500 text-white px-2 py-1 rounded hover:bg-cyan-600 transition duration-300 ease-in-out"
        >
          +
        </button>
      </div>
      <div className="mt-auto flex space-x-3">
        <button className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 transition duration-300 ease-in-out">
          Add to Cart
        </button>
        <button className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300 ease-in-out">
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default ProductSquare;


   
