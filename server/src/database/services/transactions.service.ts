import crypto from "crypto";
import { desc, eq } from "drizzle-orm";
import db from "../index";
import transactions from "../schema/transactions.schema";
import { addAccount, editAccount } from "./accounts.service";

export const getAllTransactions = async () => {
  const allTransactions = await db.query.transactions.findMany({
    with: {
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
    tranFile: `${newTransactionId}.xlsx`,
  });

  const newTransaction = await db.query.transactions.findFirst({
    where: (transaction) => eq(transaction.tranId, newTransactionId),
    with: {
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
}) => {
  await db
    .update(transactions)
    .set({
      tranAccId: input.tranAccId,
      tranAmount: input.tranAmount,
      tranDescription: input.tranDescription,
      tranTransactionDate: input.tranTransactionDate,

      tranEmpId:
        input.tranPartner!.split(" ")[0] === "empId" ? input.tranPartner : null,
      tranCustId:
        input.tranPartner!.split(" ")[0] === "custId"
          ? input.tranPartner
          : null,
      tranVdId:
        input.tranPartner!.split(" ")[0] === "vdId" ? input.tranPartner : null,
    })
    .where(eq(transactions.tranId, input.tranId));

  await editAccount({
    accId: input.tranAccId as string,
    newData: {
      accTypeId: input.tranAccTypeId,
      accAmount: input.tranAmount,
    },
  });

  const editedTran = await db.query.transactions.findFirst({
    where: (tran) => eq(tran.tranId, input.tranId),
    with: {
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

  return editedTran;
};
