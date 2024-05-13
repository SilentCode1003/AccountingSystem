import crypto from "crypto";
import { eq } from "drizzle-orm";
import db from "..";
import tranTypes from "../schema/transactionTypes.schema";

export const getAllTransactionTypes = async () => {
  const transactionTypes = await db.query.tranTypes.findMany({
    with: {
      transactions: true,
    },
  });

  return transactionTypes;
};

export const getTransactionTypeById = async (tranTypeId: string) => {
  const transactionType = await db.query.tranTypes.findFirst({
    where: eq(tranTypes.tranTypeId, tranTypeId),
    with: {
      transactions: true,
    },
  });
  return transactionType;
};

export const addTransactionType = async (input: { tranTypeName: string }) => {
  const newTransactionTypeId = `tranTypeId ${crypto.randomUUID()}`;
  await db
    .insert(tranTypes)
    .values({ ...input, tranTypeId: newTransactionTypeId });
  const newTransactionType = await getTransactionTypeById(newTransactionTypeId);
  return newTransactionType;
};

export const editTransactionType = async (input: {
  tranTypeId: string;
  newData: {
    tranTypeName?: string;
  };
}) => {
  await db
    .update(tranTypes)
    .set(input.newData)
    .where(eq(tranTypes.tranTypeId, input.tranTypeId));
  const editedTransactionType = await getTransactionTypeById(input.tranTypeId);
  return editedTransactionType;
};

export const removeTransactionType = async (input: { tranTypeId: string }) => {
  await db.delete(tranTypes).where(eq(tranTypes.tranTypeId, input.tranTypeId));
};
