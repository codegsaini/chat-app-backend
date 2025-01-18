import { Router } from "express";
import { createUser } from "../controller/CreateUser.js";

const router = Router();
router.post("/api/v1/user/create", createUser);
export default router;