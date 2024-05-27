import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UserAddress } from "../models/userAddress.model.js";

const addAddress = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const { addressLine1, addressLine2, city, state, pincode, country, contact } =
    req.body;

  if (!addressLine1 || !city || !pincode || !country || !contact) {
    return next(new ApiError(400, "All marked fields are required"));
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
  });

  if (!newAddress) {
    return next(new ApiError(500, "Address not created"));
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Address added", newAddress));
});

const userAddresses = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  // console.log("User",user);

  const addresses = await UserAddress.find({ user: user._id });
  if (!addresses) {
    return next(new ApiError(404, "Addresses not found"));
  }

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
    return next(new ApiError(401, "Unauthorized"));
  }

  const { addressId } = req.params;
  if (!addressId) {
    return next(new ApiError(400, "Address id is required"));
  }

  const address = await UserAddress.findOneAndDelete({
    $and: [{ _id: addressId }, { user: user._id }],
  });
  if (!address) {
    return next(new ApiError(404, "Address not found for current user"));
  }

  return res.status(200).json(new ApiResponse(200, address, "Address removed"));
});

const removeMultipleAddresses = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  let { addressIds } = req.body;
  if (!addressIds) {
    return next(new ApiError(400, "No address selected"));
  }

  addressIds = addressIds.split(",");
  addressIds = addressIds.map((id) => id.trim());
  const deletedAddresses = [];

  for (let i = 0; i < addressIds.length; i++) {
    const address = await UserAddress.findOneAndDelete({
      $and: [{ _id: addressIds[i] }, { user: user._id }],
    });
    if (!address) {
      return next(new ApiError(404, `Address ${addressIds[i]} not found`));
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
    return next(new ApiError(401, "Unauthorized user"));
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
    return next(new ApiError(400, "All fields are empty"));
  }

  const currentAddress = await UserAddress.findById(addressId);
  if (!currentAddress) {
    return next(new ApiError(404, "Address not found"));
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
    return next(new ApiError(500, "Address not updated"));
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
