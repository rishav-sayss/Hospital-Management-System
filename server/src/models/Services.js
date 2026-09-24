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
    isActive: {
      type: Boolean, // lets admin hide a service without deleting it
      default: true,
    },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;