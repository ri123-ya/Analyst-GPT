import express from "express";
import { userQuery} from "../controllers/chatController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/query",verifyToken,userQuery)

export default router;