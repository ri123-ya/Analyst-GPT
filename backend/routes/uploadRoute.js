import express from "express";
import { fileUpload, getUserFiles } from "../controllers/uploadController.js";
import { verifyToken, verifyChild } from "../middleware/verifyToken.js";

import multer from "multer";

const router = express.Router();

const upload = multer();

router.post("/file", verifyToken, verifyChild, upload.single("file"), fileUpload);
router.get("/my-files", verifyToken, verifyChild, getUserFiles);


export default router;