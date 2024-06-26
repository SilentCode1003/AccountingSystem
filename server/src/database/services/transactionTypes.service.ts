import crypto from "crypto";
import { eq, not, sql } from "drizzle-orm";
import { DB } from "..";
import accounts from "../schema/accounts.schema";
import transactions from "../schema/transactions.schema";
import tranTypes from "../schema/transactionTypes.schema";
import { inArray } from "drizzle-orm";

export const getAllTransactionTypes = async (db: DB) => {
  const transactionTypes = await db.query.tranTypes.findMany({
    with: {
      accountType: true,
    },
  });

  return transactionTypes;
};

export const getTransactionTypeById = async (db: DB, tranTypeId: string) => {
  const transactionType = await db.query.tranTypes.findFirst({
    where: eq(tranTypes.tranTypeId, tranTypeId),
    with: {
      accountType: true,
    },
  });
  return transactionType;
};

export const addTransactionType = async (
  db: DB,
  input: {
    tranTypeName: string;
    tranTypeAccTypeId: string;
  }
) => {
  const newTransactionTypeId = `tranTypeId ${crypto.randomUUID()}`;
  await db
    .insert(tranTypes)
    .values({ ...input, tranTypeId: newTransactionTypeId })
    .onDuplicateKeyUpdate({
      set: {
        tranTypeId: sql`tran_type_id`,
      },
    });
  const newTransactionType = await getTransactionTypeById(
    db,
    newTransactionTypeId
  );
  return newTransactionType;
};

export const editTransactionType = async (
  db: DB,
  input: {
    tranTypeId: string;
    newData: {
      tranTypeName?: string;
      tranTypeAccTypeId?: string;
    };
  }
) => {
  const prevTranType = await getTransactionTypeById(db, input.tranTypeId);
  console.log(prevTranType);
  console.log(input.newData.tranTypeAccTypeId);

  await db
    .update(tranTypes)
    .set(input.newData)
    .where(eq(tranTypes.tranTypeId, input.tranTypeId));
  const editedTransactionType = await getTransactionTypeById(
    db,
    input.tranTypeId
  );

  const currentTransactions = await db.query.transactions.findMany({
    where: eq(transactions.tranTypeId, input.tranTypeId),
  });

  const accIds = currentTransactions.map((tran) => tran.tranAccId);

  await db
    .update(accounts)
    .set({
      accTypeId: input.newData.tranTypeAccTypeId,
    })
    .where(inArray(accounts.accId, accIds));

  return editedTransactionType;
};

export const changeTransactionTypeIsActive = async (
  db: DB,
  input: {
    tranTypeId: string;
  }
) => {
  await db
    .update(tranTypes)
    .set({
      tranTypeIsActive: not(tranTypes.tranTypeIsActive),
    })
    .where(eq(tranTypes.tranTypeId, input.tranTypeId));
  const editedTransactionType = await getTransactionTypeById(
    db,
    input.tranTypeId
  );
  return editedTransactionType;
};
