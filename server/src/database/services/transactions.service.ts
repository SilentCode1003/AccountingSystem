import crypto from "crypto";
import { desc, eq } from "drizzle-orm";
import db from "../index";
import transactions from "../schema/transactions.schema";
import { addAccount, editAccount } from "./accounts.service";

export const getAllTransactions = async () => {
  const allTransactions = await db.query.transactions.findMany({
    with: {
      transactionType: true,
      account: {
        with: {
          accountType: true,
        },
      },
      employee: true,
      customer: true,
      vendor: true,
    },
    orderBy: desc(transactions.tranTransactionDate),
  });

  return allTransactions;
};

export const addTransaction = async (input: {
  tranDescription: string;
  tranAmount: number;
  tranPartner?: string;
  tranTransactionDate: Date;
  tranAccTypeId: string;
  tranTypeId: string;
  tranFileMimeType?: string;
  tranOtherPartner?: string;
  tranAccName?: string;
}) => {
  const newTransactionId = `tranId ${crypto.randomUUID()}`;

  const newAccount = await addAccount({
    accName: input.tranAccName ?? `ACCOUNT TRANSACTION`,
    accAmount: input.tranAmount,
    accDescription: `TRANSACTION: ${input.tranDescription}`,
    accTypeId: input.tranAccTypeId,
  });

  await db.insert(transactions).values({
    tranId: newTransactionId,
    tranAccId: newAccount!.accId,
    tranAmount: input.tranAmount,
    tranDescription: input.tranDescription,
    tranTransactionDate: input.tranTransactionDate,
    tranEmpId:
      input.tranPartner && input.tranPartner.split(" ")[0] === "empId"
        ? input.tranPartner
        : null,
    tranCustId:
      input.tranPartner && input.tranPartner.split(" ")[0] === "custId"
        ? input.tranPartner
        : null,
    tranVdId:
      input.tranPartner && input.tranPartner.split(" ")[0] === "vdId"
        ? input.tranPartner
        : null,
    tranFile: `${newTransactionId}.${input.tranFileMimeType ?? "xlsx"}`,
    tranTypeId: input.tranTypeId,
    tranOtherPartner: input.tranOtherPartner ?? null,
  });

  const newTransaction = await db.query.transactions.findFirst({
    where: (transaction) => eq(transaction.tranId, newTransactionId),
    with: {
      transactionType: true,
      account: {
        with: {
          accountType: true,
        },
      },
      employee: true,
      customer: true,
      vendor: true,
    },
  });

  return newTransaction;
};

export const editTransaction = async (input: {
  tranId: string;
  tranAccId?: string;
  tranDescription?: string;
  tranAmount?: number;
  tranPartner?: string;
  tranAccTypeId?: string;
  tranTransactionDate?: Date;
  tranFileMimeType?: string;
  tranOtherPartner?: string;
  tranTypeId?: string;
  tranAccName?: string;
}) => {
  await db
    .update(transactions)
    .set({
      tranAccId: input.tranAccId,
      tranAmount: input.tranAmount,
      tranDescription: input.tranDescription,
      tranTransactionDate: input.tranTransactionDate,
      tranEmpId:
        input.tranPartner && input.tranPartner.split(" ")[0] === "empId"
          ? input.tranPartner
          : null,
      tranCustId:
        input.tranPartner && input.tranPartner.split(" ")[0] === "custId"
          ? input.tranPartner
          : null,
      tranVdId:
        input.tranPartner && input.tranPartner.split(" ")[0] === "vdId"
          ? input.tranPartner
          : null,
      tranFile: `${input.tranId}.${input.tranFileMimeType ?? "xlsx"}`,
      tranTypeId: input.tranTypeId,
      tranOtherPartner: input.tranOtherPartner,
    })
    .where(eq(transactions.tranId, input.tranId));

  const editedTran = await db.query.transactions.findFirst({
    where: (tran) => eq(tran.tranId, input.tranId),
    with: {
      transactionType: true,
      account: {
        with: {
          accountType: true,
        },
      },
      employee: true,
      customer: true,
      vendor: true,
    },
  });

  await editAccount({
    accId: editedTran!.tranAccId as string,
    newData: {
      accName: input.tranAccName,
      accTypeId: input.tranAccTypeId,
      accAmount: input.tranAmount,
    },
  });

  return editedTran;
};
