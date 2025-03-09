import { Router } from "express";
import { getAllHousing, getGroupsByHousingById, getUsersByHousingById, createGroupHousingPreference } from "../controllers/housingController";
const router = Router();

router.get("/housing", getAllHousing);
router.get("/housing/users/:id", getUsersByHousingById);
router.get("/housing/groups/:id", getGroupsByHousingById);
router.post("/housing/create/:id", createGroupHousingPreference);

export default router;