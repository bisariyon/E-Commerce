import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setSeller } from "../store/SellerSlice";
import { SellerLogo2 } from "../assets/imports/importImages";
import refreshSeller from "../utility/refreshSeller";

function RegisterSeller() {
  const { refreshSellerData } = refreshSeller();

  useEffect(() => {
    refreshSellerData();
  }, []);

  const fetchCategories = async () => {
    const response = await axios.get("http://localhost:8000/v1/categories");
    return response.data.data;
  };

  const {
    data: categories,
    isLoading,
    isError: isCategoriesError,
    error: fetchError,
  } = useQuery({
    queryKey: "categories-all",
    queryFn: fetchCategories,
  });

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);

  const handleCategorySelect = (category) => {
    if (selectedCategories.some((cat) => cat._id === category._id)) {
      handleRemoveCategory(category);
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, category]);
      setCategoriesError(null);
    } else {
      setCategoriesError("You can only select 3 categories");
    }
  };

  const handleRemoveCategory = (category) => {
    setCategoriesError(null);
    setSelectedCategories(
      selectedCategories.filter((cat) => cat._id !== category._id)
    );
  };

  // Rest of the form state and handlers
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const registerUser = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/v1/sellers/register",
        formData,
        { withCredentials: true }
      );
      console.log("User registered:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to register user:", error);
      throw error;
    }
  };

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: registerUser,
  });

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registering user...");

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("avatar", avatar);
    formData.append("GSTnumber", gstNumber);

    selectedCategories.forEach((category) => {
      formData.append("niche[]", category._id);
    });

    mutate(formData, {
      onSuccess: (data) => {
        console.log("Registration successful:", data);
        dispatch(setSeller(data.data));
        navigate("/seller/success/registration");
      },
      onError: (error) => {
        setError(error.response.data.message || "Registration failed");
      },
    });
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-slate-600 ">
      <div className="flex flex-wrap w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden my-8">
        <div className="w-full md:w-1/3 p-5 flex flex-col items-center bg-blue-400 py-10">
          <img
            src={SellerLogo2}
            alt="Bisariyon E-Com Logo Seller"
            className="object-cover shadow-md rounded-xl"
          />
          <div className="p-2 my-4 text-white">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia
            repellendus rem amet? Adipisci atque earum fugiat, recusandae,
            maiores commodi, optio ullam vel facilis obcaecati quibusdam
            officiis accusantium fuga beatae rerum!
          </div>
          <div className="p-2 my-4 text-white">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia
            repellendus rem amet? Adipisci atque earum fugiat, recusandae,
            maiores commodi, optio ullam vel facilis obcaecati quibusdam
            officiis accusantium fuga beatae rerum!
          </div>
        </div>
        <div className="w-full md:w-2/3 p-8">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-6">
            Sign Up
          </h2>
          {error && <p className="text-red-500 text-lg mb-4">{error}</p>}
          <form onSubmit={handleRegister} encType="multipart/form-data">
            <div className="mb-4">
              <label className="block text-blue-800 text-lg font-bold mb-2">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-blue-800 text-lg font-bold mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-blue-800 text-lg font-bold mb-2">
                Email *
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-blue-800 text-lg font-bold mb-2">
                Password *
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-blue-800 text-lg font-bold mb-2">
                GST Number *
              </label>
              <input
                type="text"
                placeholder="Enter Registered GST Number"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                required
              />
            </div>

            {/* Niche */}
            <div className="mb-4 mt-6 bg-gray-100 p-2 rounded-md">
              <div className="flex items-center">
                <div className="flex items-center">
                  <label className="text-blue-800 text-lg font-bold mb-2 p-2">
                    Niche/Categories *
                  </label>
                  <span className="text-sm text-gray-500 ml-2">
                    (Select up to 3 categories)
                  </span>
                </div>
                <span
                  className="text-black text-sm font-bold my-2 ml-auto mr-4 flex rounded-lg active:scale-95 hover:cursor-pointer"
                  onClick={() => setShowCategories(!showCategories)}
                >
                  {!showCategories ? "Show" : "Hide"}
                </span>
              </div>

              {categoriesError && (
                <p className="text-red-500 text-sm mb-2">{categoriesError}</p>
              )}

              {(showCategories || selectedCategories.length > 0) && (
                <div className="w-full px-3 py-2 my-3 border rounded-lg shadow -sm">
                  {selectedCategories.map((category) => (
                    <span key={category._id} className="mr-2">
                      {category.category}
                    </span>
                  ))}
                </div>
              )}

              {showCategories && (
                <div className="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                  {categories &&
                    categories.docs.map((category) => (
                      <label key={category._id} className="inline-block">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedCategories.some(
                            (cat) => cat._id === category._id
                          )}
                          onChange={() => handleCategorySelect(category)}
                        />
                        {category.category}
                      </label>
                    ))}
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-blue-800 text-lg font-bold mb-2">
                Avatar
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setAvatar(e.target.files[0])}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95"
            >
              Sign Up
            </button>
          </form>
          <div>
            <p className="mt-4 text-sm text-blue-700 text-center">
              By signing-up you agree to the BISARIYON E-COM Conditions of Use &
              Sale. Please see our Privacy Notice, our Cookies Notice and our
              Interest-Based Ads Notice.
            </p>
            <p className="mt-4 text-md text-center">
              Already have an account?
              <Link
                to="/seller/login"
                className="text-green-500 hover:text-violet-500 font-semibold"
              >
                <span className="text-xl ml-2">Sign in</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterSeller;
