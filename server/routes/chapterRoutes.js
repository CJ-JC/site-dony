import express from "express";
import { getChapters, getChapterById, createChapter, editChapter, deleteChapter } from "../controllers/chapter.js";
import fileUpload from "express-fileupload";

export const router = express.Router();

router.get("/", getChapters);

router.post("/create", fileUpload(), createChapter);

router.put("/edit/:id", fileUpload(), editChapter);

router.get("/:id", getChapterById);

router.delete("/delete/:id", deleteChapter);

export default router;
