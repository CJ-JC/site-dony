import { Router } from "express";
import { createRemark, deleteRemark, getRemarksByVideoId, updateRemark } from "../controllers/remark.js";
import { checkAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/create", checkAuth, createRemark);

router.put("/:id", checkAuth, updateRemark);

router.get("/video/:videoId", getRemarksByVideoId);

router.delete("/delete/:id", deleteRemark);

export default router;
