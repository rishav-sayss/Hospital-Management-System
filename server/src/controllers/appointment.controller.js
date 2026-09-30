import Doctor from "../models/Doctor.js";
import Service from "../models/Service.js";
import Appointment from "../models/Appointment.js";

// Marks a doctor's slot as unbooked again — used whenever a doctor appointment
// gets cancelled, so someone else can book that same date/time
const freeDoctorSlot = async (doctorId, date, time) => {
  await Doctor.updateOne(
    { _id: doctorId, schedule: { $elemMatch: { date, slots: { $elemMatch: { time } } } } },
    { $set: { "schedule.$[day].slots.$[slot].isBooked": false } },
    { arrayFilters: [{ "day.date": date }, { "slot.time": time }] }
  );
};

// @route  POST /api/appointments
// body: { doctorId OR serviceId, date, time, patientDetails: {...}, paymentMethod }
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, serviceId, date, time, patientDetails, paymentMethod } = req.body;

    if ((!doctorId && !serviceId) || !date || !time || !patientDetails) {
      return res
        .status(400)
        .json({ message: "doctorId or serviceId, date, time and patientDetails are required" });
    }
    if (doctorId && serviceId) {
      return res.status(400).json({ message: "Provide either doctorId or serviceId, not both" });
    }

    // ---- Service booking — no schedule/slots to check, any date/time is accepted ----
    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (!service || !service.isActive) {
        return res.status(404).json({ message: "Service not found" });
      }

      const appointment = await Appointment.create({
        patient: req.user._id,
        service: serviceId,
        patientDetails,
        date,
        time,
        fee: service.price,
        paymentMethod: paymentMethod || "cash",
      });

      return res.status(201).json({ appointment });
    }

    // ---- Doctor booking — existing atomic slot-booking logic below ----
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Atomically flip the matching slot to booked, ONLY if it's currently unbooked.
    // If two patients try to book the same slot at the same time, only the first
    // update actually matches a document — the second gets matchedCount: 0.
    const updateResult = await Doctor.updateOne(
      {
        _id: doctorId,
        schedule: {
          $elemMatch: { date, slots: { $elemMatch: { time, isBooked: false } } },
        },
      },
      { $set: { "schedule.$[day].slots.$[slot].isBooked": true } },
      {
        arrayFilters: [{ "day.date": date }, { "slot.time": time, "slot.isBooked": false }],
      }
    );

    if (updateResult.matchedCount === 0) {
      return res
        .status(409)
        .json({ message: "This slot is not available (already booked or doesn't exist)" });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      patientDetails,
      date,
      time,
      fee: doctor.consultationFee,
      paymentMethod: paymentMethod || "cash",
    });

    res.status(201).json({ appointment });
  } catch (err) {
    console.error(err); // TEMPORARY — prints the full stack trace to the terminal
    res.status(500).json({ message: "Could not create appointment", error: err.message });
  }
};

// @route  PATCH /api/appointments/:id/cancel
// The patient who booked it can cancel their own upcoming appointment
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Ownership check — a patient can only cancel THEIR OWN booking
    if (appointment.patient?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "This appointment does not belong to you" });
    }

    if (["completed", "cancelled"].includes(appointment.status)) {
      return res.status(400).json({ message: `Appointment is already ${appointment.status}` });
    }

    appointment.status = "cancelled";
    await appointment.save();

    if (appointment.doctor) {
      await freeDoctorSlot(appointment.doctor, appointment.date, appointment.time);
    }

    res.status(200).json({ appointment });
  } catch (err) {
    res.status(500).json({ message: "Could not cancel appointment", error: err.message });
  }
};

// @route  GET /api/appointments/me
// The logged-in patient's own appointment history
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate({ path: "doctor", populate: { path: "user", select: "name" } })
      .sort({ createdAt: -1 });

    res.status(200).json({ appointments });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch appointments", error: err.message });
  }
};

// @route  GET /api/appointments/doctor
// The logged-in doctor's own list of appointments (all patients who booked them)
export const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate("patient", "name email")
      .sort({ date: 1, time: 1 });

    res.status(200).json({ appointments });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch appointments", error: err.message });
  }
};

// @route  PATCH /api/appointments/:id/status
// body: { status, paymentStatus } — send either one or both
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const allowedStatus = ["pending", "confirmed", "completed", "cancelled"];
    const allowedPaymentStatus = ["pending", "paid"];

    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    if (paymentStatus && !allowedPaymentStatus.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid paymentStatus value" });
    }
    if (!status && !paymentStatus) {
      return res.status(400).json({ message: "Provide status and/or paymentStatus to update" });
    }

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Ownership check — a doctor can only update appointments booked with THEM,
    // never someone else's appointment even if they guess a valid appointment id
    if (appointment.doctor?.toString() !== doctor._id.toString()) {
      return res.status(403).json({ message: "This appointment does not belong to you" });
    }

    if (status) appointment.status = status;
    if (paymentStatus) appointment.paymentStatus = paymentStatus;
    await appointment.save();

    if (status === "cancelled" && appointment.doctor) {
      await freeDoctorSlot(appointment.doctor, appointment.date, appointment.time);
    }

    res.status(200).json({ appointment });
  } catch (err) {
    res.status(500).json({ message: "Could not update appointment", error: err.message });
  }
};

// @route  GET /api/appointments/admin?type=doctor  → "Appointments" (doctor consultations)
// @route  GET /api/appointments/admin?type=service → "Service Appointments"
// @route  GET /api/appointments/admin              → everything
// Admin-only — sees every appointment across every doctor/service, not just their own
export const getAllAppointments = async (req, res) => {
  try {
    const { type } = req.query;

    const filter = {};
    if (type === "doctor") filter.doctor = { $ne: null };
    if (type === "service") filter.service = { $ne: null };

    const appointments = await Appointment.find(filter)
      .populate("patient", "name email")
      .populate({ path: "doctor", populate: { path: "user", select: "name" } })
      .populate("service", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json({ appointments });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch appointments", error: err.message });
  }
};