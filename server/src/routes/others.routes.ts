import { Router } from "express";
import {
  getAccountTotal,
  getAccountTypeTotalPerMonth,
  getBalanceSheetByMonth,
  getIncomeStatementByMonth,
} from "../controller/others.controllers";

const othersRouter = Router();

//get total sum of an account type
othersRouter.post("/accountTotal", getAccountTotal);

//get income statement data per month
othersRouter.get("/incomeStatement", getIncomeStatementByMonth);

//get balance sheet data per month
othersRouter.get("/balanceSheet", getBalanceSheetByMonth);

//get account type total per month
othersRouter.get("/accountTypeTotal", getAccountTypeTotalPerMonth);

export default othersRouter;
