import cloudinary from "../config/Claudinary.js";
import streamifier from "streamifier";

// Uploads a Buffer (from multer's memory storage) to Cloudinary and
// returns { url, publicId } — publicId is saved so the image can be deleted later
export const uploadBufferToCloudinary = (buffer, folder = "hospital-management") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve({ url: result.secure_url, publicId: result.public_id });
    });
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// console.log("Cloudinary API Key:UPme", process.env.CLOUDINARY_API_KEY);
// Deletes a previously uploaded image by its Cloudinary public_id.
// Safe to call with an empty/undefined publicId (e.g. a service that never had an image).
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};