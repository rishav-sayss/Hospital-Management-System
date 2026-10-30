import Service from "../../models/Services.js";
import Appointment from "../../models/Appointment.js";
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

    let parsedInstructions = [];

    if (preTestInstructions) {
      try {
        parsedInstructions = JSON.parse(preTestInstructions);
      } catch {
        parsedInstructions = [preTestInstructions];
      }
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
    const services = await Service.find()
      .select("name price image description")
      .lean();
    res.json({ services });
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
    const editableFields = ["name", "description", "price", "preTestInstructions", "category", "isActive"];
 
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
 
    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        service[field] = req.body[field];
      }
    });
 
    // If a new image was sent, remove the old one from Cloudinary before saving the new one
    if (req.file) {
      await deleteFromCloudinary(service.image?.publicId);
      const uploaded = await uploadBufferToCloudinary(req.file.buffer, "services");
      service.image = { url: uploaded.url, publicId: uploaded.publicId };
    }
 
    await service.save();
    res.status(200).json({ service });
  } catch (err) {
    res.status(500).json({ message: "Could not update service", error: err.message });
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

//@route  GET /api/admin/services-overview
// Feeds the "Service Dashboard" admin page: overall totals + a per-service
// breakdown table. Same shape as the doctors-overview endpoint, but for services.
export const getServicesOverview = async (req, res) => {
  try {
    const [services, serviceStats] = await Promise.all([
      Service.find(),
      Appointment.aggregate([
        { $match: { service: { $ne: null } } },
        {
          $group: {
            _id: "$service",
            appointments: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            cancelled: {
              $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
            },
            // Earnings count only what was actually completed, not just booked
            earning: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$fee", 0] },
            },
          },
        },
      ]),
    ]);

    const statsByService = Object.fromEntries(
      serviceStats.map((s) => [s._id.toString(), s]),
    );

    const serviceRows = services.map((svc) => {
      const stats = statsByService[svc._id.toString()] || {
        appointments: 0,
        completed: 0,
        cancelled: 0,
        earning: 0,
      };
      return {
        id: svc._id,
        name: svc.name,
        price: svc.price,
        image: svc.image?.url || null,
        appointments: stats.appointments,
        completed: stats.completed,
        cancelled: stats.cancelled,
        earning: stats.earning,
      };
    });

    const totals = serviceRows.reduce(
      (acc, s) => ({
        totalAppointments: acc.totalAppointments + s.appointments,
        totalEarning: acc.totalEarning + s.earning,
        completed: acc.completed + s.completed,
        cancelled: acc.cancelled + s.cancelled,
      }),
      { totalAppointments: 0, totalEarning: 0, completed: 0, cancelled: 0 },
    );

    res
      .status(200)
      .json({
        totalServices: services.length,
        ...totals,
        services: serviceRows,
      });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Could not fetch service dashboard overview",
        error: err.message,
      });
  }
};


// @route  GET /api/services/admin/all  (admin only)
// Same as the public list, but it also returns deactivated services. The public
// endpoint hides those on purpose, so it can't power the admin's "Unavailable"
// filter or let the admin restore a removed service.
export const getAllServicesAdmin = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json({ services });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch services", error: err.message });
  }
};
