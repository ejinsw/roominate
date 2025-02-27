import { Router } from "express";
import { register, login, me } from "../controllers/authController";
import { authenticate } from "../passport";
const router = Router();

router.post("/auth/login", login);
router.post("/auth/register", register);
router.get("/auth/me", authenticate, me)

export default router;