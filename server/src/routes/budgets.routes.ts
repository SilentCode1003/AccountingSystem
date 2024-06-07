import { Router } from "express";
import {
  getBudgets,
  getEmployeeBudgets,
} from "../controller/budgets.controllers";

const budgetRouter = Router();

//get all budgets
budgetRouter.get("/", getBudgets);

//get all budgets for an employee
budgetRouter.get("/employeeBudgets", getEmployeeBudgets);

export default budgetRouter;
