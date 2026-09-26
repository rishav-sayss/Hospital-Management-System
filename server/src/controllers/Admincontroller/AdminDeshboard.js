import User from "../../models/Authmodel/Usermodel.js";
import Doctor from "../../models/Doctermodel.js";
import Appointment from "../../models/Appointment.js";
import Service from "../../models/Services.js";
 
// @route  GET /api/admin/dashboard
// Feeds the main "Dashboard" admin page
export const getDashboardStats = async (req, res) => {
  try {
    const [totalDoctors, totalPatients, totalAppointments, totalServices] = await Promise.all([
      Doctor.countDocuments(),
      User.countDocuments({ role: "patient" }),
      Appointment.countDocuments({ doctor: { $ne: null } }),
      Service.countDocuments(),
    ]);
 
    res.status(200).json({ totalDoctors, totalPatients, totalAppointments, totalServices });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch dashboard stats", error: err.message });
  }
};
 
// @route  GET /api/admin/service-dashboard
// Feeds the "Service Dashboard" admin page
export const getServiceDashboardStats = async (req, res) => {
  try {
    const [totalServices, totalServiceBookings] = await Promise.all([
      Service.countDocuments(),
      Appointment.countDocuments({ service: { $ne: null } }),
    ]);
 
    const revenueAgg = await Appointment.aggregate([
      { $match: { service: { $ne: null }, paymentStatus: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$fee" } } },
    ]);
 
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
 
    res.status(200).json({ totalServices, totalServiceBookings, totalRevenue });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch service dashboard stats", error: err.message });
  }
};
