import express from "express";
import { checkAuth } from "../middlewares/auth.js";
import fileUpload from "express-fileupload";
import { createReplay, deleteReplay, getReplay, getReplaysByMasterclass, getUserReplays, togglePublishReplay, updateReplay } from "../controllers/replay.js";

const router = express.Router();

router.get("/masterclass/:slug", getReplaysByMasterclass);

router.post("/create", fileUpload(), createReplay);

router.get("/:id", getReplay);

router.get("/user/my-replays", checkAuth, getUserReplays);

router.put("/:id/publish", togglePublishReplay);

router.put("/update/:id", fileUpload(), updateReplay);

router.delete("/delete/:id", deleteReplay);

export default router;
