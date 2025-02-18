import express from "express";
import { createInstructor, deleteInstructor, getInstructorById, getInstructors, updateInstructor } from "../controllers/Instructor.js";
import fileUpload from "express-fileupload";

const router = express.Router();

router.get("/", getInstructors);

router.post("/create", fileUpload(), createInstructor);

router.get("/:id", getInstructorById);

router.put("/update/:id", fileUpload(), updateInstructor);

router.delete("/delete/:id", deleteInstructor);

export default router;
