import { ApiError } from "../utils/apiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!error instanceof Error) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;

    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || []);
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Something went wrong",
    errors: error.errors || [],
  });
};

export default errorHandler;
