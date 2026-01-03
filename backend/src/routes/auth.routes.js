import express from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { updateCompanyProfile } from "../controllers/company.controller.js";
import { getUserQuotes } from "../controllers/history.controller.js";
import multer from "multer";

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.get("/history", authenticate, getUserQuotes);
router.post("/companyProfile", authenticate, upload.single('logo'), updateCompanyProfile);

export default router;