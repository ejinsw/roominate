import { Router } from "express";
import { getUsers } from "../controllers/userController";
import { authenticateOptional } from "../passport";
const router = Router();

router.get("/users", authenticateOptional, getUsers);
router.get("/test", (req, res) => {
    res.json({ message: "Test route" });
    });

export default router;