import express from "express";
import authenticate from "../middleware/Authmidelwere/Authenticate.js";
import { authorizeRoles } from "../middleware/Authmidelwere/Authorize.js";
import { createAppointment, getMyAppointments,getDoctorAppointments,updateAppointmentStatus,cancelAppointment } from "../controllers/appointment.controller.js";
 


const router = express.Router();

router.post("/", authenticate, authorizeRoles("patient"), createAppointment);
router.get("/me", authenticate, authorizeRoles("patient"), getMyAppointments);
router.patch("/:id/cancel", authenticate, authorizeRoles("patient"), cancelAppointment);

// ---- Doctor routes ----
router.get("/doctor", authenticate, authorizeRoles("doctor"), getDoctorAppointments);
router.patch("/:id/status", authenticate, authorizeRoles("doctor"), updateAppointmentStatus);

export default router;