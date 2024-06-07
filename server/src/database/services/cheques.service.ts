import { eq, sql } from "drizzle-orm";
import crypto from "crypto";
import cheques from "../schema/cheques.schema";
import tranTypes from "../schema/transactionTypes.schema";
import { addTransaction, editTransaction } from "./transactions.service";
import { DB } from "..";

const CHEQUE_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

type ObjectTypes<T> = T[keyof T];

type ChequeStatus = ObjectTypes<typeof CHEQUE_STATUS>;

export const getAllCheques = async (db: DB) => {
  const cheques = await db.query.cheques.findMany({
    with: {
      transaction: {
        with: {
          account: { with: { accountType: true } },
        },
      },
    },
  });

  return cheques;
};

export const getChequeById = async (db: DB, chqId: string) => {
  const cheque = await db.query.cheques.findFirst({
    where: (cheque) => eq(cheque.chqId, chqId),
    with: { transaction: true },
  });

  return cheque;
};

export const addCheque = async (
  db: DB,
  input: {
    chqPayeeName: string;
    chqAmount: number;
    chqIssueDate: Date;
    chqStatus: ChequeStatus;
    chqAccTypeId: string;
    chqNumber: string;
    chqTranFileMimeType?: string;
    chqMopId: string;
    chqFileName?: string;
  }
) => {
  const tranType = await db.query.tranTypes.findFirst({
    where: eq(tranTypes.tranTypeName, "CHEQUE"),
  });

  const checkIfChqExists = await db.query.cheques.findFirst({
    where: (cheque) => eq(cheque.chqNumber, input.chqNumber),
  });

  if (checkIfChqExists) {
    throw new Error("Cheque number already exists");
  }

  const transaction = await addTransaction(db, {
    tranAccTypeId: input.chqAccTypeId,
    tranTypeId: tranType!.tranTypeId,
    tranAmount: input.chqAmount,
    tranDescription: "CHEQUE",
    tranOtherPartner: input.chqPayeeName,
    tranTransactionDate: input.chqIssueDate,
    tranFileMimeType: input.chqTranFileMimeType,
    tranAccName: "CHEQUE",
    tranFileName: input.chqFileName ?? undefined,
    tranMopId: input.chqMopId,
  });

  const newChqId = `chqId ${crypto.randomUUID()}`;

  await db.insert(cheques).values({
    ...input,
    chqTranId: transaction!.tranId,
    chqId: newChqId,
    chqApprovalCount: input.chqStatus === "APPROVED" ? 3 : 0,
  });

  const newCheque = await db.query.cheques.findFirst({
    where: (cheque) => eq(cheque.chqId, newChqId),
    with: {
      transaction: {
        with: {
          account: { with: { accountType: true } },
        },
      },
    },
  });

  return newCheque;
};

export const editCheque = async (
  db: DB,
  input: {
    chqId: string;
    chqPayeeName?: string;
    chqAmount?: number;
    chqIssueDate?: Date;
    chqStatus?: ChequeStatus;
    chqAccTypeId?: string;
    chqNumber?: string;
    chqTranId: string;
    chqTranFileMimeType?: string;
    chqMopId?: string;
  }
) => {
  let updatedChq: typeof cheques.$inferSelect | undefined;
  await db.transaction(async (tx) => {
    await tx
      .update(cheques)
      .set({
        chqAmount: input.chqAmount,
        chqIssueDate: input.chqIssueDate,
        chqPayeeName: input.chqPayeeName,
        chqStatus: input.chqStatus,
        chqNumber: input.chqNumber,
        chqUpdatedAt: new Date(),
        chqApprovalCount:
          input.chqStatus === "PENDING"
            ? 0
            : input.chqStatus === "APPROVED"
            ? 3
            : undefined,
      })
      .where(eq(cheques.chqId, input.chqId)),
      await editTransaction(tx, {
        tranId: input.chqTranId,
        tranAccTypeId: input.chqAccTypeId,
        tranAmount: input.chqAmount,
        tranOtherPartner: input.chqPayeeName,
        tranTransactionDate: input.chqIssueDate,
        tranFileMimeType: input.chqTranFileMimeType,
        tranMopId: input.chqMopId,
      });

    updatedChq = await tx.query.cheques.findFirst({
      where: (chq) => eq(chq.chqId, input.chqId),
      with: {
        transaction: {
          with: {
            account: { with: { accountType: true } },
          },
        },
      },
    });
  });

  return updatedChq;
};

export const setChequeStatus = async (
  db: DB,
  chqId: string,
  status: ChequeStatus
) => {
  await db
    .update(cheques)
    .set({ chqStatus: status })
    .where(eq(cheques.chqId, chqId));

  const updatedCheque = await db.query.cheques.findFirst({
    where: (cheque) => eq(cheque.chqId, chqId),
    with: { transaction: true },
  });
  return updatedCheque;
};

export const incrementChequeApproval = async (db: DB, chqId: string) => {
  await db
    .update(cheques)
    .set({ chqApprovalCount: sql`${cheques.chqApprovalCount} + 1` })
    .where(eq(cheques.chqId, chqId));

  const updatedCheque = await db.query.cheques.findFirst({
    where: (cheque) => eq(cheque.chqId, chqId),
    with: { transaction: true },
  });

  return updatedCheque;
};
