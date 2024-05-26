import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsPencilSquare } from "react-icons/bs";
import { patchUser } from "../../store/UserSlice";
import { useLocation } from "react-router-dom";
import axios from "axios";

function AccountInfo() {
  const fullPath = window.location.href;
  const location = useLocation();
  const initialPath = fullPath.replace(location.pathname, "") + "/";

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [editingField, setEditingField] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState(null);

  // for changing password
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [message, setMessage] = useState("");

  {
    /*Backend functions*/
  }
  const updateProfileBackend = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/v1/users/update/profile`,
        {
          [editingField]: editedValue,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("Profile updated successfully");
        dispatch(patchUser({ [editingField]: editedValue }));
        return response.data;
      }
    } catch (error) {
      console.log("Error updating profile:", error);
      throw error;
    }
  }; //working

  const updateEmailBackend = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/v1/users/update/email`,
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
        dispatch(patchUser({ [editingField]: editedValue }));
        return response.data;
      }
    } catch (error) {
      console.log("Error updating email:", error);
      setError(error.response.data.message);
      throw error;
    }
  }; //working

  const updatePhoneBackend = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/v1/users/update/phone`,
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
        dispatch(patchUser({ [editingField]: editedValue }));
        return response.data;
      }
    } catch (error) {
      console.log("Error updating phone:", error);
      setError(error.response.data.message);
      throw error;
    }
  }; //working

  const updateAvatarBackend = async () => {
    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const response = await axios.patch(
        `http://localhost:8000/v1/users/update/avatar`,
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
        dispatch(patchUser({ avatar: response.data.data.avatar }));
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
        `http://localhost:8000/v1/users/generate-email-otp`,
        {
          email: user.email,
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
        `http://localhost:8000/v1/users/verifyotp`,
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

  //Function to save the edited field
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

  useEffect(() => {
    if (error || message) {
      setTimeout(() => {
        setError(null);
        setMessage(null);
      }, 2500);
    }
  }, [error,message]);

  const handleAvatarChange = (e) => {
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

  {
    /*Buttons*/
  }
  const renderEditButton = (field) => (
    <button
      onClick={() => {
        setShowPasswordChange(false);
        if (editingField === field) {
          setEditingField(null);
          setEditedValue("");
        } else {
          setEditingField(field);
          setEditedValue(user?.[field] || "");
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

  const handleVerify = async () => {
    const redirectURL = initialPath + "user/verify";
    try {
      const response = await axios.post(
        "http://localhost:8000/v1/users/self-verification-link",
        {
          redirectURL,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response);
      if (response.status === 200) {
      //   console.log("Verification link sent");
        setMessage("Verification link sent to your email");
      }
    } catch (error) {
      setMessage(error.response.data.message);
      throw error;
    }
  };

  {
    /*****/
  }
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
              <p className="text-md text-gray-700 font-semibold">
                {user?.[field]}
              </p>
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

  return (
    <div className="container mx-auto p-4 ">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Account Information
      </h2>
      <div className="relative flex items-center justify-center mb-8">
        <img
          src={user?.avatar}
          className="w-24 h-24 rounded-full mr-4"
          alt="User Avatar"
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
        <div className="-m-1 px-4 pt-4 flex flex-col ">
          <span className="text-black text-2xl font-bold">
            Personal Information
          </span>
          <span className="text-sm text-red-500 font-mono mt-2 flex justify-center p-2">
            {error}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 px-2">
          <div className="col-span-1">
            {renderField("Username", "username")}
          </div>
          <div className="col-span-1">
            {renderField("Full Name", "fullName")}
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
              <p className="text-md text-gray-700 font-semibold">
                {user?.verified ? (
                  "Verified"
                ) : (
                  <>
                    <div>Not verfied</div>
                    <button
                      className="text-xs hover:text-sm active:text-gray-500"
                      onClick={handleVerify}
                    >
                      Click here to verify your account
                    </button>
                    <div className="text-sm text-blue-500 font-mono flex justify-center p-2">
                      {message}
                    </div>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="rounded-lg shadow-md p-6 bg-white m-2">
            <h3 className="text-md font-semibold mb-2 text-slate-500">Role</h3>
            <div className="rounded-md border bg-purple-200 border-gray-300 py-2 px-4 w-full">
              <p className="text-md text-gray-700 font-semibold">
                {user?.isAdmin ? "Admin" : "User"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountInfo;
