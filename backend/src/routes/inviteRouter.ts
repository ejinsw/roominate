// association goes from group to user. 
// endpoints send invite, accept invite, reject invite
import { Router } from "express";
import { acceptInvite, rejectInvite, sendInvite } from "../controllers/inviteController";
const router = Router();

router.post("/invites/send", sendInvite);
router.put("/invites/:id/reject", rejectInvite);
router.put("/invites/:id/accept", acceptInvite);

export default router;