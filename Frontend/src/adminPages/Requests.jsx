import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { Modal } from "../index";

import refreshCart from "../utility/refreshCart";
import refreshUser from "../utility/refreshUser";

function Requests() {
  const { refreshUserData } = refreshUser();
  const { refreshCartData } = refreshCart();

  useEffect(() => {
    refreshUserData();
    refreshCartData();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [requestID, setRequestID] = useState("");
  const [orderItemId, setOrderItemId] = useState("");
  const [type, setType] = useState("");

  const getRequests = async () => {
    try {
      const response = await axios.get(`/v1/requests`, {
        withCredentials: true,
      });

      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(error.response.data.message || error.response.data);
      throw new Error(error.response.data.message || error.response.data);
    }
  };

  const {
    data: requests,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: "requests",
    queryFn: getRequests,
  });

  const updateStatusBackend = async (requestId) => {
    try {
      const response = await axios.put(
        `/v1/requests/update/${requestId}`,
        {},
        {
          withCredentials: true,
        }
      );

      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(error.response.data.message || error.response.data);
      throw new Error(error.response.data.message || error.response.data);
    }
  };

  const queryClient = new QueryClient();
  const mutation = useMutation({
    mutationFn: updateStatusBackend,
    onSuccess: () => {
      queryClient.invalidateQueries("requests");
      refetch();
    },
  });

  const updateStatus = async (orderItemId, status) => {
    console.log("Updating status:", orderItemId, status);
    try {
      const response = await axios.put(
        `/v1/order-items/status/${orderItemId}`,
        { status },
        {
          withCredentials: true,
        }
      );
      console.log("Status new", response.data.data);
      return response.data;
    } catch (error) {
      console.error(error.response.data.message || error.response.data);
      throw error.response;
    }
  };

  const { mutate: mutateUpdtae } = useMutation({
    mutationFn: updateStatus,
  });

  const handleUpdateStatus = (requestId, type, orderItemId) => {
    setShowModal(true);
    setRequestID(requestId);
    setType(type);
    setOrderItemId(orderItemId);

    console.log("RequestID 1", requestID);
    console.log("Type 1", type);
    console.log("OrderItemId 1", orderItemId);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirm = async () => {
    const status = type === "cancel" ? "cancelled" : "refunded";
    console.log("Status", status);
    console.log("OrderItemId", orderItemId);

    mutateUpdtae(orderItemId, status);
    mutation.mutate(requestID);

    setShowModal(false);
    setRequestID("");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-24">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1717078915/crmi2yw34sh7sldgmxo9.png"
          alt="Loading"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-gray-700">Loading all Reviews..</div>
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
          {error || "An error occurred. Please try again later."}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Requests
      </h2>

      {requests && requests.length === 0 && (
        <div className="text-center text-gray-700">No requests found.</div>
      )}
      {requests && requests.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Item ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.active ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(request.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.orderItems}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.transactionID}
                  </td>
                  <td>
                    <button
                      onClick={() => handleUpdateStatus(request._id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        showModal={showModal}
        handleClose={handleCloseModal}
        handleConfirm={handleConfirm}
        message="Are you sure you want to set active to false?"
      />
    </div>
  );
}
export default Requests;
