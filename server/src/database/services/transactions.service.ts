import crypto from "crypto";
import { desc, eq } from "drizzle-orm";
import { DB } from "..";
import transactions from "../schema/transactions.schema";
import { addAccount, editAccount } from "./accounts.service";
import { getTransactionTypeById } from "./transactionTypes.service";

export const getAllTransactions = async (db: DB) => {
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
      modeOfPayment: true,
    },
    orderBy: desc(transactions.tranTransactionDate),
  });

  return allTransactions;
};

export const addTransaction = async (
  db: DB,
  input: {
    tranDescription: string;
    tranAmount: number;
    tranPartner?: string;
    tranAccTypeId?: string;
    tranTransactionDate: Date;
    tranTypeId: string;
    tranFileMimeType?: string;
    tranOtherPartner?: string;
    tranAccName?: string;
    tranFileName?: string;
    tranMopId: string;
  }
) => {
  const newTransactionId = `tranId ${crypto.randomUUID()}`;

  const transactionType = await getTransactionTypeById(db, input.tranTypeId);

  let newTransaction: typeof transactions.$inferSelect | undefined;
  const newAccount = await addAccount(db, {
    accName: input.tranAccName ?? `ACCOUNT TRANSACTION`,
    accAmount: input.tranAmount,
    accDescription: `TRANSACTION: ${input.tranDescription}`,
    accTypeId:
      input.tranAccTypeId ??
      (
        transactionType as typeof transactionType & {
          accountType: { accTypeId: string };
        }
      ).accountType.accTypeId,
    accCreatedAt: input.tranTransactionDate,
    accIsActive: !(
      transactionType?.tranTypeName.toLowerCase() === "liquidation"
    ),
  });

  await db.insert(transactions).values({
    ...input,
    tranId: newTransactionId,
    tranAccId: newAccount!.accId,
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
    tranFile: `${input.tranFileName ?? newTransactionId}.${
      input.tranFileMimeType ?? "xlsx"
    }`,
    tranTypeId: input.tranTypeId,
    tranOtherPartner: input.tranOtherPartner ?? null,
  });
  newTransaction = await db.query.transactions.findFirst({
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
      modeOfPayment: true,
    },
  });

  return newTransaction;
};

export const editTransaction = async (
  db: DB,
  input: {
    tranId: string;
    tranAccId?: string;
    tranDescription?: string;
    tranAccTypeId?: string;
    tranAmount?: number;
    tranPartner?: string;
    tranTransactionDate?: Date;
    tranFileMimeType?: string;
    tranOtherPartner?: string;
    tranTypeId?: string;
    tranAccName?: string;
    tranMopId?: string;
  }
) => {
  let editedTran: typeof transactions.$inferSelect | undefined;

  await db.transaction(async (tx) => {
    await tx
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
        tranMopId: input.tranMopId,
      })
      .where(eq(transactions.tranId, input.tranId));

    editedTran = await tx.query.transactions.findFirst({
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
        modeOfPayment: true,
      },
    });

    await editAccount(tx, {
      accId: editedTran!.tranAccId as string,
      newData: {
        accName: input.tranAccName,
        accTypeId:
          input.tranAccTypeId ??
          (
            editedTran as typeof transactions.$inferSelect & {
              account: {
                accTypeId: string;
              };
            }
          ).account.accTypeId,
        accAmount: input.tranAmount,
        accCreatedAt: input.tranTransactionDate,
      },
    });
  });

  return editedTran;
};
