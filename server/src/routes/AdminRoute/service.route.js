import express from "express";
import authenticate from "../../middleware/Authmidelwere/Authenticate.js";
import { authorizeRoles } from "../../middleware/Authmidelwere/Authorize.js";
import upload from "../../middleware/Upload.js"; 
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesOverview,
  getAllServicesAdmin
} from "../../controllers/Admincontroller/Createservices.controller.js";

const router = express.Router();

// ---- Admin only — managing the service catalog ----
router.post("/", authenticate, authorizeRoles("admin"),upload.single("image") ,createService);
router.get("/Admin-Dashboard", authenticate, authorizeRoles("admin"),getServicesOverview);
router.put("/:id", authenticate, authorizeRoles("admin"),upload.single("image") ,updateService);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteService);
// Must stay above "/:id" so "admin" isn't mistaken for a service id
router.get("/admin/all", authenticate, authorizeRoles("admin"), getAllServicesAdmin);
// ---- Public — anyone can browse services ----
router.get("/", getAllServices);
router.get("/:id", getServiceById);

export default router;