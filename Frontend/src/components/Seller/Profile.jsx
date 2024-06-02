import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsPencilSquare } from "react-icons/bs";
import { patchSeller } from "../../store/SellerSlice";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function Profile() {
  const seller = useSelector((state) => state.seller.seller);
  const dispatch = useDispatch();

  // Local State
  const [password, setPassword] = useState(""); // For sensitive fields

  const [newPassword, setNewPassword] = useState(""); // For changing password
  const [confirmPassword, setConfirmPassword] = useState(""); // For changing password
  const [otp, setOtp] = useState(""); // For changing password

  const [avatar, setAvatar] = useState(null); // For changing avatar

  const [editingField, setEditingField] = useState(null); // For editing fields
  const [editedValue, setEditedValue] = useState(""); // For editing fields

  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (error || message) {
      setTimeout(() => {
        setError(null);
        setMessage(null);
      }, 2500);
    }
  }, [error, message]);

  // Backend API Calls
  const updateProfileBackend = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/v1/sellers/update/profile`,
        {
          [editingField]: editedValue,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("Profile updated successfully");
        dispatch(patchSeller({ [editingField]: editedValue }));
        return response.data;
      }
    } catch (error) {
      console.log("Error updating profile:", error);
      throw error;
    }
  };

  const updateEmailBackend = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/v1/sellers/update/email`,
        {
          email: editedValue,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("Email updated successfully");
        dispatch(patchSeller({ [editingField]: editedValue }));
        return response.data;
      }
    } catch (error) {
      console.log("Error updating email:", error);
      setError(error.response.data.message);
      throw error;
    }
  };

  const updatePhoneBackend = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/v1/sellers/update/phone`,
        {
          phone: editedValue,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("Phone updated successfully");
        dispatch(patchSeller({ [editingField]: editedValue }));
        return response.data;
      }
    } catch (error) {
      console.log("Error updating phone:", error);
      setError(error.response.data.message);
      throw error;
    }
  };

  const updateAvatarBackend = async () => {
    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const response = await axios.patch(
        `http://localhost:8000/v1/sellers/update/avatar`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Avatar updated successfully");
        dispatch(patchSeller({ avatar: response.data.data.avatar }));
        return response.data;
      }
    } catch (error) {
      console.log("Error updating avatar:", error);
      setError(error.response.data.message);
      throw error;
    }
  };

  const sentOtpBackend = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/v1/sellers/generate-email-otp`,
        {
          email: seller.email,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("sent successfully");
        return response.data;
      }
    } catch (error) {
      console.log("Error sending OTP:", error);
      setError(error.response.data.message);
      throw error;
    }
  };

  const updatePasswordBackend = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/v1/sellers/verifyotp`,
        {
          newPassword: newPassword,
          confirmPassword: confirmPassword,
          otp: otp,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("Password updated successfully");
        return response.data;
      }
    } catch (error) {
      console.log("Error updating password:", error);
      setError(error.response.data.message);
      throw error;
    }
  };

  const askForVerificationBackend = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/v1/sellers//ask-for-verification",
        {
          withCredentials: true,
        }
      );

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log("Error verifying seller:", error);
      setError(error.response.data.message);
    }
  };

  const getNicheBackend = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/v1/sellers/get-niche",
        { withCredentials: true }
      );

      if (response.status === 200) {
        // console.log(response.data.data.niche);
        return response.data.data.niche;
      }
    } catch (error) {
      console.log("Error fetching niche:", error.response.data.message);
      setError(error.response.data.message);
      throw error;
    }
  };

  //Query for fetching niche
  const {
    data: nicheData,
    isError,
    Error,
  } = useQuery({
    queryKey: "niche",
    queryFn: getNicheBackend,
    staleTime: 1000 * 60 * 10,
  });

  if (isError) {
    setError(Error);
  }

  //Render Buttons
  const renderEditButton = (field) => (
    <button
      onClick={() => {
        setShowPasswordChange(false);
        if (editingField === field) {
          setEditingField(null);
          setEditedValue("");
        } else {
          setEditingField(field);
          setEditedValue(seller?.[field] || "");
        }
      }}
      className="text-blue-500 hover:text-blue-700 focus:outline-none text-md mr-2 bg-transparent"
    >
      {editingField === field ? "Cancel" : "Edit"}
    </button>
  );

  const renderCancelButton = () => (
    <button
      onClick={() => {
        setEditingField(null);
        setEditedValue("");
      }}
      className="text-red-500 hover:text-red-700 focus:outline-none text-s bg-transparent "
    >
      Cancel
    </button>
  );

  const renderSaveButton = (field) => (
    <>
      <button
        onClick={() => handleSave(field)}
        className="text-blue-500 hover:text-blue-700 focus:outline-none text-s bg-transparent "
      >
        Save
      </button>
      {renderCancelButton()}
    </>
  );

  //Render Fields
  const renderField = (label, field) => {
    const isSensitiveField = field === "email" || field === "phone";
    return (
      <div className="rounded-lg shadow-md p-6 bg-white m-2">
        <h3 className="text-md font-semibold mb-2 text-slate-500">{label}</h3>
        <div className="flex items-center">
          {editingField === field ? (
            <div className="w-full">
              <input
                type="text"
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                className="rounded-md border bg-purple-200 border-gray-300 py-3 px-4 text-gray-700 "
              />
            </div>
          ) : (
            <div className="rounded-md border bg-purple-200 border-gray-300 py-2 px-4 w-full">
              <div className="text-md text-gray-700 font-semibold">
                {seller?.[field]}
              </div>
            </div>
          )}
          <div className="ml-4 p-0">
            {editingField === field
              ? renderSaveButton(field)
              : renderEditButton(field)}
          </div>
        </div>
        {editingField === field && isSensitiveField && (
          <div className="mt-2">
            <label className="block text-sm font-semibold mb-2 text-slate-500">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="rounded-md border bg-purple-200 border-gray-300 py-3 px-4 text-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}
      </div>
    );
  };

  //Functions to handle changes
  const handleAvatarChange = (e) => {
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    setAvatar(file);
    updateAvatarBackend();
  };

  const sendOtp = async () => {
    await sentOtpBackend();
    setShowPasswordChange(!showPasswordChange);
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword || !otp) {
      setError("Please fill all the fields");
      return;
    }
    console.log("Changing password");
    await updatePasswordBackend();
    setShowPasswordChange(false);
    setErrorMessage("Password changed successfully");
  };

  const handleVerify = async () => {
    const response = await askForVerificationBackend();
    setMessage(response.message);
  };

  const handleSave = (field) => {
    if (field === "email") {
      updateEmailBackend();
    } else if (field === "phone") {
      updatePhoneBackend();
    } else {
      updateProfileBackend();
    }

    setEditingField(null);
    setEditedValue("");
  };

  //Final return
  return (
    <div className="container mx-auto p-4 ">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Profile Information
      </h2>
      <div className="relative flex items-center justify-center mb-8">
        <img
          src={seller?.avatar}
          className="w-24 h-24 rounded-full mr-4"
          alt="Seller Avatar"
        />
        <label htmlFor="avatar-upload" className="cursor-pointer">
          <BsPencilSquare className="text-gray-700 hover:text-blue-700" />
        </label>
        <input
          id="avatar-upload"
          type="file"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>
      <div className="mb-10 bg-gray-200 px-2 pt-2 pb-4 rounded-lg">
        <div className=" px-4 pt-4 flex flex-col ">
          <span className="text-black text-2xl font-bold">
            Personal Information
          </span>

          {editingField === "GSTnumber" && (
            <div className="flex justify-center">
              We will verify your GST on change.{" "}
            </div>
          )}

          <span className="text-sm text-red-500 font-mono flex justify-center p-2">
            {error}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-6 px-2">
          <div className="col-span-1">
            {renderField("Full Name", "fullName")}
          </div>
          <div className="col-span-1">
            {renderField("GST Number", "GSTnumber")}
          </div>

          {!showPasswordChange ? (
            <>
              <div className="rounded-lg shadow-md p-6 bg-white m-2">
                <h3 className="text-md font-semibold mb-2 text-slate-500">
                  Password
                </h3>
                <div className="rounded-md border bg-purple-200 border-gray-300 py-2 px-4 w-full">
                  <button
                    className="text-md text-gray-700 font-semibold hover:text-blue-500 active:text-black"
                    onClick={() => sendOtp()}
                  >
                    Click here to change your password
                  </button>
                </div>
              </div>

              <div className="col-span-1">{renderField("Email", "email")}</div>
              <div className="col-span-1">{renderField("Phone", "phone")}</div>
            </>
          ) : (
            <div className="rounded-lg shadow-md p-6 bg-white m-2 row-span-2">
              <h3 className="text-md font-semibold mb-2 text-slate-500">
                Change Password
              </h3>
              <div className="flex flex-col items-start space-y-4">
                <input
                  type="text"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded-md border bg-purple-200 border-gray-300 py-2 px-4 w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-md border bg-purple-200 border-gray-300 py-2 px-4 w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="Email OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="rounded-md border bg-purple-200 border-gray-300 py-2 px-4 w-full"
                  re
                  quired
                />
                <div className="space-x-4">
                  <button
                    onClick={() => handlePasswordChange()}
                    className="text-blue-500 hover:text-blue-700 focus:outline-none text-s bg-transparent "
                  >
                    Save
                  </button>

                  <button
                    className="text-red-500 hover:text-red-700 focus:outline-none text-s bg-transparent "
                    onClick={() => setShowPasswordChange(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-10 bg-gray-200 px-2 pt-2 pb-4 rounded-lg">
        <div className="-m-1 text-black text-2xl font-bold p-4">
          General Information
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 px-2 space-x-7">
          <div className="rounded-lg shadow-md p-6 bg-white m-2">
            <h3 className="text-md font-semibold mb-2 text-slate-500">
              Verfified
            </h3>
            <div className="rounded-md border bg-purple-200 border-gray-300 py-2 px-4 w-full">
              <div className="text-md text-gray-700 font-semibold">
                {seller?.verified ? (
                  "Verified"
                ) : (
                  <>
                    <div>Not verfied</div>
                    <button
                      className="text-xs hover:text-sm active:text-gray-500"
                      onClick={handleVerify}
                    >
                      Click here to send mail to admin to verify your account
                    </button>
                    <div className="text-sm text-blue-500 font-mono flex justify-center p-2">
                      {message}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg shadow-md p-6 bg-white m-2">
            <h3 className="text-md font-semibold mb-2 text-slate-500">Niche</h3>
            <div className="rounded-md border bg-purple-200 border-gray-300 py-2 px-4 w-full">
              {nicheData ? (
                nicheData.map((nic, index) => (
                  <p
                    key={index}
                    className="text-md text-gray-700 font-semibold"
                  >
                    {nic.category}
                  </p>
                ))
              ) : (
                <p className="text-md text-gray-700 font-semibold">
                  No niches found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;