import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    // The logged-in patient who made the booking (optional so guest bookings can be supported later)
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Exactly one of these two should be set — a doctor consultation OR a standalone service.
    // (see the pre-validate check below)
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },

    // Filled from the "Patient Details" / "Your Details" form, even if the patient is logged in —
    // the booking may be for someone else (e.g. a family member)
    patientDetails: {
      fullName: { type: String, required: true },
      mobile: { type: String, required: true },
      age: { type: Number, required: true },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
      },
      email: { type: String }, // optional, for receipts
    },

    date: { type: String, required: true }, // "YYYY-MM-DD"
    time: { type: String, required: true }, // e.g. "10:00 AM"

    fee: { type: Number, required: true }, // snapshot of the price at booking time
    paymentMethod: {
      type: String,
      enum: ["cash", "online"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Every appointment must be for a doctor OR a service, never both, never neither
appointmentSchema.pre("validate", function () {
  if (!this.doctor && !this.service) {
    return next(
      new Error("Appointment must reference either a doctor or a service"),
    );
  }
  if (this.doctor && this.service) {
    return next(
      new Error("Appointment cannot reference both a doctor and a service"),
    );
  }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
