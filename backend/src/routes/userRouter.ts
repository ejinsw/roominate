import { Router } from "express";
import { getUsers, updateMe, updateOnBoarding, deleteMe } from "../controllers/userController";
import { authenticate } from "../passport";
const router = Router();

router.get("/users", getUsers);
router.get("/test", (req, res) => {
  res.json({ message: "Test route" });
});

router.patch("/users/update", authenticate, updateMe)
router.patch("/users/update/on-boarding", authenticate, updateOnBoarding)

router.delete("/users/delete", authenticate, deleteMe);

export default router;
