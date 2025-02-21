import { Router } from "express";
import { getGroups, createGroups } from "../controllers/groupController";
const router = Router();

router.get("/groups/search", getGroups);
router.post("/groups/create", createGroups);

export default router;