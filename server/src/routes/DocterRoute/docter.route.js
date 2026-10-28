import express from "express";
import authenticate from "../../middleware/Authmidelwere/Authenticate.js";
import { authorizeRoles } from "../../middleware/Authmidelwere/Authorize.js";
import upload from "../../middleware/Upload.js";
import {
  getMyProfile,
  updateMyProfile,
  addScheduleDate,
  deleteScheduleDate,
  addSlot,
  deleteSlot,
  getAllDoctors,
  getDoctorById,
  getAvailableDates,
  getAvailableSlots,
 
} from "../../controllers/Docter.controller.js";

const router = express.Router();

const me = express.Router();

// ---- Doctor apni profile manage kare (/api/doctor/me/...) ----
// Ye /:id se PEHLE hona zaroori hai, aur login + doctor role sirf yahin lagta hai
me.use(authenticate, authorizeRoles("doctor"));

me.get("/", getMyProfile);
me.put("/", upload.single("image"), updateMyProfile);
me.post("/schedule", addScheduleDate);
me.delete("/schedule/:date", deleteScheduleDate);

me.post("/schedule/:date/slots", addSlot);
me.delete("/schedule/:date/slots", deleteSlot);

router.use("/me", me);



// ---- Public — patients browse doctors without logging in ---
router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);
router.get("/:id/available-dates", getAvailableDates);
router.get("/:id/available-slots", getAvailableSlots);

export default router;
