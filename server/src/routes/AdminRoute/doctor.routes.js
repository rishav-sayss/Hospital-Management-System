import express from "express";
import { createDoctor } from "../../controllers/Admincontroller/Createdoctor.controller.js";
import protect from "../../middleware/Authmidelwere/Authenticate.js";
import  {authorizeRoles} from "../../middleware/Authmidelwere/Authorize.js";

const router = express.Router();

router.post(
  "/doctors",
  protect,
  authorizeRoles("admin"),
  createDoctor
);

export default router;