import express from "express";
import { adminCreateDoctor,updateDoctorByAdmin,deleteDoctorByAdmin,adminGetDoctors} from "../../controllers/Docter.controller.js";
import authenticate from "../../middleware/Authmidelwere/Authenticate.js";
import upload from "../../middleware/Upload.js";
import  {authorizeRoles} from "../../middleware/Authmidelwere/Authorize.js";

const router = express.Router();
const adminOnly = [authenticate, authorizeRoles("admin")];
router.post("/doctors", adminOnly, upload.single("image"), adminCreateDoctor);
router.get("/doctors",adminOnly ,adminGetDoctors);
router.put("/:id/admin", adminOnly, updateDoctorByAdmin);
router.delete("/:id/admin", adminOnly, deleteDoctorByAdmin);
export default router;