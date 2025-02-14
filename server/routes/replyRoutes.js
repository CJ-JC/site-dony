import { Router } from "express";
import { createReply, deleteReply, getRepliesByVideoId, updateReply } from "../controllers/reply.js";
import { checkAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/create/:remarkId", checkAuth, createReply);

router.put("/:id", checkAuth, updateReply);

router.get("/video/:videoId", getRepliesByVideoId);

router.delete("/delete/:id", deleteReply);

export default router;
