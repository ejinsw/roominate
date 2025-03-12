// association goes from user to group.
import { Router } from "express";
import { getRequests } from "../controllers/requestController";
const router = Router();

router.get("/requests/:id", getRequests);

export default router;
