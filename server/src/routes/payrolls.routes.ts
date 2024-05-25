import { Router } from "express";
import {
  createPayroll,
  createPayrollByFile,
  getPayrolls,
  updatePayroll,
} from "../controller/payrolls.controller";

const payrollRouter = Router();

//get all payroll
payrollRouter.get("/", getPayrolls);

//create an payroll entry
payrollRouter.post("/", createPayroll);

//create a payroll entry with excel file
payrollRouter.post("/file", createPayrollByFile);

//update an payroll
payrollRouter.put("/", updatePayroll);

export default payrollRouter;
