import { Router } from "express";
import { register, login } from "../controllers/authController";
const router = Router();

router.post("/login", register);
router.post("/register", login);

export default router;