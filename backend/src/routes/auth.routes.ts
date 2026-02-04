import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import { validateBody } from "../middleware/validation.middleware";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/login", validateBody(loginSchema), login);
router.post("/register", validateBody(registerSchema), register);

export default router;
