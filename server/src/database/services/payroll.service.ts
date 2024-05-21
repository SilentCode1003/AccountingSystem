import crypto from "crypto";
import { eq } from "drizzle-orm";
import db from "../index";
import accountTypes from "../schema/accountType.schema";
import payrolls from "../schema/payrolls.schema";
import tranTypes from "../schema/transactionTypes.schema";
import { addTransaction, editTransaction } from "./transactions.service";

export const getAllPayrolls = async () => {
  const payrolls = await db.query.payrolls.findMany({
    with: {
      transaction: true,
      employee: true,
    },
  });

  return payrolls;
};

export const addPayroll = async (input: {
  prEmployeeId: string;
  prTotalDeduction: number;
  prDateFrom: Date;
  prDateTo: Date;
  prTranFileMimeType: string;
  prMopId: string;
}) => {
  const newPayrollId = `prId ${crypto.randomUUID()}`;

  const employee = await db.query.employees.findFirst({
    where: (employee) => eq(employee.empId, input.prEmployeeId),
  });

  const finalAmount =
    (employee!.empSalary as number) - input.prTotalDeduction < 0
      ? 0
      : (employee!.empSalary as number) - input.prTotalDeduction;

  const accountType = await db.query.accountTypes.findFirst({
    where: eq(accountTypes.accTypeName, "EXPENSE"),
  });

  const transactionType = await db.query.tranTypes.findFirst({
    where: eq(tranTypes.tranTypeName, "PAYROLL"),
  });

  const newTransaction = await addTransaction({
    tranAccTypeId: accountType!.accTypeId,
    tranAmount: finalAmount,
    tranDescription: "PAYROLL",
    tranPartner: employee!.empId,
    tranTransactionDate: input.prDateTo,
    tranTypeId: transactionType!.tranTypeId,
    tranFileMimeType: input.prTranFileMimeType,
    tranAccName: "PAYROLL",
    tranMopId: input.prMopId,
  });

  await db.insert(payrolls).values({
    ...input,
    prId: newPayrollId,
    prFinalAmount: finalAmount,
    prTranId: newTransaction!.tranId,
  });

  const newPayroll = await db.query.payrolls.findFirst({
    where: (payroll) => eq(payroll.prId, newPayrollId),
    with: {
      transaction: true,
      employee: true,
    },
  });

  return newPayroll;
};

export const editPayroll = async (input: {
  prId: string;
  prTranId: string;
  prEmployeeId?: string;
  prTotalDeduction?: number;
  prDateFrom?: Date;
  prDateTo?: Date;
  prTranFileMimeType?: string;
  prMopId?: string;
}) => {
  const employee = await db.query.employees.findFirst({
    where: (employee) => eq(employee.empId, input.prEmployeeId as string),
  });

  const finalAmount =
    input.prTotalDeduction &&
    ((employee!.empSalary as number) - input.prTotalDeduction < 0
      ? 0
      : (employee!.empSalary as number) - input.prTotalDeduction);

  await db
    .update(payrolls)
    .set({
      ...input,
      prFinalAmount: finalAmount,
    })
    .where(eq(payrolls.prId, input.prId));

  await editTransaction({
    tranId: input.prTranId,
    tranAmount: finalAmount,
    tranFileMimeType: input.prTranFileMimeType,
    tranPartner: input.prEmployeeId,
    tranMopId: input.prMopId,
  });

  const updatedPr = await db.query.payrolls.findFirst({
    where: (pr) => eq(pr.prId, input.prId),
    with: {
      employee: true,
      transaction: true,
    },
  });

  return updatedPr;
};
