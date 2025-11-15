import express from "express";
import { login, logout, registerUser , registerAdmin} from "../controllers/authController.js";

const router = express.Router();

router.post("/register/user", registerUser);
router.post("/register/admin", registerAdmin);
router.post("/login", login);
router.get("/logout", logout);

export default router;