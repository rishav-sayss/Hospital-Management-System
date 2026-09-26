import express from "express";
import authenticate from "../../middleware/Authmidelwere/Authenticate.js";
import { authorizeRoles } from "../../middleware/Authmidelwere/Authorize.js";
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

// ---- Public — patients browse doctors without logging in ---
router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);
router.get("/:id/available-dates", getAvailableDates);
router.get("/:id/available-slots", getAvailableSlots);

// Every route below is a doctor managing their OWN profile —
// authenticate confirms who they are, authorize("doctor") confirms their role.
router.use(authenticate, authorizeRoles("doctor"));

router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);

router.post("/me/schedule", addScheduleDate);
router.delete("/me/schedule/:date", deleteScheduleDate);

router.post("/me/schedule/:date/slots", addSlot);
router.delete("/me/schedule/:date/slots", deleteSlot);

export default router;
