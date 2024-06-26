import { Router } from "express";
import {
  AccountTypeBarChartData,
  downloadFile,
  getAccountTotal,
  getAccountTypeTotalPerMonth,
  getBalanceSheetByMonth,
  getBarChartCashFlowData,
  getIncomeStatementByMonth,
  syncEmployeesByAPI,
  syncEmployeesByFile,
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

//sync employees
othersRouter.post("/syncEmployeesByAPI", syncEmployeesByAPI);

//sync employees
othersRouter.post("/syncEmployeesByFile", syncEmployeesByFile);

//download file
othersRouter.get("/download", downloadFile);

export default othersRouter;
