import db from "../index";
import crypto from "crypto";
import payrolls from "../schema/payrolls.schema";
import { eq } from "drizzle-orm";
import { addAccount, editAccount } from "./accounts.service";
import accountTypes from "../schema/accountType.schema";
import { addTransaction, editTransaction } from "./transactions.service";
import tranTypes from "../schema/transactionTypes.schema";

export const getAllPayrolls = async () => {
  const payrolls = await db.query.payrolls.findMany({
    with: {
      employee: true,
      account: true,
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
  });

  await db.insert(payrolls).values({
    ...input,
    prId: newPayrollId,
    prFinalAmount: finalAmount,
    prTranId: newTransaction!.tranId,
  });

  const newPayroll = await db.query.payrolls.findFirst({
    where: (payroll) => eq(payroll.prId, newPayrollId),
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
  });

  const updatedPr = await db.query.payrolls.findFirst({
    where: (pr) => eq(pr.prId, input.prId),
    // with: {
    //   employee: true,
    //   account: true,
    // },
  });

  return updatedPr;
};
