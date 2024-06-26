import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UserAddress } from "../models/userAddress.model.js";

const addAddress = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  const { addressLine1, addressLine2, city, state, pincode, country, contact } =
    req.body;

  console.log("Address", addressLine1);

  if (!addressLine1 || !city || !pincode || !country || !contact) {
    throw new ApiError(400, "All marked fields are required");
  }

  const newAddress = await UserAddress.create({
    addressLine1,
    addressLine2: addressLine2 || "",
    city,
    state: state || "",
    pincode,
    country,
    contact,
    user: user._id,
    active: true,
  });

  if (!newAddress) {
    throw new ApiError(500, "Address not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newAddress, "Address added"));
});

const userAddresses = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  // console.log("User",user);

  const addresses = await UserAddress.find({ user: user._id, active: true });
  if (!addresses) {
    throw new ApiError(404, "Addresses not found");
  }

  console.log("Addresses", addresses);

  if (addresses.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, addresses, "No addresses exist for user"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, addresses, "Addresses found"));
});

const removeAddress = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  const { addressId } = req.params;
  if (!addressId) {
    throw new ApiError(400, "Address id is required");
  }

  const address = await UserAddress.findOne({ user: user._id, _id: addressId });
  if (!address) {
    throw new ApiError(404, "Address not found for current user");
  }

  address.active = false;
  const updatedAddress = await address.save({
    validateBeforeSave: false,
  });

  if (!updatedAddress) {
    throw new ApiError(500, "Address not removed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updateAddress, "Address removed"));
});

const removeMultipleAddresses = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  let { addressIds } = req.body;
  if (!addressIds) {
    throw new ApiError(400, "No address selected");
  }

  addressIds = addressIds.split(",");
  addressIds = addressIds.map((id) => id.trim());
  const deletedAddresses = [];

  for (let i = 0; i < addressIds.length; i++) {
    const address = await UserAddress.findOneAndDelete({
      $and: [{ _id: addressIds[i] }, { user: user._id }],
    });
    if (!address) {
      throw new ApiError(404, `Address ${addressIds[i]} not found`);
    }
    deletedAddresses.push(address);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedAddresses, "Addresses removed"));
});

const updateAddress = asyncHandler(async (req, res, next) => {
  const { addressId } = req.params;

  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized user");
  }

  const { addressLine1, addressLine2, city, state, pincode, country, contact } =
    req.body;

  if (
    !addressLine1 &&
    !addressLine2 &&
    !city &&
    !state &&
    !pincode &&
    !country &&
    !contact
  ) {
    throw new ApiError(400, "All fields are empty");
  }

  const currentAddress = await UserAddress.findById(addressId);
  if (!currentAddress) {
    throw new ApiError(404, "Address not found");
  }

  if (addressLine1) currentAddress.addressLine1 = addressLine1;
  if (addressLine2) currentAddress.addressLine2 = addressLine2;
  if (city) currentAddress.city = city;
  if (state) currentAddress.state = state;
  if (pincode) currentAddress.pincode = pincode;
  if (country) currentAddress.country = country;
  if (contact) currentAddress.contact = contact;

  const updatedAddress = await currentAddress.save({
    validateBeforeSave: false,
  });
  if (!updatedAddress) {
    throw new ApiError(500, "Address not updated");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAddress, "Address updated"));
});

export {
  addAddress,
  removeAddress,
  userAddresses,
  removeMultipleAddresses,
  updateAddress,
};
