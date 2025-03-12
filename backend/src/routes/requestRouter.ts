// association goes from group to user.
// endpoints send invite, accept invite, reject invite
import { Router } from "express";
import {
  acceptRequest,
  rejectRequest,
  sendRequest,
  getRequests,
} from "../controllers/requestController";
const router = Router();

router.post("/requests/send", sendRequest);
router.put("/requests/:id/reject", rejectRequest);
router.put("/requests/:id/accept", acceptRequest);
router.get("/requests/:id", getRequests);

export default router;
