import Service from "../../models/Services.js";
import { uploadBufferToCloudinary } from "../../config/UploadtoClaudinary.js";
// @route  POST /api/services  (admin only)
export const createService = async (req, res) => {
  try {
    const { name, description, price, preTestInstructions, category } =
      req.body;

    if (!name || !description || price === undefined) {
      return res
        .status(400)
        .json({ message: "Name, description and price are required" });
    }
    let image;
    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(
        req.file.buffer,
        "services",
      );
      image = { url: uploaded.url, publicId: uploaded.publicId };
    }
    const service = await Service.create({
      name,
      description,
      price,
      preTestInstructions,
      category,
      image,
    });
    res.status(201).json({ service });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Could not create service", error: err.message });
  }
};

// @route  GET /api/services  (public — patients browse, admin's "List Services" also uses this)
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.status(200).json({ services });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Could not fetch services", error: err.message });
  }
};

// @route  GET /api/services/:id  (public — the service detail/booking page)
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ service });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Could not fetch service", error: err.message });
  }
};

// @route  PUT /api/services/:id  (admin only)
export const updateService = async (req, res) => {
  try {
    const editableFields = [
      "name",
      "description",
      "price",
      "preTestInstructions",
      "category",
      "isActive",
    ];

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        service[field] = req.body[field];
      }
    });

    await service.save();
    res.status(200).json({ service });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Could not update service", error: err.message });
  }
};

// @route  DELETE /api/services/:id  (admin only)
// Soft delete — marks inactive instead of removing, so past appointments still reference it fine
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.isActive = false;
    await service.save();

    res.status(200).json({ message: "Service deactivated" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Could not delete service", error: err.message });
  }
};
