import crypto from "crypto";
import { eq } from "drizzle-orm";
import payrolls from "../schema/payrolls.schema";
import tranTypes from "../schema/transactionTypes.schema";
import { addTransaction, editTransaction } from "./transactions.service";
import { DB } from "..";

export const getAllPayrolls = async (db: DB) => {
  const payrolls = await db.query.payrolls.findMany({
    with: {
      transaction: true,
      employee: true,
    },
  });

  return payrolls;
};

export const addPayroll = async (
  db: DB,
  input: {
    prEmployeeId: string;
    prTotalDeduction: number;
    prDateFrom: Date;
    prDateTo: Date;
    prTranFileMimeType: string;
    prMopId: string;
    prFileName?: string;
  }
) => {
  const newPayrollId = `prId ${crypto.randomUUID()}`;

  const employee = await db.query.employees.findFirst({
    where: (employee) => eq(employee.empId, input.prEmployeeId),
  });

  const finalAmount =
    (employee!.empSalary as number) - input.prTotalDeduction < 0
      ? 0
      : (employee!.empSalary as number) - input.prTotalDeduction;

  const transactionType = await db.query.tranTypes.findFirst({
    where: eq(tranTypes.tranTypeName, "PAYROLL"),
  });

  let newPayroll: typeof payrolls.$inferSelect | undefined;
  await db.transaction(async (tx) => {
    const newTransaction = await addTransaction(tx, {
      tranAmount: finalAmount,
      tranDescription: "PAYROLL",
      tranPartner: employee!.empId,
      tranTransactionDate: input.prDateTo,
      tranTypeId: transactionType!.tranTypeId,
      tranFileMimeType: input.prTranFileMimeType,
      tranAccName: "PAYROLL",
      tranMopId: input.prMopId,
      tranFileName: input.prFileName,
    });

    await tx.insert(payrolls).values({
      ...input,
      prId: newPayrollId,
      prFinalAmount: finalAmount,
      prTranId: newTransaction!.tranId,
    });

    newPayroll = await tx.query.payrolls.findFirst({
      where: (payroll) => eq(payroll.prId, newPayrollId),
      with: {
        transaction: true,
        employee: true,
      },
    });
  });
  return newPayroll;
};

export const editPayroll = async (
  db: DB,
  input: {
    prId: string;
    prTranId: string;
    prEmployeeId?: string;
    prTotalDeduction?: number;
    prDateFrom?: Date;
    prDateTo?: Date;
    prTranFileMimeType?: string;
    prMopId?: string;
  }
) => {
  const employee = await db.query.employees.findFirst({
    where: (employee) => eq(employee.empId, input.prEmployeeId as string),
  });

  const finalAmount =
    input.prTotalDeduction &&
    ((employee!.empSalary as number) - input.prTotalDeduction < 0
      ? 0
      : (employee!.empSalary as number) - input.prTotalDeduction);

  let updatedPr: typeof payrolls.$inferSelect | undefined;
  await db.transaction(async (tx) => {
    await tx
      .update(payrolls)
      .set({
        ...input,
        prFinalAmount: finalAmount,
      })
      .where(eq(payrolls.prId, input.prId));

    await editTransaction(tx, {
      tranId: input.prTranId,
      tranAmount: finalAmount,
      tranFileMimeType: input.prTranFileMimeType,
      tranPartner: input.prEmployeeId,
      tranMopId: input.prMopId,
    });

    updatedPr = await tx.query.payrolls.findFirst({
      where: (pr) => eq(pr.prId, input.prId),
      with: {
        employee: true,
        transaction: true,
      },
    });
  });

  return updatedPr;
};
