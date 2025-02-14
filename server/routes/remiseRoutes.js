import express from "express";
import { applyRemise, createRemise, deleteRemise, getRemises, getRemisesForCourse } from "../controllers/Remise.js";

const router = express.Router();

router.get("/", getRemises);

router.post("/apply-remise", applyRemise);

router.post("/create", createRemise);

router.get("/course/slug/:courseId", getRemisesForCourse);

router.delete("/delete/:id", deleteRemise);

export default router;
