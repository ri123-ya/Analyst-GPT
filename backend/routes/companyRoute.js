import express from "express";
import { handleCompanyList, getCompanyChatSummary} from "../controllers/companyController.js";
import { verifyToken } from "../middleware/verifyToken.js";


const router = express.Router();

router.get("/list", verifyToken, handleCompanyList);
router.get("/chat/:company/history",verifyToken, getCompanyChatSummary)

export default router;