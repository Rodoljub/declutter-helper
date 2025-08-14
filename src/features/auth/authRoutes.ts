import { Router } from "express";
import { body } from "express-validator";
import { signup, login } from "./authController";
import type { RequestHandler } from "express";

const router = Router();

const signupValidation: RequestHandler[] = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
];

const loginValidation: RequestHandler[] = [
  body("email").isEmail(),
  body("password").exists(),
];

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);

export default router;
