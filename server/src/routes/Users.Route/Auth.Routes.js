import express from "express";
import { register, login, refresh, logout, getMe } from "../../controllers/Authcontroller/Auth.controller.js";
import authenticate from "../../middleware/Authmidelwere/Authenticate.js";
// import { authorizeRoles } from "../../middleware/Authmidelwere/Authorize.js";

const router = express.Router();

router.post("/register", register);
router.post("/login",  login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);

export default router;