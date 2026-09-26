import express from "express";
import authenticate from "../../middleware/Authmidelwere/Authenticate.js";
import { authorize } from "../../middleware/Authmidelwere/Authorize.js";
import { getDashboardStats, getServiceDashboardStats } from "../../controllers/Admincontroller/AdminDeshboard.js";

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/service-dashboard", getServiceDashboardStats);

export default router;