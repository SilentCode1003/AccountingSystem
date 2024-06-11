import { desc, eq } from "drizzle-orm";
import { DB } from "..";
import { runningBalance } from "../schema/runningBalance.schema";

export const getRunningBalanceForEmployee = async (db: DB, empId: string) => {
  const rb = await db.query.runningBalance.findMany({
    where: eq(runningBalance.rbEmpId, empId),
    with: {
      employee: true,
      liquidation: true,
    },
  });
  return rb;
};

export const getLastRunningBalanceForEmployee = async (
  db: DB,
  empId: string
) => {
  const rb = await db.query.runningBalance.findFirst({
    where: eq(runningBalance.rbEmpId, empId),
    orderBy: desc(runningBalance.rbDate),
    with: {
      employee: true,
      liquidation: true,
    },
  });

  return rb;
};

export const getRunningBalanceById = async (db: DB, id: string) => {
  const rb = await db.query.runningBalance.findFirst({
    where: eq(runningBalance.rbId, id),
    with: {
      employee: true,
      liquidation: true,
    },
  });

  return rb;
};

export const addRunningBalance = async (
  db: DB,
  input: {
    rbEmpId: string;
    rbDate: Date;
    rbBudget: number;
    rbLiqId: string;
    rbReturnAmount: number;
    rbReimbursementAmount: number;
  }
) => {
  const newRunningBalanceId = `rbId ${crypto.randomUUID()}`;

  await db.insert(runningBalance).values({
    ...input,
    rbId: newRunningBalanceId,
  });

  const newRunningBalance = await getRunningBalanceById(
    db,
    newRunningBalanceId
  );
  return newRunningBalance;
};
