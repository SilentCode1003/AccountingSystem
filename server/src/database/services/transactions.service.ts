import db from "../index";
import crypto from "crypto";
import transactions from "../schema/transactions.schema";
import { eq } from "drizzle-orm";
import { addAccount, editAccount } from "./accounts.service";

export const getAllTransactions = async () => {
  const transactions = await db.query.transactions.findMany({
    with: {
      account: { accountType: true },
      employee: true,
      customer: true,
      vendor: true,
    },
  });

  return transactions;
};

export const addTransaction = async (input: {
  tranDescription: string;
  tranAmount: number;
  tranPartner: string;
  tranTransactionDate: Date;
  tranAccTypeId: string;
}) => {
  const newTransactionId = `tranId ${crypto.randomUUID()}`;

  const newAccount = await addAccount({
    accName: `ACCOUNT TRANSACTION`,
    accAmount: input.tranAmount,
    accDescription: `${input.tranAccTypeId} TRANSACTION`,
    accTypeId: input.tranAccTypeId,
  });

  await db.insert(transactions).values({
    tranId: newTransactionId,
    tranAccId: newAccount!.accId,
    tranAmount: input.tranAmount,
    tranDescription: input.tranDescription,
    tranTransactionDate: input.tranTransactionDate,
    tranEmpId:
      input.tranPartner.split(" ")[0] === "empId" ? input.tranPartner : null,
    tranCustId:
      input.tranPartner.split(" ")[0] === "custId" ? input.tranPartner : null,
    tranVdId:
      input.tranPartner.split(" ")[0] === "vdId" ? input.tranPartner : null,
  });

  const newTransaction = await db.query.transactions.findFirst({
    where: (transaction) => eq(transaction.tranId, newTransactionId),
    with: {
      account: { accountType: true },
      employee: true,
      customer: true,
      vendor: true,
    },
  });

  return newTransaction;
};

export const editTransaction = async (input: {
  tranId: string;
  newData: {
    tranAccId?: string;
    tranDescription?: string;
    tranAmount?: number;
    tranPartner?: string;
    tranAccTypeId?: string;
    tranTransactionDate?: Date;
  };
}) => {
  await db
    .update(transactions)
    .set({
      tranAccId: input.newData.tranAccId,
      tranAmount: input.newData.tranAmount,
      tranDescription: input.newData.tranDescription,
      tranTransactionDate: input.newData.tranTransactionDate,
      tranEmpId:
        input.newData.tranPartner!.split(" ")[0] === "empId"
          ? input.newData.tranPartner
          : null,
      tranCustId:
        input.newData.tranPartner!.split(" ")[0] === "custId"
          ? input.newData.tranPartner
          : null,
      tranVdId:
        input.newData.tranPartner!.split(" ")[0] === "vdId"
          ? input.newData.tranPartner
          : null,
    })
    .where(eq(transactions.tranId, input.tranId));

  await editAccount({
    accId: input.newData.tranAccId as string,
    newData: {
      accTypeId: input.newData.tranAccTypeId,
      accAmount: input.newData.tranAmount,
    },
  });

  const editedTran = await db.query.transactions.findFirst({
    where: (tran) => eq(tran.tranId, input.tranId),
    with: {
      account: { accountType: true },
      employee: true,
      customer: true,
      vendor: true,
    },
  });

  return editedTran;
};
