import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import refreshCart from "../utility/refreshCart";
import refreshUser from "../utility/refreshUser";

function AllUsers() {
  const { refreshUserData } = refreshUser();
  const { refreshCartData } = refreshCart();
  const navigate = useNavigate();
  const location = useLocation();
  const tempuser = new URLSearchParams(location.search).get("user");

  const [page, setPage] = useState(1);
  const [user, setUser] = useState(tempuser || "");

  useEffect(() => {
    refreshUserData();
    refreshCartData();
  }, []);

  useEffect(() => {
    scrollTo(0, 0);
  }, [page]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `/v1/users/all?page=${page}&limit=8&user=${user}`,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error(error.response.data.message || error.response.data);
      throw error.response.data.message || error.response.data;
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", page, user],
    queryFn: fetchUsers,
  });

  const userRedux = useSelector((state) => state.user.user);
  const isAdmin = userRedux?.isAdmin;

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 pt-4 p-8">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1717435538/sonr99spyfca75ignfhc.png"
          alt="Wrong Domain"
          className="max-w-full h-auto"
        />
        <h1 className="text-4xl font-bold mb-4">
          You have entered the wrong domain
        </h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-24">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1717078915/crmi2yw34sh7sldgmxo9.png"
          alt="Loading"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-gray-700">Loading all users..</div>
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

  const colors = [
    "blue",
    "green",
    "red",
    "purple",
    "red",
    "purple",
    "blue",
    "green",
  ];

  const handle = () => {
    setUser("");

    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("user");
    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  return (
    <>
      {user && tempuser && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-95 mx-6 mt-4"
          onClick={handle}
        >
          View All Users
        </button>
      )}

      <div className="bg-gray-100 border border-gray-300 p-6 rounded-lg shadow-md m-6">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          {tempuser ? "Searched User" : "All Users"}
        </h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mb-6">
          {data &&
            data.docs.map((user, index) => {
              const color = colors[index % colors.length];
              return (
                <div
                  key={user._id}
                  className={`bg-${color}-100 p-4 rounded-lg shadow-lg border-t-4 border-${color}-500`}
                >
                  <div className="pl-2">
                    <img
                      src={user.avatar}
                      alt="User Image"
                      className="mx-4 mr-auto mb-2 rounded-full w-40 h-40"
                    />
                    <p className="text-gray-700">
                      <span className="font-medium">User ID:</span> {user._id}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">FullName:</span>{" "}
                      {user.fullName}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Username:</span>{" "}
                      {user.username}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Phone:</span> {user.phone}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Verified:</span>{" "}
                      {user.verified ? "Yes" : "No"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Admin:</span>{" "}
                      {user.isAdmin ? "Admin" : "User"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Created On:</span>{" "}
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex justify-evenly items-center mt-4 gap-4">
                    <button
                      className={`bg-${color}-500 text-white py-2 px-4 rounded-lg hover:bg-${color}-600 active:scale-95`}
                      onClick={() =>
                        navigate(`/admin/all-orders?user=${user._id}`)
                      }
                    >
                      View Orders
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/admin/all-reviews?user=${user._id}`)
                      }
                      className={`bg-${color}-500 text-white py-2 px-4 rounded-lg hover:bg-${color}-600 active:scale-95`}
                    >
                      View Reviews
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="flex justify-center mt-8">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-30 active:scale-95"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <div className="bg-gray-200 py-3 px-4 rounded-md mx-4">
            Page {page} of {data.totalPages}
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-30 active:scale-95"
            disabled={data && !data.hasNextPage}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default AllUsers;
