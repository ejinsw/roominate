import { Router } from "express";
import { getGroups, createGroups, getGroupById, updateGroups } from "../controllers/groupController";
import { authenticate } from "../passport";
const router = Router();

router.get("/groups/search/:id", getGroupById)

router.get("/groups/search", getGroups);
router.post("/groups/create", createGroups);

router.patch("/groups/update", authenticate, updateGroups);
export default router;