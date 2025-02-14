import express from "express";
import { getChapters, getChapterById, createChapter, editChapter, deleteChapter } from "../controllers/chapter.js";
import upload from "../middlewares/multer-config.js";

export const router = express.Router();

router.get("/", getChapters);

router.post("/create", upload.array("attachments"), createChapter);

router.put("/edit/:id", upload.array("attachments"), editChapter);

router.get("/:id", getChapterById);

router.delete("/delete/:id", deleteChapter);

export default router;
