import React, { useState,useEffect } from "react";
import { ProductSquare, ErrorPage, ProductsLoading } from "../index";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../store/ProductSlice";
import { useParams, useLocation } from "react-router-dom";

import refreshCart from "../utility/refreshCart";
import refreshUser from "../utility/refreshUser";

function Product() {
  const { refreshUserData } = refreshUser();
  const { refreshCartData } = refreshCart();

  useEffect(() => {
    refreshUserData();
    refreshCartData();
  }, []);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [sortBy, setSortBy] = useState("_id");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [filters, setFilters] = useState({
    sortBy: "_id",
    brand: "",
    category: "",
    subCategory: "",
  });

  const location = useLocation();
  const currentPath = location.pathname;
  const queryParams = new URLSearchParams(location.search);
  let query = queryParams.get("query");
  if (query === null) query = "";

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isVerified = user?.verified || false;

  const fetchProducts = async () => {
    const url = `http://localhost:8000/v1/products?page=${page}&limit=${limit}&sortBy=${filters.sortBy}&brand=${filters.brand}&category=${filters.category}&subCategory=${filters.subCategory}&query=${query}`;
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
    queryKey: ["products", { page, filters, query }],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 1,
  });

  const applyFilters = () => {
    setFilters({ sortBy, brand, category, subCategory });
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
        {/* Error: {productsErrorMessage.message} */}
      </div>
    );
  }
  // console.log(products.data);

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

      <div className="flex justify-center space-x-8 px-8 pt-4 pb-8">
        {/* Left Side Dashboard */}
        <div className="w-1/5 p-4 bg-gray-100 rounded-lg shadow-md">
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
            className="bg-blue-500 text-lg text-white px-4 py-2 rounded hover:bg-blue-800 transition duration-300 ease-in-out"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
          <button
            className="bg-red-500 text-lg text-white px-4 py-2 rounded hover:bg-red-800 transition duration-300 ease-in-out mt-2"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>

        {/* Right Side Product Display */}
        <div className="w-4/5">
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
              Page {page}
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

// import React from "react";
// import { Product } from "../index";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// function Product() {
//   const {
//     page = 1,
//     limit = 10,
//     sortBy = "_id",
//     brand = "",
//     category = "",
//     subCategory = "",
//   } = useParams();

//   const fetchProducts = async () => {
//     const response = await axios.get(`http://localhost:8000/v1/products`);
//     return response.data;
//   };

//   const {
//     data: products,
//     isLoading: productsLoading,
//     isError: productsError,
//     error: productsErrorMessage,
//   } = useQuery({
//     queryKey: ["products", { page }],
//     queryFn: fetchProducts,
//     staleTime: 1000 * 60 * 5,
//   });

//   if (productsLoading) return <div>Loading...</div>;
//   if (productsError) return <div>Error: {productsErrorMessage}</div>;

//   return (
//     <div className="flex justify-center">
//       {/* Left Side Dashboard */}
//       <div className="w-1/5 p-4 bg-green-200">
//         {/* Add your dashboard components here */}
//         <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
//         {/* Example filter */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Filter By:
//           </label>
//           <select className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
//             <option value="price">Price</option>
//             {/* Add other filter options */}
//           </select>
//         </div>
//         {/* Add more filter options as needed */}
//       </div>

//       {/* Right Side Product Display */}
//       <div className="w-4/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 py-8 bg-gray-200">
//         {products &&
//           products.data.docs.map((product) => (
//             <div
//               key={product._id}
//               className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 ease-in-out"
//             >
//               <div className="relative overflow-hidden h-64">
//                 <img
//                   src={product.productImage}
//                   alt={product.title}
//                   className="object-cover w-full h-full"
//                 />
//               </div>
//               <div className="p-4">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                   {product.title}
//                 </h3>
//                 <p className="text-gray-600">{product.description}</p>
//                 <div className="mt-4 flex items-center justify-between">
//                   <span className="text-cyan-600 font-semibold">
//                     ${product.price}
//                   </span>
//                   <button className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 transition duration-300 ease-in-out">
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// }

// export default Product;

// import React from "react";
// import { Product } from "../index";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// function Product() {
//   const { page } = useParams();

//   const fetchProducts = async () => {
//     const response = await axios.get(`http://localhost:8000/v1/products?sortBy=category`);
//     return response.data;
//   };

//   const {
//     data: products,
//     isLoading: productsLoading,
//     isError: productsError,
//     error: productsErrorMessage,
//   } = useQuery({
//     queryKey: ["products", { page }],
//     queryFn: fetchProducts,
//     staleTime: 1000 * 60 * 5,
//   });

//   if (productsLoading) return <div>Loading...</div>;
//   if (productsError) return <div>Error: {productsErrorMessage}</div>;

//   return (
//     <div className="flex justify-center space-x-8 p-8">
//       {/* Left Side Dashboard */}
//       <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
//         <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
//         {/* Example filter */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Filter By:</label>
//           <select className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
//             <option value="price">Price</option>
//             {/* Add other filter options */}
//           </select>
//         </div>
//         {/* Add more filter options as needed */}
//       </div>

//       {/* Right Side Product Display */}
//       <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//         {products &&
//           products.data.docs.map((product) => (
//             <Product
//               key={product._id}
//               _id={product._id}
//               title={product.title}
//               description={product.description}
//               price={product.price}
//               quantityInStock={product.quantityInStock}
//               brand={product.brand.brandName}
//               category={product.category.categoryName}
//               subCategories={product.subCategories}
//               productImage={product.productImage}
//               sellerInfo={product.sellerInfo}
//             />
//           ))}
//       </div>
//     </div>
//   );
// }

// export default Product;
