import React, {useEffect} from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { SellerProduct } from "../index";
import { useNavigate } from "react-router-dom";

import refreshSeller from "../utility/refreshSeller";

function AllProducts() {
  const { refreshSellerData } = refreshSeller();

  useEffect(() => {
    refreshSellerData();
  }, []);

  const navigate = useNavigate();
  const fetchSellerProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/v1/products/seller",
        {
          withCredentials: true,
        }
      );

      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  };

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: "sellerProducts",
    queryFn: fetchSellerProducts,
    staleTime: 100,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-24">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1717078915/crmi2yw34sh7sldgmxo9.png"
          alt="Loading"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-gray-700">Loading seller products...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-24">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1716663893/u0ai3d9zbwijrlqmslyt.png"
          alt="Error"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-red-700">
          Error fetching seller products. Please try again later.
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center  min-h-full p-4 my-24">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1717234572/ieyrmbjacvaguwcttske.png"
          alt="No Products"
          className="w-64 h-auto hover:scale-110 transition duration-300 ease-in-out"
          onClick={() => navigate("/seller/new-product")}
        />
        <div className="text-3xl text-gray-700">
          No products found. Click to add new products.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-3xl text-gray-700 text-center py-4">
        Your Products
      </div>
      <div className="text-md text-blue-500 text-center">
        For now you can only Delete products. Update feature coming soon!
        <br /> To update a product, please delete and create a new one.
      </div>
      <div className="grid grid-cold-1 lg:grid-cols-2 gap-x-8 gap-y-8 px-8 pt-10 pb-24 bg-gray-200 m-4 rounded-md">
        {products.map((product) => (
          <SellerProduct key={product._id} product={product} />
        ))}
      </div>
    </>
  );
}

export default AllProducts;
