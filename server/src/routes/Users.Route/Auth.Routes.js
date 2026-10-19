import express from "express";
import { register, login, refresh, logout, getMe ,updateMe,changePassword} from "../../controllers/Authcontroller/Auth.controller.js";
import authenticate from "../../middleware/Authmidelwere/Authenticate.js";

const router = express.Router();

router.post("/register", register);
router.post("/login",  login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);
router.put("/me", authenticate, updateMe);
router.put("/me/password", authenticate, changePassword);
export default router;