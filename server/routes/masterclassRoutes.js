import express from "express";
import { createMasterclass, deleteMasterclass, getMasterclassById, getMasterclassBySlug, getMasterclasses, updateMasterclass } from "../controllers/Masterclass.js";
import fileUpload from "express-fileupload";

const router = express.Router();

router.get("/", getMasterclasses);

router.post("/create", fileUpload(), createMasterclass);

router.get("/:id", getMasterclassById);

router.put("/update/:id", fileUpload(), updateMasterclass);

router.get("/slug/:slug", getMasterclassBySlug);

router.delete("/delete/:id", deleteMasterclass);

export default router;
