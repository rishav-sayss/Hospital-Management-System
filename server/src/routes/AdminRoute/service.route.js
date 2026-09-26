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
} from "../../controllers/Admincontroller/Createservices.controller.js";

const router = express.Router();

// ---- Public — anyone can browse services ----
router.get("/", getAllServices);
router.get("/:id", getServiceById);

// ---- Admin only — managing the service catalog ----
router.post("/", authenticate, authorizeRoles("admin"),upload.single("image") ,createService);
router.put("/:id", authenticate, authorizeRoles("admin"),upload.single("image") ,updateService);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteService);

export default router;