import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";

import refreshCart from "../utility/refreshCart";
import refreshUser from "../utility/refreshUser";
import { useSelector } from "react-redux";

function AllProducts() {
  const { refreshUserData } = refreshUser();
  const { refreshCartData } = refreshCart();

  useEffect(() => {
    refreshUserData();
    refreshCartData();
  }, []);

  const userRedux = useSelector((state) => state.user.user);
  const isAdmin = userRedux?.isAdmin;

  const navigate = useNavigate();
  const location = useLocation();
  const tempProductId = new URLSearchParams(location.search).get("product");
  const tempSellerId = new URLSearchParams(location.search).get("seller");
  const tempCategoryId = new URLSearchParams(location.search).get("categoryId");
  const tempSubCategoryId = new URLSearchParams(location.search).get(
    "subCategoryId"
  );
  const tempBrand = new URLSearchParams(location.search).get("brandId");
  const review = new URLSearchParams(location.search).get("review");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSelectedProduct, setShowSelectedProduct] = useState(false);
  const [productId, setProductId] = useState(tempProductId || "");
  const [sellerId, setSellerId] = useState(tempSellerId || "");
  const [categoryId, setCategoryId] = useState(tempCategoryId || "");
  const [subCategoryId, setSubCategoryId] = useState(tempSubCategoryId || "");
  const [brandId, setBrandId] = useState(tempBrand || "");
  const [page, setPage] = useState(1);

  useEffect(() => {
    scrollTo(0, 0);
  }, [page]);

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(
        `/v1/products/admin?page=${page}&productId=${productId}&categoryId=${categoryId}&subCategoryId=${subCategoryId}&brandId=${brandId}&sellerId=${sellerId}&limit=5`,
        {
          withCredentials: true,
        }
      );
      // console.log("Prod", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(error.response.data.message || error.response.data);
      throw error.response.data.message || error.response.data;
    }
  };

  const {
    data: ProductData,
    isLoading: productLoading,
    isError: isProductError,
    error: productError,
  } = useQuery({
    queryKey: [
      "allProducts",
      page,
      productId,
      categoryId,
      subCategoryId,
      brandId,
      sellerId,
      review,
    ],
    queryFn: fetchAllProducts,
  });

  const getSubCategories = async () => {
    try {
      const response = await axios.get(
        `/v1/sub-categories/list`,
        {
          withCredentials: true,
        }
      );

      // console.log("Sub", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(error.response.data.message || error.response.data);
      throw error.response.data.message || error.response.data;
    }
  };

  const {
    data: subCategories,
    isLoading: subCategoryLoading,
    isError: isSubCategoryError,
    error: subCategoryError,
  } = useQuery({
    queryKey: "subCategories",
    queryFn: getSubCategories,
  });

  // Query to fetch brands
  const getBrands = async () => {
    try {
      const response = await axios.post(
        `/v1/brands/brandList`,
        {
          withCredentials: true,
        }
      );

      // console.log("Brands", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(error.response.data.message || error.response.data);
      throw error.response.data.message || error.response.data;
    }
  };

  const {
    data: brands,
    isLoading: brandLoading,
    isError: isBrandError,
    error: brandError,
  } = useQuery({
    queryKey: "brands",
    queryFn: getBrands,
  });

  //handlers

  const handleFilterChange = (setter) => (event) => {
    if (setter === categoryId) setSubCategoryId("");
    setter(event.target.value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setBrandId("");
    setCategoryId("");
    setSubCategoryId("");
    setSellerId("");
    setPage(1);
    setProductId("");
    setSelectedProduct(null);
    setShowSelectedProduct(false);

    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("product");
    searchParams.delete("seller");
    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  const handleSelectedProduct = (product) => {
    setShowSelectedProduct(true);
    setSelectedProduct(product);
    console.log("Pro", product);
  };

  console.log(ProductData);

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

  if (productLoading || subCategoryLoading || brandLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-24">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1717078915/crmi2yw34sh7sldgmxo9.png"
          alt="Loading"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-gray-700">Loading all ...</div>
      </div>
    );
  }

  if (isProductError || isSubCategoryError || isBrandError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-24">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1716663893/u0ai3d9zbwijrlqmslyt.png"
          alt="Error"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-red-700">
          {isProductError
            ? productError
            : isSubCategoryError
            ? subCategoryError
            : brandError}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex">
        {/* Dashboard */}
        {!showSelectedProduct && (
          <div className="w-1/4 p-4 bg-white m-4">
            <div>
              <h2 className="text-xl font-semibold mb-4">Filters</h2>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-700 active:scale-95 "
                onClick={() => handleResetFilters()}
              >
                Reset Filters
              </button>

              <div className="mb-4">
                <label className="block text-sm font-medium">Brand</label>
                <select
                  value={brandId}
                  onChange={handleFilterChange(setBrandId)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">All</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Category</label>
                <select
                  value={categoryId}
                  onChange={handleFilterChange(setCategoryId)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">All</option>
                  {subCategories.map((subCategory) => (
                    <option
                      key={subCategory.categoryID}
                      value={subCategory.categoryID}
                    >
                      {subCategory.category}
                    </option>
                  ))}
                </select>
              </div>

              {categoryId && (
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Subcategory
                  </label>
                  <select
                    value={subCategoryId}
                    onChange={handleFilterChange(setSubCategoryId)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">All</option>
                    {subCategories
                      .find((category) => category.categoryID === categoryId)
                      .subCategories.map((subCategory) => (
                        <option
                          key={subCategory.subCategoryID}
                          value={subCategory.subCategoryID}
                        >
                          {subCategory.subCategory}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products */}
        <div className="w-full p-4 bg-blue-200">
          {!showSelectedProduct ? (
            <>
              <div className="grid gap-x-4 gap-y-2 m-4">
                {ProductData &&
                  ProductData.docs.map((product) => (
                    <div
                      key={[product]._id}
                      className="bg-gray-100 border border-reds-300 px-5 pt-5 pb-2  rounded-lg my-2"
                    >
                      <div className="flex justify-center items-center p-4 border border-gray-300 rounded-lg mb-4 bg-white">
                        {/* Details Section */}
                        <div className="flex-1 flex flex-col items-start mx-4">
                          <p className="text-lg font-semibold">
                            Product ID: {product._id}
                          </p>
                          <p>Title: {product.title}</p>
                          {tempSellerId && (
                            <p>
                              Seller : Mr./Mrs. {product.sellerInfo.fullName}
                            </p>
                          )}
                          <button
                            onClick={() => handleSelectedProduct(product)}
                            className="bg-blue-500 text-white px-4 py-1 rounded-lg mt-2"
                          >
                            View Product
                          </button>
                        </div>

                        {/* Image */}
                        <div className="flex-1 flex flex-col items-center mx-4">
                          <img
                            src={product.productImage}
                            alt={`${product.title} Image`}
                            className="w-2/5 h-1/3"
                          />
                        </div>

                        {/*Seller Section*/}
                        <div className="flex-1 flex flex-col items-center ml-4">
                          <span className="text-lg ">Seller</span>
                          <span className="font-semibold">
                            {product.sellerInfo.fullName}
                          </span>
                          <span>({product.sellerInfo.email})</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex justify-center mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-30 active:scale-95 "
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
                <div className="bg-gray-200 py-3 px-4  rounded-md mx-4">
                  Page {page} of {ProductData.totalPages}
                </div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-30 active:scale-95"
                  disabled={ProductData && !ProductData.hasNextPage}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-md mb-8 pb-8 mx-2">
                <button
                  onClick={() => setShowSelectedProduct(false)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-600 transition-colors"
                >
                  Back to Products
                </button>
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                  Selected Product Details
                </h2>

                {/* Grid Container */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6 ">
                  {/* Order Details Card */}
                  <div className="bg-blue-100 p-4 rounded-lg shadow-lg border-t-4 border-blue-500">
                    <h3 className="text-lg font-semibold text-blue-700 mb-2">
                      Product Details
                    </h3>
                    <div className="pl-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Product ID:</span>{" "}
                        {selectedProduct._id}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Title:</span>{" "}
                        {selectedProduct.title}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Price:</span>{" "}
                        {selectedProduct.price}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Quantity In Stock:</span>{" "}
                        {selectedProduct.quantityInStock}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <span className="font-medium">Ratings:</span>{" "}
                        {selectedProduct.ratings || " Not Rated Yet"}
                      </p>
                    </div>
                    <div className="flex items-center mt-4 ml-4">
                      <img
                        src={selectedProduct.productImage}
                        alt="Category Image"
                        className="rounded-md w-1/2 h-auto"
                      />
                      <div className="flex-grow flex justify-center">
                        <button
                          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 active:scale-95"
                          onClick={() =>
                            navigate(
                              `/admin/all-reviews?product=${selectedProduct._id}`
                            )
                          }
                        >
                          View Review
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* </div> */}
                  <div className="bg-green-100 p-4 rounded-lg shadow-lg border-t-4 border-green-500">
                    <h3 className="text-lg font-semibold text-green-700 mb-2">
                      Category
                    </h3>
                    <div className="pl-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Category:</span>{" "}
                        {selectedProduct.category.category}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Description:</span>{" "}
                        {selectedProduct.category.description}
                      </p>
                    </div>
                    <img
                      src={selectedProduct.category.imageUrl}
                      alt="Category Image"
                      className="mx-auto mt-4 rounded-md w-3/4 "
                    />
                    <div className="flex justify-start items-center mt-4 gap-4 pl-2">
                      <button
                        className={`bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 active:scale-95`}
                        onClick={() =>
                          navigate(
                            `/admin/all-categories?category=${selectedProduct.category._id}`
                          )
                        }
                      >
                        View Category
                      </button>
                    </div>
                  </div>

                  <div className="bg-yellow-100 p-4 rounded-lg shadow-lg border-t-4 border-yellow-500">
                    <h3 className="text-lg font-semibold text-yellow-700 mb-2">
                      Brand
                    </h3>
                    <div className="pl-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Brand:</span>{" "}
                        {selectedProduct.brand.name}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Description:</span>{" "}
                        {selectedProduct.brand.description}
                      </p>
                    </div>
                    <img
                      src={selectedProduct.brand.logo}
                      alt="Category Image"
                      className="mx-auto mt-4 rounded-md w-3/4 "
                    />
                    <div className="flex justify-start items-center mt-4 gap-4 pl-2">
                      <button
                        className={`bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 active:scale-95`}
                        onClick={() =>
                          navigate(
                            `/admin/all-brands?brand=${selectedProduct.brand._id}`
                          )
                        }
                      >
                        View Brand
                      </button>
                    </div>
                  </div>

                  <div className="bg-purple-100 p-4 rounded-lg shadow-lg border-t-4 border-purple-500">
                    <h3 className="text-lg font-semibold text-purple-700 mb-2">
                      SubCategories
                    </h3>
                    <div className="pl-2">
                      {selectedProduct.list.map((list) => (
                        <div className="">
                          <p className="text-green-500 text-md">
                            {list.subCategoryName}
                          </p>
                          <p className="text-gray-700 text-xs mb-4">
                            <span className="font-semibold">
                              Description :{" "}
                            </span>
                            {list.subCategoryDescription}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AllProducts;
