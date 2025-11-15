import express from "express";
import { fileUpload } from "../controllers/uploadController.js";
import multer from "multer";

const router = express.Router();

const upload = multer();

router.post("/file", upload.single("file"), fileUpload);

export default router;