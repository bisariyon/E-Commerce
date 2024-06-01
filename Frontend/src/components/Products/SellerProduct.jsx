import React, { useState } from "react";
import axios from "axios";
import { Modal } from "../../index";
import { useNavigate } from "react-router-dom";

const SellerProduct = ({ product }) => {
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const deleteProduct = async () => {
    const productId = product._id;
    try {
      const response = await axios.delete(
        `http://localhost:8000/v1/products/delete/${productId}`,
        { withCredentials: true }
      );

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleRemove = async () => {
    setShowModal(false);
    const response = await deleteProduct();
    if (response) {
      window.location.reload();
    }
  };

  const handleAddOffer = () => {
    const productId = product._id;
    navigate(`/seller/add-offer/${productId}`);
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-md px-6 py-4 flex items-center">
      <div className="w-60 h-60 flex-shrink-0 mr-8">
        <img
          src={product.productImage}
          alt={product.title}
          className="h-full w-full object-cover rounded-md"
        />
      </div>

      <div className="flex-grow py-2">
        <div className="text-lg font-semibold mb-1">
          <span className="text-gray-600">Name :</span> {product.title}
        </div>
        <div className="text-sm text-gray-600 mb-2">
          <span className="text-gray-600">Description:</span>{" "}
          {product.description}
        </div>

        <div className="text-sm text-gray-600 mb-2">
          <span className="text-gray-600">Price:</span> ${product.price}
        </div>

        <div className="text-sm text-gray-600 mb-2">
          <span className="text-gray-600">In Stock:</span>{" "}
          {product.quantityInStock}
        </div>

        <div className="text-sm text-gray-600 mb-2">
          <span className="text-gray-600">Brand:</span> {product.brand.name}
        </div>

        <div className="text-sm text-gray-600 mb-2">
          <span className="text-gray-600">Category:</span>{" "}
          {product.category.category}
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <span className="mr-2">Subcategories:</span>
          <div className="flex flex-wrap">
            {product.subCategories.map((subCategory) => (
              <div
                key={subCategory._id}
                className="bg-gray-200 text-gray-700 p-1 rounded-md mr-2 "
              >
                {subCategory.subCategory}
              </div>
            ))}
          </div>
        </div>
        <div className="my-2">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md mb-2 mr-4 active:scale-95"
            onClick={handleOpenModal}
          >
            Remove
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2 mr-4 active:scale-95"
            onClick={handleAddOffer}
          >
            Add Offer
          </button>
        </div>
      </div>

      <Modal
        showModal={showModal}
        handleClose={handleCloseModal}
        handleConfirm={handleRemove}
        message="Are you sure you want to remove this product?"
      />
    </div>
  );
};

export default SellerProduct;
