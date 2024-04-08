import db from "../index";
import crypto from "crypto";
import payrolls from "../schema/payrolls.schema";
import { eq } from "drizzle-orm";

export const getAllPayrolls = async () => {
  const payrolls = await db.query.payrolls.findMany({
    with: {
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
}) => {
  const newPayrollId = `prId ${crypto.randomUUID()}`;

  const employee = await db.query.employees.findFirst({
    where: (employee) => eq(employee.empId, input.prEmployeeId),
  });

  await db.insert(payrolls).values({
    ...input,
    prId: newPayrollId,
    prFinalAmount:
      (employee!.empSalary as number) - input.prTotalDeduction < 0
        ? 0
        : (employee!.empSalary as number) - input.prTotalDeduction,
  });

  const newPayroll = await db.query.payrolls.findFirst({
    where: (payroll) => eq(payroll.prId, newPayrollId),
  });

  return newPayroll;
};

export const editPayroll = async (input: {
  prId: string;
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

  await db
    .update(payrolls)
    .set({
      ...input.newData,
      prFinalAmount:
        input.newData.prTotalDeduction &&
        ((employee!.empSalary as number) - input.newData.prTotalDeduction < 0
          ? 0
          : (employee!.empSalary as number) - input.newData.prTotalDeduction),
    })
    .where(eq(payrolls.prId, input.prId));

  const updatedPr = await db.query.payrolls.findFirst({
    where: (pr) => eq(pr.prId, input.prId),
    with: {
      employee: true,
    },
  });

  return updatedPr;
};
