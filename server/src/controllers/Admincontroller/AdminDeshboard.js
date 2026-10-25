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

// @route  GET /api/admin/doctors-overview
// Feeds the main Dashboard page: overall totals + a per-doctor breakdown table.
// "Earnings" and "Completed/Cancelled" are counted per doctor from their own
// appointments — a doctor with no appointments yet still shows up with zeros.
export const getDoctorsOverview = async (req, res) => {
  try {
    const [totalDoctors, totalRegisteredUsers, doctors, doctorStats] = await Promise.all([
      Doctor.countDocuments(),
      User.countDocuments(),
      Doctor.find().populate("user", "name"),
      Appointment.aggregate([
        { $match: { doctor: { $ne: null } } },
        {
          $group: {
            _id: "$doctor",
            appointments: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
            cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
            // Earnings count only what was actually completed, not just booked
            totalEarnings: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$fee", 0] } },
          },
        },
      ]),
    ]);

    const statsByDoctor = Object.fromEntries(doctorStats.map((s) => [s._id.toString(), s]));

    const doctorRows = doctors.map((doc) => {
      const stats = statsByDoctor[doc._id.toString()] || {
        appointments: 0,
        completed: 0,
        cancelled: 0,
        totalEarnings: 0,
      };
      return {
        id: doc._id,
        name: doc.user?.name || "Doctor",
        specialization: doc.specialization,
        fee: doc.consultationFee,
        image: doc.image?.url || null,
        appointments: stats.appointments,
        completed: stats.completed,
        cancelled: stats.cancelled,
        totalEarnings: stats.totalEarnings,
      };
    });

    const totals = doctorRows.reduce(
      (acc, d) => ({
        totalAppointments: acc.totalAppointments + d.appointments,
        totalEarnings: acc.totalEarnings + d.totalEarnings,
        completed: acc.completed + d.completed,
        cancelled: acc.cancelled + d.cancelled,
      }),
      { totalAppointments: 0, totalEarnings: 0, completed: 0, cancelled: 0 }
    );

    res.status(200).json({ totalDoctors, totalRegisteredUsers, ...totals, doctors: doctorRows });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch dashboard overview", error: err.message });
  }
};