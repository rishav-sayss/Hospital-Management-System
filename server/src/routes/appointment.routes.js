import express from "express";
import authenticate from "../../middleware/Authmidelwere/Authenticate.js";
import { authorizeRoles } from "../../middleware/Authmidelwere/Authorize.js";
import { createAppointment, getMyAppointments } from "../controllers/appointment.controller.js";
 


const router = express.Router();

router.post("/", authenticate, authorizeRoles("patient"), createAppointment);
router.get("/me", authenticate, authorizeRoles("patient"), getMyAppointments);

export default router;