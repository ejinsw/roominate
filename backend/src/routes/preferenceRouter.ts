import { Router } from "express";
import { createGroupPreference, createUserPreference, getAllPreferences, getGroupsByPreferenceById, getUsersByPreferenceById, updateGroupPreference, updateUserPreference } from "../controllers/preferenceController";
const router = Router();

router.get("/preferences", getAllPreferences);
router.get("/preferences/users/:id", getUsersByPreferenceById);
router.post("/preferences/users/:id", createUserPreference);
router.put("/preferences/users/:id", updateUserPreference);
router.get("/preferences/groups/:id", getGroupsByPreferenceById);
router.post("/preferences/groups/:id", createGroupPreference);
router.put("/preferences/groups/:id", updateGroupPreference);

export default router;