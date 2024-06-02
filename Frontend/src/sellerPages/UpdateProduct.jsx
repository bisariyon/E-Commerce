import React, { useState, useEffect } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SellerLogo2 } from "../assets/imports/importImages";

function UpdateProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    quantityInStock: "",
    category: "",
    brand: "",
    subCategories: [],
    productImage: null,
  });
  const [initialProductData, setInitialProductData] = useState({}); // To store the initial product data for resetting
  const [errorMessage, setErrorMessage] = useState("");
  const [isUpdationError, setIsUpdationError] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/v1/products/p/${productId}`,
          { withCredentials: true }
        );
        setProductData(response.data.data);
        setInitialProductData(response.data.data); // Save initial data
      } catch (error) {
        console.log(error.response.data.message || error.response.data);
        setErrorMessage(
          error.response.data.message || error.response.data.toString()
        );
      }
    };

    fetchProduct();
  }, [productId]);

  const updateProduct = async () => {
    const formData = new FormData();
    formData.append("title", productData.title);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("quantityInStock", productData.quantityInStock);
    formData.append("productImage", productData.productImage);

    try {
      const response = await axios.patch(
        `http://localhost:8000/v1/products/updatePartial/${productId}`,
        formData,
        { withCredentials: true }
      );

      return response.data.data;
    } catch (error) {
      console.log(error.response.data.message || error.response.data);
      throw error.response.data.message || error.response.data.toString();
    }
  };

  const mutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      setSuccessMessage(data.message);
      navigate("/seller/all-products");
    },
    onError: (error) => {
      setIsUpdationError(true);
      setErrorMessage(
        error.response.data.message || error.response.data.toString()
      );
    },
    onSettled: () => {
      setIsPending(false);
    },
  });

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await mutation.mutateAsync();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const resetForm = () => {
    setProductData(initialProductData); // Reset form data to initial values
    setIsUpdationError(false); // Reset error state
    setErrorMessage(""); // Reset error message
  };

  return (
    <>
      <div className="bg-blue-200 px-4 text-xl mb-0">
        <Link to="/seller/all-products">
          <img
            src="https://res.cloudinary.com/deepcloud1/image/upload/v1717357419/zb86nifhiz6ggbnhckzd.png"
            alt="Bisariyon E-Com Logo"
            className="w-16 h-16 inline-block hover:scale-110 active:scale-100 transition-transform duration-100 ease-in-out"
          />
        </Link>
      </div>
      <div className="min-h-full flex items-center justify-center bg-blue-200 pb-8 ">
        <div className="flex flex-wrap w-full max-w-4xl bg-gray-200 rounded-xl shadow-lg overflow-hidden my-8">
          <div className="w-full md:w-1/2 p-5 flex flex-col justify-center items-center bg-blue-400">
            <img
              src={productData.productImage || SellerLogo2}
              alt="Bisariyon E-Com Logo"
              className="w-[375px] h-[375px] object-cover shadow-md rounded-xl bg-gray-200"
            />
          </div>

          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-4xl font-bold text-center text-blue-900 mb-8">
              Update Product
            </h2>

            {isUpdationError && (
              <p className="text-red-500 text-lg mb-4">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-700 text-lg mb-4">{successMessage}</p>
            )}
            <form
              onSubmit={handleUpdateProduct}
              encType="multipart/form-data"
              className="bg-white rounded-lg shadow-md p-8"
            >
              {/* Form Inputs */}
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={productData.title}
                  onChange={(e) =>
                    setProductData({ ...productData, title: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={productData.description}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      description: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="text"
                  value={productData.price}
                  onChange={(e) =>
                    setProductData({ ...productData, price: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">
                  Quantity in Stock
                </label>
                <input
                  type="text"
                  value={productData.quantityInStock}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      quantityInStock: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">
                  Product Image
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      productImage: e.target.files[0],
                    })
                  }
                  className="border border-gray-300 rounded-lg p-2 w-full"
                />
              </div>
              {/* Buttons */}
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 active:scale-95"
                  disabled={isPending}
                >
                  {isPending ? "Updating Product..." : "Update Product"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-red-300 text-whote p-2 rounded-lg hover:bg-red-400 active:scale-95"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateProduct;
