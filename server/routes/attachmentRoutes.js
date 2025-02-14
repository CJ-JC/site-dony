import express from "express";
import { deleteAttachment } from "../controllers/attachment.js";

const router = express.Router();

router.delete("/delete/:id", deleteAttachment);

export default router;
