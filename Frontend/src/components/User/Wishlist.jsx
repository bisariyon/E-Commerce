import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Modal } from "../../index";

const Wishlist = () => {
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);

  // Fetch wishlist
  const fetchWishlist = async () => {
    try {
      const response = await axios.get("/v1/wishlist", {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const {
    data: wishlistData,
    isLoading: wishlistLoading,
    isError: wishlistError,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
    staleTime: 1000 * 60,
  });

  // Remove item from wishlist
  const removeWishFromBackend = async (productId) => {
    try {
      const response = await axios.delete(
        `/v1/wishlist/remove/${productId}`,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const { mutate: removeWishlistItem, isLoading: removingItem } = useMutation({
    mutationFn: removeWishFromBackend,
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
    },
    onError: (error, productId) => {
      console.error("Error removing item with id", productId, error);
    },
  });

  // Empty wishlist
  const emptyWishlistFromBackend = async () => {
    try {
      const response = await axios.delete(
        "/v1/wishlist/empty",
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const { mutate: emptyWishlist, isLoading: emptyingWishlist } = useMutation({
    mutationFn: emptyWishlistFromBackend,
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
    },
    onError: (error) => {
      console.error("Error emptying wishlist", error);
    },
  });

  const handleRemove = (productId) => {
    removeWishlistItem(productId);
    console.log(`Removing item with id ${productId}`);
  };

  const handleEmptyWishlistClick = () => {
    setShowModal(true);
  };

  const handleConfirmEmptyWishlist = () => {
    emptyWishlist();
    setShowModal(false);
    console.log("Emptying wishlist");
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (wishlistLoading) return <div>Loading...</div>;
  if (wishlistError) return <div>Error fetching data</div>;

  return (
    <div className="container mx-auto py-4 px-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Wishlist
      </h2>

      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 text-white bg-red-500 hover:bg-red-700 rounded-md active:scale-95"
          onClick={handleEmptyWishlistClick}
        >
          Empty Wishlist
        </button>
      </div>

      <div className="mb-10 px-2 pt-2 pb-4 rounded-lg ">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 py-4">
          {wishlistData.map((wishlistItem) => (
            <div
              key={wishlistItem._id}
              className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
            >
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <img
                  src={wishlistItem.product.productImage}
                  alt={wishlistItem.product.title}
                  className="max-h-full p-4"
                />
              </div>
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h2 className="text-lg font-semibold">
                    {wishlistItem.product.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    ${wishlistItem.product.price}
                  </p>
                  <p className="text-gray-800 mt-2">
                    {wishlistItem.product.description}
                  </p>
                </div>
                <div className="flex justify-start py-2">
                  <button
                    className="px-4 py-2 text-white bg-purple-500 hover:bg-purple-700 rounded-md active:scale-95"
                    onClick={() => handleRemove(wishlistItem.product._id)}
                  >
                    Remove from wishlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        showModal={showModal}
        handleClose={handleCloseModal}
        handleConfirm={handleConfirmEmptyWishlist}
        message="Are you sure you want to empty the wishlist?"
      />
    </div>
  );
};

export default Wishlist;
