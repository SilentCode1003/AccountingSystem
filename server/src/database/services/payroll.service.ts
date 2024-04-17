import db from "../index";
import crypto from "crypto";
import payrolls from "../schema/payrolls.schema";
import { eq } from "drizzle-orm";
import { addAccount, editAccount } from "./accounts.service";
import accountTypes from "../schema/accountType.schema";

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

  const newAccount = await addAccount({
    accName: "PAYROLL ACCOUNT",
    accAmount: finalAmount,
    accDescription: "PAYROLL",
    accTypeId: accountType!.accTypeId,
  });

  await db.insert(payrolls).values({
    ...input,
    prId: newPayrollId,
    prFinalAmount: finalAmount,
    prAccId: newAccount!.accId,
  });

  const newPayroll = await db.query.payrolls.findFirst({
    where: (payroll) => eq(payroll.prId, newPayrollId),
  });

  return newPayroll;
};

export const editPayroll = async (input: {
  prId: string;
  prAccId: string;
  newData: {
    prEmployeeId?: string;
    prTotalDeduction?: number;
    prDateFrom?: Date;
    prDateTo?: Date;
  };
}) => {
  const employee = await db.query.employees.findFirst({
    where: (employee) =>
      eq(employee.empId, input.newData.prEmployeeId as string),
  });

  const finalAmount =
    input.newData.prTotalDeduction &&
    ((employee!.empSalary as number) - input.newData.prTotalDeduction < 0
      ? 0
      : (employee!.empSalary as number) - input.newData.prTotalDeduction);

  await db
    .update(payrolls)
    .set({
      ...input.newData,
      prFinalAmount: finalAmount,
    })
    .where(eq(payrolls.prId, input.prId));

  await editAccount({
    accId: input.prAccId,
    newData: {
      accAmount: finalAmount,
    },
  });

  const updatedPr = await db.query.payrolls.findFirst({
    where: (pr) => eq(pr.prId, input.prId),
    with: {
      employee: true,
      account: true,
    },
  });

  return updatedPr;
};
