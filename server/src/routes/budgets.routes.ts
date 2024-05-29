import { Router } from "express";
import { getBudgets } from "../controller/budgets.controllers";

const budgetRouter = Router();

//get all budgets
budgetRouter.get("/", getBudgets);

export default budgetRouter;
