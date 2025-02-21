import { Router } from "express";
import { getAllHousing, getGroupsByHousingById, getUsersByHousingById } from "../controllers/housingController";
const router = Router();

router.get("/preferences", getAllHousing);
router.get("/preferences/users/:id", getUsersByHousingById);
router.get("/preferences/groups/:id", getGroupsByHousingById);

export default router;