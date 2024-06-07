import React, { useState, useEffect } from "react";
import { ProductSquare, ErrorPage, ProductsLoading } from "../index";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../store/ProductSlice";
import { useNavigate, useLocation } from "react-router-dom";

import refreshCart from "../utility/refreshCart";
import refreshUser from "../utility/refreshUser";

function Product() {
  const { refreshUserData } = refreshUser();
  const { refreshCartData } = refreshCart();

  useEffect(() => {
    refreshUserData();
    refreshCartData();
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const cat = queryParams.get("category");

  let tempQuery = queryParams.get("query");
  if (tempQuery === null) tempQuery = "";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [sortBy, setSortBy] = useState("_id");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState(cat || "");
  const [subCategory, setSubCategory] = useState("");
  const [filters, setFilters] = useState({
    sortBy: "_id",
    brand: "",
    category: cat || "",
    subCategory: "",
  });
  // const [query, setQuery] = useState(tempQuery || "");

  useEffect(() => {
    scrollTo(0, 0);
  },[page])

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isVerified = user?.verified || false;

  const fetchProducts = async () => {
    const url = `/v1/products?page=${page}&limit=${limit}&sortBy=${filters.sortBy}&brand=${filters.brand}&category=${filters.category}&subCategory=${filters.subCategory}&query=${tempQuery}`;
    const response = await axios.get(url);
    dispatch(setProducts(response.data.data.docs));
    return response.data;
  };

  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
    error: productsErrorMessage,
  } = useQuery({
    queryKey: ["products", page, filters, tempQuery ],
    queryFn: fetchProducts,
    staleTime: 100,
  });

  useEffect(() => {
    if (cat) {
      setFilters((prevFilters) => ({ ...prevFilters, category: cat }));
    }
  }, [cat]);

  const applyFilters = () => {
    setFilters({ sortBy, brand, category, subCategory });
    setPage(1);
  };

  const clearFilters = () => {
    setSortBy("_id");
    setBrand("");
    setCategory("");
    setSubCategory("");
    setFilters({
      sortBy: "_id",
      brand: "",
      category: "",
      subCategory: "",
    });
    setPage(1);
    // setQuery("");
    queryParams.delete("query");
    queryParams.delete("category");
    navigate({
      pathname: location.pathname,
      search: queryParams.toString(),
    });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (productsLoading) return <ProductsLoading />;
  if (productsError) {
    console.log("Error", productsErrorMessage);
    return (
      <div>
        <ErrorPage />
      </div>
    );
  }

  return (
    <>
      {user && !isVerified && (
        <div className="flex text-xl justify-center mt-2 text-rose-600 animate-slide-left-right">
          Verify yourself to add products to cart
        </div>
      )}

      {!user && (
        <div className="flex text-xl justify-center mt-2 text-rose-600 animate-slide-left-right">
          Login to add products to cart
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-center lg:space-x-8 px-8 pt-4 pb-8">
        {/* Left Side Dashboard */}
        <div className="lg:w-1/5 w-full p-4 bg-gray-100 rounded-lg shadow-md mb-4 lg:mb-0">
          <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Sort By:
            </label>
            <select
              name="sortBy"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="_id">Default</option>
              <option value="price">Price</option>
              <option value="title">Title</option>
              <option value="rating">Rating</option>
              <option value="category">Category</option>
              <option value="brand">Brand</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Brand:
            </label>
            <input
              type="text"
              name="brand"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category:
            </label>
            <input
              type="text"
              name="category"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              SubCategory:
            </label>
            <input
              type="text"
              name="subCategory"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-500 text-lg text-white px-4 py-2 rounded hover:bg-blue-800 transition duration-300 ease-in-out active:scale-95"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
          <button
            className="bg-red-500 text-lg text-white px-4 py-2 rounded hover:bg-red-800 transition duration-300 ease-in-out mt-2 active:scale-95"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>

        {/* Right Side Product Display */}
        <div className="lg:w-4/5 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products &&
              products.data.docs.map((product) => (
                <ProductSquare
                  key={product._id}
                  _id={product._id}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  quantityInStock={product.quantityInStock}
                  brandname={product.brand.brandname}
                  brandId={product.brand.brandID}
                  category={product.category.categoryName}
                  categoryId={product.category.categoryID}
                  subCategory={product.subCategory}
                  productImage={product.productImage}
                  sellerID={product.sellerInfo.sellerID}
                  sellerName={product.sellerInfo.sellerName}
                  rating={product.rating}
                />
              ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              className={`bg-blue-500 text-white text-lg px-4 py-2 rounded transition duration-300 ease-in-out ${
                page === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="text-lg font-semibold bg-gray-100 px-4 py-2 rounded">
              Page {page} of {products?.data?.totalPages}
            </span>
            <button
              className={`bg-blue-500 text-white text-lg px-4 py-2 rounded transition duration-300 ease-in-out ${
                !products?.data?.hasNextPage
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
              onClick={() => handlePageChange(page + 1)}
              disabled={!products?.data?.hasNextPage}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Product;
