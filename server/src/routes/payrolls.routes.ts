import { Router } from "express";
import {
  createPayroll,
  getPayrolls,
  updatePayroll,
} from "../controller/payrolls.controller";

const payrollRouter = Router();

//get all payroll
payrollRouter.get("/", getPayrolls);

//create an payroll entry
payrollRouter.post("/", createPayroll);

//update an payroll
payrollRouter.put("/", updatePayroll);

export default payrollRouter;
