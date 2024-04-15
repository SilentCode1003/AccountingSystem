import db from "../index";
import cheques from "../schema/cheques.schema";
import { eq } from "drizzle-orm";
import { addAccount } from "./accounts.service";
import accounts from "../schema/accounts.schema";

const CHEQUE_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

const ACCOUNT_TYPE = {
  RECEIVABLE: "RECEIVABLE",
  PAYABLE: "PAYABLE",
  REVENUE: "REVENUE",
  EXPENSE: "EXPENSE",
} as const;

type ObjectTypes<T> = T[keyof T];

type AccountType = ObjectTypes<typeof ACCOUNT_TYPE>;

type ChequeStatus = ObjectTypes<typeof CHEQUE_STATUS>;

export const getAllCheques = async () => {
  const cheques = await db.query.cheques.findMany({ with: { account: true } });

  return cheques;
};

export const getChequeById = async (chqId: string) => {
  const cheque = await db.query.cheques.findFirst({
    where: (cheque) => eq(cheque.chqId, chqId),
  });

  return cheque;
};

export const addCheque = async (input: {
  chqPayeeName: string;
  chqAmount: number;
  chqIssueDate: Date;
  chqStatus: ChequeStatus;
  chqAccType: AccountType;
}) => {
  const account = await addAccount({
    accAmount: input.chqAmount,
    accDescription: "CHEQUE",
    accType: input.chqAccType,
  });

  const newChqId = `chqId ${crypto.randomUUID()}`;

  await db
    .insert(cheques)
    .values({ ...input, chqAccId: account!.accId, chqId: newChqId });

  const newCheque = await db.query.cheques.findFirst({
    where: (cheque) => eq(cheque.chqId, newChqId),
    with: { account: true },
  });

  return newCheque;
};

export const editCheque = async (input: {
  chqId: string;
  newData: {
    chqPayeeName?: string;
    chqAmount?: number;
    chqIssueDate?: Date;
    chqStatus?: ChequeStatus;
    chqAccType: AccountType;
  };
  chqAccId: string;
}) => {
  await db
    .update(accounts)
    .set({ accType: input.newData.chqAccType })
    .where(eq(accounts.accId, input.chqAccId));

  await db
    .update(cheques)
    .set({
      chqAmount: input.newData.chqAmount,
      chqIssueDate: input.newData.chqIssueDate,
      chqPayeeName: input.newData.chqPayeeName,
      chqStatus: input.newData.chqStatus,
      chqUpdatedAt: new Date(),
    })
    .where(eq(cheques.chqId, input.chqId));

  const updatedChq = await db.query.cheques.findFirst({
    where: (chq) => eq(chq.chqId, input.chqId),
    with: { account: true },
  });

  return updatedChq;
};
