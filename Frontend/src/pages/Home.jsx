import React, { useEffect } from "react";
import {
  Carousal,
  Categories,
  Brands,
  SubHeader,
  HomePageLoading,
  ErrorPage,
} from "../index";
import { useQuery } from "@tanstack/react-query";
import { AllCategories } from "../assets/imports/importImages";
import { useDispatch } from "react-redux";

import refreshUser from "../utility/refreshUser";
import refreshCart from "../utility/refreshCart";
import { Link } from "react-router-dom";

function Home() {
  const { refreshUserData } = refreshUser();
  const { refreshCartData } = refreshCart();

  useEffect(() => {
    refreshUserData();
    refreshCartData();
  }, []);

  const fetchCategories = async () => {
    const response = await fetch(
      `/v1/categories?page=1&limit=7`
    );
    const data = await response.json();
    return data;
  };

  const fetchBrands = async () => {
    const response = await fetch(
      `/v1/brands?page=1&limit=8`
    );
    const data = await response.json();
    return data;
  };

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesErrorMessage,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60,
  });

  const {
    data: brands,
    isLoading: brandsLoading,
    isError: brandsError,
    error: brandsErrorMessage,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
    staleTime: 1000 * 60,
  });

  if (categoriesLoading || brandsLoading) {
    return <HomePageLoading />;
  }
  if (categoriesError || brandsError) {
    return <ErrorPage />;
  }

  return (
    <div className="relative min-h-screen">
      <SubHeader />
      <Carousal />

      {/* Categories Section */}
      <div className="mt-12 bg-white p-8 rounded-lg shadow-md mx-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Some of our Categories
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Explore a variety of categories we offer
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <Link to="user/categories">
            <div className="rounded-lg shadow hover:shadow-lg transition-shadow">
              <Categories
                key="all-categories"
                categoryName="All Categories"
                description="Click here to view all categories"
                imageUrl={AllCategories}
              />
            </div>
          </Link>
          {categories &&
            categories.data.docs.map((category) => (
              <div
                key={category._id}
                className="rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <Categories
                  categoryName={category.category}
                  description={category.description}
                  imageUrl={category.imageUrl}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Brands Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md mb-36  mx-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Global Brands
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover the global brands we partner with
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-40 pb-12">
          {brands &&
            brands.data.docs.map((brand) => (
              <div
                key={brand.brandID}
                className="rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <Brands
                  brandID={brand.brandID}
                  brandName={brand.brandName}
                  description={brand.description}
                  logo={brand.logo}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

// import React, { useEffect, useState } from "react";
// import { Carousal, Categories ,ProductSquare } from "../index";
// import axios from "axios";

// function Home() {
//   const [categories, setProducts] = useState([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(
//         `/v1/categories/filter`
//       );
//       setProducts(response.data.data.docs);
//     } catch (error) {
//       console.error("Error fetching brands:", error);
//     }
//   };

//   console.log("Products:", categories);

//   return (
//     <>
//       <Carousal />
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
//         {categories.map((product) => (
//           <div key={product._id} className="product-wrapper">
//             <ProductSquare
//               _id={product._id}
//               title={product.title}
//               description={product.description}
//               price={product.price}
//               quantityInStock={product.quantityInStock}
//               brand={product.brand.brandName}
//               category={product.category.categoryName}
//               subCategories={product.subCategories}
//               sellerInfo={product.sellerInfo}
//               productImage={product.productImage}
//             />
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }

// export default Home;
