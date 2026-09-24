import mongoose from "mongoose";

// One time slot inside a doctor's schedule for a given date (e.g. "10:00 AM")
const timeSlotSchema = new mongoose.Schema(
  {
    time: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
  },
  { _id: false }
);

// One date entry in a doctor's schedule, holding all slots for that date
const scheduleDaySchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // stored as "YYYY-MM-DD" for easy sorting/matching
    slots: [timeSlotSchema],
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    // Every doctor profile belongs to exactly one User (whose role must be "doctor")
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"], // e.g. "ENT Specialist", "Pediatrician"
    },
    qualifications: {
      type: String, // e.g. "MBBS, MS (ENT)"
    },
    experience: {
      type: Number, // years of experience
      default: 0,
    },
    location: {
      type: String, // e.g. "City ENT Clinic"
    },
    about: {
      type: String,
      maxlength: 500,
    },
    consultationFee: {
      type: Number,
      required: [true, "Consultation fee is required"],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    successRate: {
      type: Number, // stored as a plain percentage number, e.g. 98
      default: 0,
      min: 0,
      max: 100,
    },
    totalPatients: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean, // the "Available" toggle on the doctor's own profile page
      default: true,
    },
    schedule: [scheduleDaySchema], // dates the doctor has opened up, each with its own slots
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;