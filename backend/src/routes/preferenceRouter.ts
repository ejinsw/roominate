import { Router } from "express";
import { getAllPreferences, getGroupsByPreferenceById, getUsersByPreferenceById } from "../controllers/preferenceController";
const router = Router();

router.get("/preferences", getAllPreferences);
router.get("/preferences/users/:id", getUsersByPreferenceById);
router.get("/preferences/groups/:id", getGroupsByPreferenceById);

export default router;