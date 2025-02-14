import { Router } from "express";
import { createNote, getNotes, updateNote, deleteNote } from "../controllers/note.js";
import { checkAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/create", checkAuth, createNote);

router.get("/notes", checkAuth, getNotes);

router.put("/:id", checkAuth, updateNote);

router.delete("/delete/:noteId", deleteNote);

export default router;
