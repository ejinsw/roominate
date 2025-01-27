import { Router } from "express";
import { getHello } from "../controllers/helloController";
const router = Router();

router.get("/hello", getHello);

export default router;
