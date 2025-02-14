import express from "express";
import { createMasterclass, deleteMasterclass, getMasterclassById, getMasterclassBySlug, getMasterclasses, updateMasterclass } from "../controllers/Masterclass.js";
import upload from "../middlewares/multer-config.js";

const router = express.Router();

router.get("/", getMasterclasses);

router.post("/create", upload.single("image"), createMasterclass);

router.get("/:id", getMasterclassById);

router.put("/update/:id", upload.single("image"), updateMasterclass);

router.get("/slug/:slug", getMasterclassBySlug);

router.delete("/delete/:id", deleteMasterclass);

export default router;
