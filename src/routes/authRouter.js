import { Router } from "express";
import { signIn, signUp } from "../controllers/authController.js";
import { validateSchema } from "../middleware/validateUser.js";
import { loginSchema, userSchema } from "../schemas/authSchema.js";

const authRouter = Router()

authRouter.post("/cadastro", validateSchema(userSchema), signUp)
authRouter.post("/", validateSchema(loginSchema), signIn)

export default authRouter