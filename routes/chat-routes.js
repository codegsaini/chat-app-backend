import { Router } from "express";
import { getMessages } from "../controller/GetMessages.js";

const router = Router();
router.post("/api/v1/chat/list", getMessages);

export default router;