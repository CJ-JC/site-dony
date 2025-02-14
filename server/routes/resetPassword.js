import { Router } from "express";
import { forgotPassWord, resetPassword } from "../controllers/resetPassword.js";

const router = Router();

router.post("/forgot-password", forgotPassWord);

router.post("/change-password", resetPassword);

router.get("/reset-password/:token", resetPassword);

export default router;
