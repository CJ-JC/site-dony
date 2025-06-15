import express from "express";
import { createMasterclass, deleteMasterclass, getMasterclassById, getMasterclassBySlug, getMasterclasses, getUserSubscribedMasterclasses, togglePublishMasterclass, updateMasterclass } from "../controllers/Masterclass.js";
import fileUpload from "express-fileupload";
import { checkAuth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getMasterclasses);

router.post("/create", fileUpload(), createMasterclass);

router.get("/my-courses", checkAuth, getUserSubscribedMasterclasses);

router.get("/:id", getMasterclassById);

router.put("/update/:id", fileUpload(), updateMasterclass);

router.put("/:id/publish", togglePublishMasterclass);

router.get("/slug/:slug", getMasterclassBySlug);

router.delete("/delete/:id", deleteMasterclass);

export default router;
