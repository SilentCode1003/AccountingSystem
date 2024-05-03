import db from "../index";
import cheques from "../schema/cheques.schema";
import { eq, sql } from "drizzle-orm";
import { addAccount } from "./accounts.service";
import accounts from "../schema/accounts.schema";

const CHEQUE_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

type ObjectTypes<T> = T[keyof T];

type ChequeStatus = ObjectTypes<typeof CHEQUE_STATUS>;

export const getAllCheques = async () => {
  const cheques = await db.query.cheques.findMany({
    with: { account: { with: { accountType: true } } },
  });

  return cheques;
};

export const getChequeById = async (chqId: string) => {
  const cheque = await db.query.cheques.findFirst({
    where: (cheque) => eq(cheque.chqId, chqId),
    with: { account: { with: { accountType: true } } },
  });

  return cheque;
};

export const addCheque = async (input: {
  chqPayeeName: string;
  chqAmount: number;
  chqIssueDate: Date;
  chqStatus: ChequeStatus;
  chqAccTypeId: string;
  chqNumber: string;
}) => {
  const account = await addAccount({
    accName: "CASH",
    accAmount: input.chqAmount,
    accDescription: "CHEQUE",
    accTypeId: input.chqAccTypeId,
  });

  const newChqId = `chqId ${crypto.randomUUID()}`;

  await db
    .insert(cheques)
    .values({ ...input, chqAccId: account!.accId, chqId: newChqId });

  const newCheque = await db.query.cheques.findFirst({
    where: (cheque) => eq(cheque.chqId, newChqId),
    with: { account: { with: { accountType: true } } },
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
    chqAccTypeId?: string;
    chqNumber?: string;
  };
  chqAccId: string;
}) => {
  if (input.newData.chqAccTypeId) {
    await db
      .update(accounts)
      .set({ accTypeId: input.newData.chqAccTypeId })
      .where(eq(accounts.accId, input.chqAccId));
  }

  await db
    .update(cheques)
    .set({
      chqAmount: input.newData.chqAmount,
      chqIssueDate: input.newData.chqIssueDate,
      chqPayeeName: input.newData.chqPayeeName,
      chqStatus: input.newData.chqStatus,
      chqNumber: input.newData.chqNumber,
      chqUpdatedAt: new Date(),
      chqApprovalCount:
        input.newData.chqStatus === "PENDING"
          ? 0
          : input.newData.chqStatus === "APPROVED"
          ? 3
          : undefined,
    })
    .where(eq(cheques.chqId, input.chqId));

  const updatedChq = await db.query.cheques.findFirst({
    where: (chq) => eq(chq.chqId, input.chqId),
    with: { account: { with: { accountType: true } } },
  });

  return updatedChq;
};

export const setChequeStatus = async (chqId: string, status: ChequeStatus) => {
  await db
    .update(cheques)
    .set({ chqStatus: status })
    .where(eq(cheques.chqId, chqId));

  const updatedCheque = await db.query.cheques.findFirst({
    where: (cheque) => eq(cheque.chqId, chqId),
    with: { account: { with: { accountType: true } } },
  });
  return updatedCheque;
};

export const incrementChequeApproval = async (chqId: string) => {
  await db
    .update(cheques)
    .set({ chqApprovalCount: sql`${cheques.chqApprovalCount} + 1` })
    .where(eq(cheques.chqId, chqId));

  const updatedCheque = await db.query.cheques.findFirst({
    where: (cheque) => eq(cheque.chqId, chqId),
    with: { account: { with: { accountType: true } } },
  });

  return updatedCheque;
};
