import express from "express";
import { testQR } from "../controllers/public.controller.js";
import multer from "multer";
import {
  addBirthday,
  getBirthday,
} from "../controllers/pages.birthday.controller.js";
import {
  getGitHubStreak,
  getLeetCodeStreak,
} from "../controllers/social.controller.js";

const router = express.Router();
const upload = multer();

router.get("/qr/test", testQR);
router.post("/birthday", upload.array("images", 5), addBirthday);
router.get("/birthday/:id", getBirthday);

//GitHub
router.get("/github/streak/:username", getGitHubStreak);
router.get("/leetcode/streak/:username", getLeetCodeStreak);
export default router;
