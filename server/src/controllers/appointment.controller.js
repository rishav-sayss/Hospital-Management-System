import Doctor from "../models/Doctermodel.js";
import Appointment from "../models/Appointment.js";

// @route  POST /api/appointments
// body: { doctorId, date, time, patientDetails: {...}, paymentMethod }
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, patientDetails, paymentMethod } = req.body;

    if (!doctorId || !date || !time || !patientDetails) {
      return res
        .status(400)
        .json({ message: "doctorId, date, time and patientDetails are required" });
    }

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
    res.status(500).json({ message: "Could not create appointment", error: err.message });
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