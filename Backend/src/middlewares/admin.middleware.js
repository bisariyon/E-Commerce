import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";

export const verifyIsAdmin = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  if (!userId) {
    return next(new ApiError(404, "Unauthorized access"));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  if(!user.isAdmin){
    return next(new ApiError(404, "Only admin can access this route"));
  }

  next();
});
