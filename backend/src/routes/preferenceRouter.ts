import { Router } from "express";
import { createGroupPreference, createUserPreference, deleteGroupPreference, deleteUserPreference, getAllPreferences, getGroupsByPreferenceById, getUsersByPreferenceById, updateGroupPreference, updateUserPreference } from "../controllers/preferenceController";
const router = Router();

router.get("/preferences", getAllPreferences);

router.get("/preferences/users/:id", getUsersByPreferenceById);
router.post("/preferences/users/:id", createUserPreference);
router.put("/preferences/users/:id", updateUserPreference);
router.delete("/preferences/users/:id", deleteUserPreference);

router.get("/preferences/groups/:id", getGroupsByPreferenceById);
router.post("/preferences/groups/:id", createGroupPreference);
router.put("/preferences/groups/:id", updateGroupPreference);
router.delete("/preferences/groups/:id", deleteGroupPreference);

export default router;