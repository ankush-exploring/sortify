import express from "express";
import {
  getUsers,
  login,
  signup,
  updateUser,
  logout,
  sendVerificationCode,
  testMail,
} from "../controllers/user.js";

import { authenticate } from "../middlewares/auth.js";
const router = express.Router();

router.post("/update-user", authenticate, updateUser);
router.get("/users", authenticate, getUsers);

router.post("/send-code", sendVerificationCode);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/test-mail", testMail);

export default router;
