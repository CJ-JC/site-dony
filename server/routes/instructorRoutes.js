import express from "express";
import upload from "../middlewares/multer-config.js";
import { createInstructor, deleteInstructor, getInstructorById, getInstructors, updateInstructor } from "../controllers/Instructor.js";

const router = express.Router();

router.get("/", getInstructors);

router.post("/create", upload.single("images"), createInstructor);

router.get("/:id", getInstructorById);

router.put("/update/:id", upload.single("images"), updateInstructor);

router.delete("/delete/:id", deleteInstructor);

export default router;
