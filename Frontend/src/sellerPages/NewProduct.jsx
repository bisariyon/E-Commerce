import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import refreshSeller from "../utility/refreshSeller";
import { useNavigate } from "react-router-dom";

function NewProduct() {
  const { refreshSellerData } = refreshSeller();

  // Call refreshSellerData only once when the component mounts
  useEffect(() => {
    refreshSellerData();
  }, []);

  const seller = useSelector((state) => state.seller.seller);
  const niche = seller?.niche || [];

  const [nicheData, setNicheData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [brandData, setBrandData] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [brands, setBrands] = useState("");
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch seller niche details
  const fetchNicheDetails = async (_id) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/v1/categories/${_id}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      console.log("Niche", error);
    }
  };

  const fetchNicheDetailsForAll = async () => {
    const allResponses = [];
    for (let i = 0; i < niche.length; i++) {
      const response = await fetchNicheDetails(niche[i]);
      allResponses.push(response);
    }
    return allResponses;
  };

  useEffect(() => {
    fetchNicheDetailsForAll().then((responses) => {
      setNicheData(responses);
    });
  }, [niche]);

  // if (nicheData.length) console.log("Niche Data", nicheData);

  // Fetch subcategories
  const fetchSubCategoryDetails = async (categoryId, nicheId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/v1/sub-categories/get/${categoryId}`,
        { withCredentials: true }
      );

      const subcategoriesWithNicheId = response.data.data.docs.map(
        (subcategory) => ({
          ...subcategory,
          nicheId: nicheId,
        })
      );

      return subcategoriesWithNicheId;
    } catch (error) {
      console.log("Subcategories", error);
    }
  };

  const fetchSubCategoryDetailsForAll = async () => {
    const allResponses = [];
    for (let i = 0; i < niche.length; i++) {
      const response = await fetchSubCategoryDetails(niche[i], niche[i]);
      allResponses.push(response);
    }
    return allResponses;
  };

  useEffect(() => {
    fetchSubCategoryDetailsForAll().then((responses) => {
      setSubCategoryData(responses);
    });
  }, [niche]);

  // if (subCategoryData.length) console.log("Sub Category", subCategoryData);

  // Fetch brands
  const fetchBrandDetails = async (categoryID) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/v1/brands/getByCategory/${categoryID}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      console.log("Brands", error);
    }
  };

  const fetchBrandDetailsForAll = async () => {
    const allResponses = [];
    for (let i = 0; i < niche.length; i++) {
      const response = await fetchBrandDetails(niche[i]);
      allResponses.push(response);
    }
    return allResponses;
  };

  useEffect(() => {
    fetchBrandDetailsForAll().then((responses) => {
      setBrandData(responses);
    });
  }, [niche]);

  // if (brandData.length) console.log("Brand Data", brandData);

  const addNewProductBackend = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("quantityInStock", quantity);
    formData.append("category", category);
    formData.append("subCategories", selectedSubCategory);
    formData.append("brand", brands);
    formData.append("productImage", image);

    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }

    try {
      const response = await axios.post(
        "http://localhost:8000/v1/products/create",
        formData,
        { withCredentials: true }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      setErrorMessage(error.response.data.message);
      return error.response.data;
    }
  };

  useEffect(() => {
    setTimeout(() => setErrorMessage(""), 3000);
  }, [setErrorMessage]);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await addNewProductBackend();
    console.log(res);

    if (res.success === false) {
      setErrorMessage(res.message);
      return;
    }

    setTitle("");
    setDescription("");
    setPrice("");
    setQuantity("");
    setCategory("");
    setSelectedCategory("");
    setSelectedSubCategory([]);
    setBrands("");
    setImage(null);

    navigate("/seller", {
      state: { message: "Product registered successfully" },
    });
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory([]);
    setBrands("");
  };

  const handleBrandChange = (brandId) => {
    setBrands(brandId);
  };

  const filteredSubCategories = selectedCategory
    ? subCategoryData
        .flat()
        .filter((subCategory) => subCategory.nicheId === selectedCategory)
    : subCategoryData.flat();

  const filteredBrands = selectedCategory
    ? brandData.flat().filter((brand) => brand.categoryId === selectedCategory)
    : brandData.flat();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Register New Product
      </h1>

      {errorMessage && (
        <div className=" p-2 rounded-lg text-lg text-center text-red-500 mb-4">
          Error : <span className="text-xl">{errorMessage}</span>
        </div>
      )}
      <form onSubmit={handleRegister} encType="multipart/form-data">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col w-1/2 mb-4">
            <label htmlFor="title" className="text-sm font-bold text-gray-600">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="flex flex-col w-1/2 mb-4">
            <label
              htmlFor="description"
              className="text-sm font-bold text-gray-600"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="flex flex-col w-1/2 mb-4">
            <label
              htmlFor="category"
              className="text-sm font-bold text-gray-600"
            >
              Category
            </label>
            <div className="flex flex-wrap mt-1">
              {nicheData &&
                nicheData.map((niche) => (
                  <div key={niche._id} className="flex items-center mr-4 mb-2">
                    <input
                      type="radio"
                      id={niche._id}
                      name="category"
                      value={niche._id}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        handleCategoryChange(e.target.value);
                      }}
                      className="mr-2"
                    />
                    <label htmlFor={niche._id} className="text-gray-600">
                      {niche.category}
                    </label>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col w-1/2 mb-4">
            <label
              htmlFor="subCategory"
              className="text-sm font-bold text-gray-600"
            >
              Sub Category
            </label>
            <div className="flex flex-wrap mt-1">
              {filteredSubCategories &&
                filteredSubCategories.map((subCat) => (
                  <div
                    key={subCat.subCategoryID}
                    className="flex items-center mr-4 mb-2"
                  >
                    <input
                      type="checkbox"
                      id={subCat.subCategoryID}
                      name="subCategory"
                      value={subCat.subCategoryID}
                      className="mr-2"
                      checked={selectedSubCategory.includes(
                        subCat.subCategoryID
                      )}
                      onChange={() => {
                        if (
                          selectedSubCategory.includes(subCat.subCategoryID)
                        ) {
                          setSelectedSubCategory(
                            selectedSubCategory.filter(
                              (subCategory) =>
                                subCategory !== subCat.subCategoryID
                            )
                          );
                        } else {
                          setSelectedSubCategory([
                            ...selectedSubCategory,
                            subCat.subCategoryID,
                          ]);
                        }
                      }}
                    />
                    <label
                      htmlFor={subCat.subCategoryID}
                      className="text-gray-600"
                    >
                      {subCat.subCategory}
                    </label>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col w-1/2 mb-4">
            <label htmlFor="brand" className="text-sm font-bold text-gray-600">
              Brand
            </label>
            <div className="flex flex-wrap mt-1">
              {filteredBrands &&
                filteredBrands.map((brand) => (
                  <div key={brand._id} className="flex items-center mr-4 mb-2">
                    <input
                      type="radio"
                      id={brand._id}
                      name="brand"
                      value={brand._id}
                      checked={brands === brand._id}
                      onChange={() => handleBrandChange(brand._id)}
                      className="mr-2"
                    />
                    <label htmlFor={brand._id} className="text-gray-600">
                      {brand.name}
                    </label>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col w-1/2 mb-4">
            <label htmlFor="price" className="text-sm font-bold text-gray-600">
              Price
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="flex flex-col w-1/2 mb-4">
            <label
              htmlFor="quantity"
              className="text-sm font-bold text-gray-600"
            >
              Quantity in Stock
            </label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="flex flex-col w-1/2 mb-4">
            <label htmlFor="image" className="text-sm font-bold text-gray-600">
              Product Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>

          {errorMessage && (
            <div className=" p-2 rounded-lg text-xl text-red-500 mb-4">
              {errorMessage}
            </div>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          >
            Register Product
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewProduct;
