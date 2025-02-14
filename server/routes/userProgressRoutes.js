import express from "express";
import { updateUserProgress, upsertUserProgress, getVideoProgress, getUserCourseProgress, deleteCourseProgress } from "../controllers/userProgress.js";
import { checkAuth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/:courseId", checkAuth, getUserCourseProgress);

router.post("/create", checkAuth, upsertUserProgress);

router.post("/edit/:chapterId", checkAuth, updateUserProgress);

router.get("/video/:videoId", checkAuth, getVideoProgress);

router.delete("/course/:courseId", checkAuth, deleteCourseProgress);

export default router;
