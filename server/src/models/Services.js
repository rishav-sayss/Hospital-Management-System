import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"], // e.g. "Blood Pressure Check"
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"], // shown under "About This Service"
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    preTestInstructions: [{ type: String }], // bullet points, e.g. "Avoid caffeine 1 hour before."
    category: {
      type: String, // optional grouping, e.g. "Diagnostic", "Checkup"
    },
    image: {
      url: { type: String }, // Cloudinary secure_url, shown on the service card/detail page
      publicId: { type: String }, // Cloudinary public_id, needed to delete/replace the image later
    },
    isActive: {
      type: Boolean, // lets admin hide a service without deleting it
      default: true,
    },
  },
  { timestamps: true },
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
