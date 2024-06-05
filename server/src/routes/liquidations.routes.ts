import { Router } from "express";
import {
  getEmployeeLiquidations,
  getLiquidations,
} from "../controller/liquidations.controller";

const liquidationRouter = Router();

//get all liquidations
liquidationRouter.get("/", getLiquidations);

//get all liquidations for an employee
liquidationRouter.get("/employeeLiquidations", getEmployeeLiquidations);

export default liquidationRouter;
