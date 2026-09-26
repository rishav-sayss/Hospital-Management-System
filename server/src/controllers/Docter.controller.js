import Doctor from "../models/Doctermodel.js";

// Fetches the doctor profile linked to the logged-in user, or sends a 404 and returns null.
// Every handler below calls this first so a doctor can only ever touch their OWN profile.
const findOwnDoctorProfile = async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    res.status(404).json({ message: "Doctor profile not found" });
    return null;
  }
  return doctor;
};

// @route  GET /api/doctors/me
export const getMyProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }).populate("user", "name email");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }
    res.status(200).json({ doctor });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch profile", error: err.message });
  }
};

// @route  PUT /api/doctors/me
// Updates the doctor's own editable fields. Schedule has its own endpoints below,
// so it's deliberately left out of this list.
export const updateMyProfile = async (req, res) => {
  try {
    const doctor = await findOwnDoctorProfile(req, res);
    if (!doctor) return;

    const editableFields = [
      "specialization",
      "qualifications",
      "experience",
      "location",
      "about",
      "consultationFee",
      "isAvailable",
    ];

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    });

    await doctor.save();
    res.status(200).json({ doctor });
  } catch (err) {
    res.status(500).json({ message: "Could not update profile", error: err.message });
  }
};

// @route  POST /api/doctors/me/schedule
// body: { date: "2026-02-15" }
export const addScheduleDate = async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const doctor = await findOwnDoctorProfile(req, res);
    if (!doctor) return;

    const alreadyExists = doctor.schedule.some((day) => day.date === date);
    if (alreadyExists) {
      return res.status(409).json({ message: "This date is already in your schedule" });
    }

    doctor.schedule.push({ date, slots: [] });
    await doctor.save();

    res.status(201).json({ schedule: doctor.schedule });
  } catch (err) {
    res.status(500).json({ message: "Could not add date", error: err.message });
  }
};

// @route  DELETE /api/doctors/me/schedule/:date
export const deleteScheduleDate = async (req, res) => {
  try {
    const { date } = req.params;
    const doctor = await findOwnDoctorProfile(req, res);
    if (!doctor) return;

    const day = doctor.schedule.find((d) => d.date === date);
    if (!day) {
      return res.status(404).json({ message: "Date not found in schedule" });
    }

    // Refuse to remove a date that already has a patient booked into it
    const hasBookedSlot = day.slots.some((slot) => slot.isBooked);
    if (hasBookedSlot) {
      return res.status(400).json({ message: "Cannot remove a date with booked appointments" });
    }

    doctor.schedule = doctor.schedule.filter((d) => d.date !== date);
    await doctor.save();

    res.status(200).json({ schedule: doctor.schedule });
  } catch (err) {
    res.status(500).json({ message: "Could not delete date", error: err.message });
  }
};

// @route  POST /api/doctors/me/schedule/:date/slots
// body: { time: "10:00 AM" }
export const addSlot = async (req, res) => {
  try {
    const { date } = req.params;
    const { time } = req.body;
    if (!time) {
      return res.status(400).json({ message: "Time is required" });
    }

    const doctor = await findOwnDoctorProfile(req, res);
    if (!doctor) return;

    const day = doctor.schedule.find((d) => d.date === date);
    if (!day) {
      return res.status(404).json({ message: "Date not found in schedule" });
    }

    const alreadyExists = day.slots.some((slot) => slot.time === time);
    if (alreadyExists) {
      return res.status(409).json({ message: "This time slot already exists for this date" });
    }

    day.slots.push({ time, isBooked: false });
    await doctor.save();

    res.status(201).json({ schedule: doctor.schedule });
  } catch (err) {
    res.status(500).json({ message: "Could not add slot", error: err.message });
  }
};

// @route  DELETE /api/doctors/me/schedule/:date/slots
// body: { time: "10:00 AM" }
// (time is sent in the body, not the URL, since "10:00 AM" contains a space and a colon)
export const deleteSlot = async (req, res) => {
  try {
    const { date } = req.params;
    const { time } = req.body;
    if (!time) {
      return res.status(400).json({ message: "Time is required" });
    }

    const doctor = await findOwnDoctorProfile(req, res);
    if (!doctor) return;

    const day = doctor.schedule.find((d) => d.date === date);
    if (!day) {
      return res.status(404).json({ message: "Date not found in schedule" });
    }

    const slot = day.slots.find((s) => s.time === time);
    if (slot?.isBooked) {
      return res.status(400).json({ message: "Cannot remove a slot that is already booked" });
    }

    day.slots = day.slots.filter((s) => s.time !== time);
    await doctor.save();

    res.status(200).json({ schedule: doctor.schedule });
  } catch (err) {
    res.status(500).json({ message: "Could not delete slot", error: err.message });
  }
};



//**   Public Apis  ***/

// @route  GET /api/doctors/:id
// Public — patients browse a doctor's profile without logging in
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("user", "name");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json({ doctor });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch doctor", error: err.message });
  }
};
 
// @route  GET /api/doctors/:id/available-dates
// Public — only returns dates that still have at least one unbooked slot
export const getAvailableDates = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
 
    const availableDates = doctor.schedule
      .filter((day) => day.slots.some((slot) => !slot.isBooked))
      .map((day) => day.date);
 
    res.status(200).json({ dates: availableDates });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch dates", error: err.message });
  }
};
 
// @route  GET /api/doctors/:id/available-slots?date=YYYY-MM-DD
// Public — only returns the unbooked slots for the requested date.
// If the date has no slots left (or doesn't exist), returns an empty array —
// the frontend can show "No time slots for this date" for that case.
export const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Date query param is required" });
    }
 
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
 
    const day = doctor.schedule.find((d) => d.date === date);
    const availableSlots = day
      ? day.slots.filter((slot) => !slot.isBooked).map((s) => s.time)
      : [];
 
    res.status(200).json({ slots: availableSlots });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch slots", error: err.message });
  }
};


// @route  GET /api/doctors  (public — patients browse, admin's "List Doctors" also uses this)
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("user", "name email");
    res.status(200).json({ doctors });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch doctors", error: err.message });
  }
};