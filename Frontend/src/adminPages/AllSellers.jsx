import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";

function AllUsers() {
  const navigate = useNavigate();
  const location = useLocation();
  const tempseller = new URLSearchParams(location.search).get("seller");
  const tempcategory = new URLSearchParams(location.search).get("category");

  const [page, setPage] = useState(1);
  const [seller, setSeller] = useState(tempseller || "");
  const [category, setCategory] = useState(tempcategory || "");

  useEffect(() => {
    scrollTo(0, 0);
  }, [page]);

  const fetchSellers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/v1/sellers?page=${page}&limit=8&seller=${seller}&category=${category}`,
        {
          withCredentials: true,
        }
      );
      //   console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(error.response.data.message || error.response.data);
      throw error.response.data.message || error.response.data;
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["sellers", page, seller, category],
    queryFn: fetchSellers,
  });

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
    setSeller("");
    setCategory("");

    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("category");
    searchParams.delete("seller");
    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  return (
    <>
      {((seller && tempseller) || (category && tempcategory)) && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-95 mx-6 mt-4"
          onClick={() => handle()}
        >
          View All Sellers
        </button>
      )}
      <div className="bg-gray-100 border border-gray-300 p-6 rounded-lg shadow-md m-6 ">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          {tempseller ? "Searched Seller" : "All Sellers"}
        </h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mb-6 ">
          {data &&
            data.docs.map((seller, index) => {
              const color = colors[index % colors.length];
              return (
                <div
                  key={seller._id}
                  className={`bg-${color}-100 p-4 rounded-lg shadow-lg border-t-4 border-${color}-500`}
                >
                  <div className="pl-2 ">
                    <img
                      src={
                        seller.avatar ||
                        "https://res.cloudinary.com/deepcloud1/image/upload/v1715772761/wzkwecfnwvoeozs2tezw.jpg"
                      }
                      alt="Seller Image"
                      className="mx-4 mr-auto mb-2 rounded-full w-40 h-40 "
                    />
                    <p className="text-gray-700">
                      <span className="font-medium">Seller ID:</span>{" "}
                      {seller._id}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">FullName:</span>{" "}
                      {seller.fullName}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span> {seller.email}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Phone:</span> {seller.phone}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">GST Number:</span>{" "}
                      {seller.GSTnumber}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Verified:</span>{" "}
                      {seller.verified ? "Yes" : "No"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Created On:</span>{" "}
                      {new Date(seller.createdAt).toLocaleDateString("en-IN", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <div className="text-gray-700">
                      <span className="font-medium">Categories:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {data &&
                          seller.niche.map((cat) => (
                            <span
                              key={cat.id}
                              className={`bg-white text-sm px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200 active:scale-95`}
                              onClick={() => console.log(cat.id)}
                            >
                              {cat.category}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-evenly items-center mt-4 gap-4">
                    <button
                      className={`bg-${color}-500 text-white py-2 px-4 rounded-lg hover:bg-${color}-600 active:scale-95`}
                      onClick={() =>
                        navigate(`/admin/all-orderitems?seller=${seller._id}`)
                      }
                    >
                      View Orders
                    </button>
                    <button
                      className={`bg-${color}-500 text-white py-2 px-4 rounded-lg hover:bg-${color}-600 active:scale-95`}
                      onClick={() =>
                        navigate(`/admin/all-products?seller=${seller._id}`)
                      }
                    >
                      View Products
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="flex justify-center mt-8">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-30 active:scale-95 "
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <div className="bg-gray-200 py-3 px-4  rounded-md mx-4">
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
