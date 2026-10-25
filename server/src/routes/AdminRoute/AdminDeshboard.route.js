import express from "express";
import authenticate from "../../middleware/Authmidelwere/Authenticate.js";
import { authorizeRoles } from "../../middleware/Authmidelwere/Authorize.js";
import { getDashboardStats, getServiceDashboardStats, getDoctorsOverview } from "../../controllers/Admincontroller/AdminDeshboard.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/doctor-overview", getDoctorsOverview);
router.get("/service-dashboard", getServiceDashboardStats);

export default router;