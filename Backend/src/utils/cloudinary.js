import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  console.log("Uploading file to cloudinary : ", localFilePath);

  try {
    if (!localFilePath) return null;

    //upload file to cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File uploaded successfully : ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log("Error in uploading file to cloudinary : ", error);
    fs.unlinkSync(localFilePath); //remove temporary file from local directory
    return null;
  }
};

const deleteFromCloudinary = async (publicID) => {
  console.log("Deleting file from cloudinary : ", publicID);

  try {
    if (!publicID) return null;

    //delete file from cloudinary
    const response = await cloudinary.uploader.destroy(publicID);

    console.log("File deleted successfully : ", response.result);
    return response;
  } catch (error) {
    console.log("Error in deleting file from cloudinary : ", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
