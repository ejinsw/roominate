import { Router } from "express";
import { getUsers } from "../controllers/userController";
const router = Router();

router.get("/users", getUsers);
router.get("/test", (req, res) => {
    res.json({ message: "Test route" });
    });

export default router;