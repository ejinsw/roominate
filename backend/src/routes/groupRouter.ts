import { Router } from "express";
import { getGroups, createGroups, getGroupById } from "../controllers/groupController";
const router = Router();

router.get("/groups/search/:id", getGroupById)

router.get("/groups/search", getGroups);
router.post("/groups/create", createGroups);

export default router;