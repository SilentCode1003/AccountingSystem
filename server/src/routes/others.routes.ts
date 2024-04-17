import { Router } from "express";
import {
  getAccountTotal,
  getIncomeStatementByMonth,
} from "../controller/others.controllers";

const othersRouter = Router();

//get total sum of an account type
othersRouter.post("/accountTotal", getAccountTotal);

//get income statement data per month
othersRouter.get("/incomeStatement", getIncomeStatementByMonth);

export default othersRouter;
