import { Router } from "express";
import {
  AccountTypeBarChartData,
  getAccountTotal,
  getAccountTypeTotalPerMonth,
  getBalanceSheetByMonth,
  getBarChartCashFlowData,
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

//get BarChartData of Account Type
othersRouter.get("/AccountTypeBarChartData", AccountTypeBarChartData);

//get Cash Flow barchart data
othersRouter.get("/cashFlowBarChart", getBarChartCashFlowData);

export default othersRouter;
