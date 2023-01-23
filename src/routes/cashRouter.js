import { Router } from "express";
import { logoff } from "../controllers/authController.js";
import { addCost, addProfit, cashflowList } from "../controllers/cashflowController.js";
import { validateSchema } from "../middleware/validateUser.js";
import { cashSchema } from "../schemas/cashSchema.js";

const cashRouter = Router()

cashRouter.get("/home", cashflowList)
cashRouter.delete("/home", logoff)

cashRouter.post("/nova-entrada", validateSchema(cashSchema), addProfit)
cashRouter.post("/nova-saida", validateSchema(cashSchema), addCost)

export default cashRouter
