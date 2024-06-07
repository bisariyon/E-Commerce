import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import refreshSeller from "../utility/refreshSeller";
import { SellerOrderDashboard } from "../index"; // Adjust the import based on your file structure
import { useNavigate } from "react-router-dom";

function Orders() {
  const { refreshSellerData } = refreshSeller();

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("-1");
  const [status, setStatus] = useState("pending");
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");

  useEffect(() => {
    refreshSellerData();
  }, []);

  const navigate = useNavigate();

  const getOrders = async () => {
    try {
      const response = await axios.post(
        `/v1/order-items/seller?limit=6&page=${page}&sortBy=${sortBy}&sortType=${sortType}&status=${status}&before=${before}&after=${after}`,
        {},
        {
          withCredentials: true,
        }
      );

      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["Seller-orders", page, sortBy, sortType, status, before, after],
    queryFn: getOrders,
  });

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    setPage(page - 1);
  };

  const [currentItem, setCurrentItem] = useState({});
  const navigateToProductDetails = (item) => {
    setCurrentItem(item);
    navigate(`/seller/order-item/${item._id}`, { state: { currentItem: item } });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-14">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1717078915/crmi2yw34sh7sldgmxo9.png"
          alt="Loading"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-gray-700">Loading seller orders</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-14">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1716663893/u0ai3d9zbwijrlqmslyt.png"
          alt="Error"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-gray-700">
          Error loading seller orders. Retry again later.
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SellerOrderDashboard
        setSortBy={setSortBy}
        setSortType={setSortType}
        setStatus={setStatus}
        sortBy={sortBy}
        sortType={sortType}
        status={status}
        before={before}
        after={after}
        setBefore={setBefore}
        setAfter={setAfter}
      />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Seller Orders
        </h1>
        <div className="grid gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-2 py-10 px-12 bg-green-200 mx-4">
          {data.docs.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Order ID: {item.orderID}
                </h2>
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-gray-700">
                      <strong>Amount:</strong> ₹{item.amount}
                    </p>
                    <p className="text-gray-700">
                      <strong>Order Date:</strong>{" "}
                      {new Date(item.order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700">
                      <strong>Status:</strong> {item.status}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Product Details
                  </h3>

                  <div className="flex mb-2">
                    <div className="mr-8">
                      <p className="text-gray-700">
                        <strong>Product ID:</strong> {item.product._id}
                      </p>
                      <p className="text-gray-700">
                        <strong>Title:</strong> {item.product.title}
                      </p>
                    </div>
                    <img
                      src={item.product.productImage}
                      alt={item.product.title}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>
                  <button
                    onClick={() => navigateToProductDetails(item)}
                    className="bg-blue-400 p-2 rounded-md hover:bg-blue-600 active:scale-105"
                  >
                    See Order details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className="bg-blue-400 disabled:opacity-50 px-4 py-2 rounded-md text-white font-semibold"
          >
            Prev
          </button>
          <span className="mx-1 py-2 bg-gray-200 p-2 rounded-md">{`Page ${page} of ${data.totalPages}`}</span>
          <button
            onClick={nextPage}
            disabled={!data.hasNextPage}
            className="bg-blue-400 disabled:opacity-50 px-4 py-2 rounded-md text-white font-semibold"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Orders;
