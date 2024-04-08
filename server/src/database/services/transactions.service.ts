import db from "../index";
import crypto from "crypto";
import transactions from "../schema/transactions.schema";
import { eq } from "drizzle-orm";
import { addAccount, editAccount } from "./accounts.service";

export const getAllTransactions = async () => {
  const transactions = await db.query.transactions.findMany({
    with: { account: true, employee: true, customer: true, vendor: true },
  });

  return transactions;
};

export const addTransaction = async (input: {
  tranDescription: string;
  tranAmount: number;
  tranEmpId?: string;
  tranVdId?: string;
  tranCustId?: string;
  tranTransactionDate: Date;
  tranCreatedAt: Date;
  tranUpdatedAt: Date;
}) => {
  const newTransactionId = `tranId ${crypto.randomUUID()}`;

  const newAccount = await addAccount({
    accAmount: input.tranAmount,
    accDescription: input.tranDescription,
    accType: "EXPENSE",
  });

  await db.insert(transactions).values({
    ...input,
    tranId: newTransactionId,
    tranAccId: newAccount!.accId,
  });

  const newTransaction = await db.query.transactions.findFirst({
    where: (transaction) => eq(transaction.tranId, newTransactionId),
  });

  return newTransaction;
};

export const editTransaction = async (input: {
  tranId: string;
  newData: {
    tranAccId?: string;
    tranDescription?: string;
    tranAmount?: number;
    tranEmpId?: string;
    tranVdId?: string;
    tranCustId?: string;
    tranTransactionDate?: Date;
    tranCreatedAt?: Date;
    tranUpdatedAt?: Date;
  };
}) => {
  await db
    .update(transactions)
    .set(input.newData)
    .where(eq(transactions.tranId, input.tranId));

  await editAccount({
    accId: input.newData.tranAccId as string,
    newData: {
      accAmount: input.newData.tranAmount,
    },
  });

  const editedTran = await db.query.transactions.findFirst({
    where: (tran) => eq(tran.tranId, input.tranId),
    with: { account: true, employee: true, customer: true, vendor: true },
  });

  return editedTran;
};
