import { Router } from "express";
import { getTicketList } from "../controller/GetTicketList.js";

const router = Router();
router.post("/api/v1/ticket/list", getTicketList);

export default router;